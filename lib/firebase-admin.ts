import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

// Try to import Firebase config, but handle missing file gracefully
let serviceAccount: any = null;
try {
  // Import using fs for server-side reading to avoid webpack warnings
  if (typeof window === "undefined") {
    const fs = require("fs");
    const path = require("path");
    const configPath = path.join(
      process.cwd(),
      // "..",
      "config",
      "firebase.json"
    );

    if (fs.existsSync(configPath)) {
      console.log("Loading Firebase service account configuration...");
      const configData = fs.readFileSync(configPath, "utf8");
      serviceAccount = JSON.parse(configData);

      // Check if it's a valid config (has required fields)
      if (!serviceAccount.private_key || !serviceAccount.client_email) {
        console.warn(
          "Firebase config found but incomplete. Firebase sync will be disabled."
        );
        serviceAccount = null;
      }
    } else {
      console.warn(
        "Firebase service account config file not found. Firebase sync will be disabled.",
        configPath
      );
    }
  }
} catch (error) {
  console.warn(
    "Firebase service account config not found. Firebase sync will be disabled."
  );
}

let app: App;
let db: Firestore;

// Initialize Firebase Admin SDK
const initializeFirebase = () => {
  if (!serviceAccount) {
    throw new Error("Firebase service account configuration is not available");
  }

  if (getApps().length === 0) {
    app = initializeApp({
      credential: cert(serviceAccount as any),
      projectId: serviceAccount.project_id
    });
  } else {
    app = getApps()[0];
  }

  db = getFirestore(app);
  return { app, db };
};

// Get Firestore instance
export const getFirestoreDb = (): Firestore => {
  if (!db) {
    initializeFirebase();
  }
  return db;
};

import { AccountData, UserProfile, CourseProgress } from "@/lib/types";
import { FIREBASE_CHANGES_COLLECTION } from "./consts";

// Account CRUD operations
export async function getAccountById(
  accountId: string
): Promise<AccountData | null> {
  if (!serviceAccount) {
    throw new Error(
      "Firebase is not configured. Please add Firebase service account configuration."
    );
  }

  const firestore = getFirestoreDb();
  const doc = await firestore.collection("accounts").doc(accountId).get();

  if (!doc.exists) {
    return null;
  }

  return doc.data() as AccountData;
}

export async function createAccount(
  account: AccountData
): Promise<AccountData> {
  if (!serviceAccount) {
    throw new Error(
      "Firebase is not configured. Please add Firebase service account configuration."
    );
  }

  const firestore = getFirestoreDb();
  const accountWithTimestamp = {
    ...account,
    lastUpdated: new Date().toISOString(),
    version: Date.now()
  };

  await firestore
    .collection("accounts")
    .doc(account.id)
    .set(accountWithTimestamp);
  return accountWithTimestamp;
}

type StoreChangeType = "account" | "profile" | "course";

function getChangeDocId(
  accountId: string,
  type: StoreChangeType,
  data?: { courseId?: string; profileId?: string }
): string {
  let docId = `a_${accountId}_t_${type}`;
  if (type === "profile") {
    if (!data || !data.profileId) {
      throw new Error("Profile ID is required for profile changes");
    }
    docId += `_p_${data.profileId}`;
  } else if (type === "course") {
    if (!data || !data.courseId) {
      throw new Error(
        "Tutorial ID and Course ID are required for tutorial changes"
      );
    }
    docId += `_c_${data.courseId}}`;
  }
  return docId;
}

export async function storeChange(
  accountId: string,
  type: StoreChangeType,
  clientId: string,
  data?: { courseId?: string; profileId?: string }
): Promise<string> {
  const firestore = getFirestoreDb();

  let docId = getChangeDocId(accountId, type, data);

  const changeData = {
    accountId,
    type,
    clientId,
    data,
    timestamp: new Date().toISOString()
  };

  await firestore
    .collection(FIREBASE_CHANGES_COLLECTION)
    .doc(docId)
    .set(changeData, { merge: true })
    .then(() => {
      console.log(`Change stored: ${type} for account ${accountId}`);
    })
    .catch((error) => {
      console.error(
        `Error storing change for account ${accountId}:`,
        error.message
      );
    });

  return docId;
}

// Get changes made by different clients in the same account
export async function getChangesForAccount(
  accountId: string,
  currentClientId: string,
  filters?: {
    types?: ("account" | "profile" | "course")[];
    courseId?: string;
  }
): Promise<
  Array<{
    type: "account" | "profile" | "course";
    clientId: string;
    data?: { courseId?: string; profileId?: string };
    timestamp: string;
  }>
> {
  if (!serviceAccount) {
    throw new Error(
      "Firebase is not configured. Please add Firebase service account configuration."
    );
  }

  const firestore = getFirestoreDb();
  let query = firestore
    .collection(FIREBASE_CHANGES_COLLECTION)
    .where("accountId", "==", accountId)
    .where("clientId", "!=", currentClientId);

  const snapshot = await query.get();
  let changes = snapshot.docs.map(
    (doc) =>
      doc.data() as {
        type: "account" | "profile" | "course";
        clientId: string;
        data?: { courseId?: string; profileId?: string };
        timestamp: string;
      }
  );

  // Apply filters
  if (filters?.types) {
    changes = changes.filter((change) => filters.types!.includes(change.type));
  }

  if (filters?.courseId !== undefined) {
    changes = changes.filter(
      (change) =>
        change.type === "course" && change.data?.courseId === filters.courseId
    );
  }

  return changes;
}

// Get objects based on change data
export async function getObjectsFromChanges(
  accountId: string,
  changes: Array<{
    type: "account" | "profile" | "course";
    clientId: string;
    data?: { courseId?: string; profileId?: string };
    timestamp: string;
  }>
): Promise<{
  account: AccountData[];
  profile: UserProfile[];
  course: CourseProgress[];
}> {
  const result = {
    account: [] as AccountData[],
    profile: [] as UserProfile[],
    course: [] as CourseProgress[]
  };

  for (const change of changes) {
    try {
      if (change.type === "account") {
        const account = await getAccountById(accountId);
        if (account && !result.account.find((a) => a.id === account.id)) {
          result.account.push(account);
        }
      } else if (change.type === "profile" && change.data?.profileId) {
        const profiles = await getProfilesByAccountId(accountId);
        const profile = profiles.find((p) => p.id === change.data!.profileId);
        if (profile && !result.profile.find((p) => p.id === profile.id)) {
          result.profile.push(profile);
        }
      } else if (
        change.type === "course" &&
        change.data?.courseId &&
        change.data?.profileId
      ) {
        const profileId = change.data.profileId;
        const courseId = change.data.courseId;
        const courseProgress = await getCourseProgressById(
          accountId,
          profileId,
          courseId
        );
        if (
          courseProgress &&
          !result.course.find(
            (c) =>
              c.accountId === courseProgress.accountId &&
              c.profileId === courseProgress.profileId &&
              c.courseId === courseProgress.courseId
          )
        ) {
          result.course.push(courseProgress);
        }
      }
    } catch (error) {
      console.warn(
        `Failed to get object for change type ${change.type}:`,
        error
      );
    }
  }

  return result;
}

export async function updateAccount(
  account: AccountData
): Promise<AccountData> {
  if (!serviceAccount) {
    throw new Error(
      "Firebase is not configured. Please add Firebase service account configuration."
    );
  }

  const firestore = getFirestoreDb();
  const accountWithTimestamp = {
    ...account,
    lastUpdated: new Date().toISOString(),
    version: Date.now()
  };

  // Use set with merge to handle cases where document doesn't exist
  await firestore
    .collection("accounts")
    .doc(account.id)
    .set(accountWithTimestamp, { merge: true });
  return accountWithTimestamp;
}

// Profile CRUD operations
export async function getProfilesByAccountId(
  accountId: string
): Promise<UserProfile[]> {
  if (!serviceAccount) {
    throw new Error(
      "Firebase is not configured. Please add Firebase service account configuration."
    );
  }

  const firestore = getFirestoreDb();
  const snapshot = await firestore
    .collection("accounts")
    .doc(accountId)
    .collection("profiles")
    .get();

  return snapshot.docs.map((doc) => doc.data() as UserProfile);
}

export async function getProfileById(
  profileId: string
): Promise<UserProfile | null> {
  if (!serviceAccount) {
    throw new Error(
      "Firebase is not configured. Please add Firebase service account configuration."
    );
  }

  const firestore = getFirestoreDb();

  // We need to search across all accounts since we don't know which account the profile belongs to
  // This could be optimized by storing a profile index, but for now this will work
  const accountsSnapshot = await firestore.collection("accounts").get();

  for (const accountDoc of accountsSnapshot.docs) {
    const profileDoc = await accountDoc.ref
      .collection("profiles")
      .doc(profileId)
      .get();
    if (profileDoc.exists) {
      return profileDoc.data() as UserProfile;
    }
  }

  return null;
}

export async function createProfile(
  profile: UserProfile
): Promise<UserProfile> {
  if (!serviceAccount) {
    throw new Error(
      "Firebase is not configured. Please add Firebase service account configuration."
    );
  }

  const firestore = getFirestoreDb();
  const profileWithTimestamp = {
    ...profile,
    createdAt: profile.createdAt || new Date().toISOString(),
    lastActive: new Date().toISOString()
  };

  await firestore
    .collection("accounts")
    .doc(profile.accountId)
    .collection("profiles")
    .doc(profile.id)
    .set(profileWithTimestamp);

  return profileWithTimestamp;
}

export async function updateProfile(
  profile: UserProfile
): Promise<UserProfile> {
  if (!serviceAccount) {
    throw new Error(
      "Firebase is not configured. Please add Firebase service account configuration."
    );
  }

  const firestore = getFirestoreDb();
  const profileWithTimestamp = {
    ...profile,
    lastActive: new Date().toISOString()
  };

  // Use set with merge to handle cases where document doesn't exist
  await firestore
    .collection("accounts")
    .doc(profile.accountId)
    .collection("profiles")
    .doc(profile.id)
    .set(profileWithTimestamp, { merge: true });

  return profileWithTimestamp;
}

export async function deleteProfile(profileId: string): Promise<void> {
  if (!serviceAccount) {
    throw new Error(
      "Firebase is not configured. Please add Firebase service account configuration."
    );
  }

  const firestore = getFirestoreDb();

  // First find which account this profile belongs to
  const profile = await getProfileById(profileId);
  if (!profile) {
    throw new Error("Profile not found");
  }

  // Delete all course progress for this profile
  const courseProgressSnapshot = await firestore
    .collection("accounts")
    .doc(profile.accountId)
    .collection("profiles")
    .doc(profileId)
    .collection("courses")
    .get();

  const batch = firestore.batch();
  courseProgressSnapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });

  // Delete the profile
  batch.delete(
    firestore
      .collection("accounts")
      .doc(profile.accountId)
      .collection("profiles")
      .doc(profileId)
  );

  await batch.commit();
}

// Course Progress CRUD operations
export async function getCourseProgressByAccountAndProfile(
  accountId: string,
  profileId: string
): Promise<CourseProgress[]> {
  if (!serviceAccount) {
    throw new Error(
      "Firebase is not configured. Please add Firebase service account configuration."
    );
  }

  const firestore = getFirestoreDb();
  const snapshot = await firestore
    .collection("accounts")
    .doc(accountId)
    .collection("profiles")
    .doc(profileId)
    .collection("courses")
    .get();

  return snapshot.docs.map((doc) => doc.data() as CourseProgress);
}

export async function getCourseProgressById(
  accountId: string,
  profileId: string,
  courseId: string
): Promise<CourseProgress | null> {
  if (!serviceAccount) {
    throw new Error(
      "Firebase is not configured. Please add Firebase service account configuration."
    );
  }

  const firestore = getFirestoreDb();
  const doc = await firestore
    .collection("accounts")
    .doc(accountId)
    .collection("profiles")
    .doc(profileId)
    .collection("courses")
    .doc(courseId)
    .get();

  if (!doc.exists) {
    return null;
  }

  return doc.data() as CourseProgress;
}

export async function createCourseProgress(
  progress: CourseProgress
): Promise<CourseProgress> {
  if (!serviceAccount) {
    throw new Error(
      "Firebase is not configured. Please add Firebase service account configuration."
    );
  }

  const firestore = getFirestoreDb();
  const progressWithTimestamp = {
    ...progress,
    lastUpdated: new Date().toISOString()
  };

  await firestore
    .collection("accounts")
    .doc(progress.accountId)
    .collection("profiles")
    .doc(progress.profileId)
    .collection("courses")
    .doc(progress.courseId)
    .set(progressWithTimestamp);

  return progressWithTimestamp;
}

export async function updateCourseProgress(
  progress: CourseProgress
): Promise<CourseProgress> {
  if (!serviceAccount) {
    throw new Error(
      "Firebase is not configured. Please add Firebase service account configuration."
    );
  }

  const firestore = getFirestoreDb();
  const progressWithTimestamp = {
    ...progress,
    lastUpdated: new Date().toISOString()
  };

  // Use set with merge to handle cases where document doesn't exist
  await firestore
    .collection("accounts")
    .doc(progress.accountId)
    .collection("profiles")
    .doc(progress.profileId)
    .collection("courses")
    .doc(progress.courseId)
    .set(progressWithTimestamp, { merge: true });

  return progressWithTimestamp;
}

export async function deleteCourseProgress(
  accountId: string,
  profileId: string,
  courseId: string
): Promise<void> {
  if (!serviceAccount) {
    throw new Error(
      "Firebase is not configured. Please add Firebase service account configuration."
    );
  }

  const firestore = getFirestoreDb();
  await firestore
    .collection("accounts")
    .doc(accountId)
    .collection("profiles")
    .doc(profileId)
    .collection("courses")
    .doc(courseId)
    .delete();
}

// Legacy functions for backward compatibility
export async function getAccountData(accountId: string): Promise<any> {
  return await getAccountById(accountId);
}

export async function saveAccountData(
  accountId: string,
  email: string,
  _data: any
): Promise<void> {
  const account: AccountData = {
    id: accountId,
    email,
    lastUpdated: new Date().toISOString(),
    version: Date.now()
  };
  await createAccount(account);
}

export async function isRemoteDataNewer(
  accountId: string,
  localTimestamp: string
): Promise<boolean> {
  const remoteData = await getAccountById(accountId);
  if (!remoteData) {
    return false;
  }
  const remoteTime = new Date(remoteData.lastUpdated).getTime();
  const localTime = new Date(localTimestamp).getTime();
  return remoteTime > localTime;
}

// Find account by email address
export async function findAccountByEmail(
  email: string
): Promise<string | null> {
  if (!serviceAccount) {
    throw new Error(
      "Firebase is not configured. Please add Firebase service account configuration."
    );
  }

  const firestore = getFirestoreDb();

  try {
    // Query accounts collection for matching email
    const query = firestore
      .collection("accounts")
      .where("email", "==", email)
      .limit(1);

    const snapshot = await query.get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return doc.id; // Return the account ID
  } catch (error) {
    console.warn("Error searching for account by email:", error);
    return null;
  }
}

// Create or get existing account atomically by email
export async function createOrGetAccountByEmail(email: string): Promise<{
  accountId: string;
  isNewAccount: boolean;
  accountData: AccountData;
}> {
  if (!serviceAccount) {
    throw new Error(
      "Firebase is not configured. Please add Firebase service account configuration."
    );
  }

  const firestore = getFirestoreDb();

  try {
    // First, search for existing account by email
    const query = firestore
      .collection("accounts")
      .where("email", "==", email)
      .limit(1);

    const snapshot = await query.get();

    if (!snapshot.empty) {
      // Found existing account
      const existingDoc = snapshot.docs[0];
      const existingData = existingDoc.data() as AccountData;

      return {
        accountId: existingData.id,
        isNewAccount: false,
        accountData: existingData
      };
    }

    console.log(
      "No existing account found, creating new one for email:",
      email
    );
    // No existing account found, create new one
    const newAccountId = `account_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    const now = new Date().toISOString();

    // This is just for backward compatibility, actual account data is simpler now

    const accountData: AccountData = {
      id: newAccountId,
      email: email,
      lastUpdated: now,
      version: Date.now()
    };

    // Create account document
    const accountRef = firestore.collection("accounts").doc(newAccountId);
    await accountRef.set(accountData);

    return {
      accountId: newAccountId,
      isNewAccount: true,
      accountData: accountData
    };
  } catch (error) {
    console.error("Error in createOrGetAccountByEmail:", error);
    throw error;
  }
}
