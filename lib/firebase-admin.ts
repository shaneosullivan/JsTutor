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
      projectId: serviceAccount.project_id,
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

// Account data interface for Firestore
export interface FirestoreAccountData {
  accountId: string;
  email: string;
  data: any; // TinyBase store data
  lastUpdated: string; // ISO timestamp
  version: number; // For conflict resolution
}

// Save account data to Firestore
export async function saveAccountData(
  accountId: string,
  email: string,
  data: any
): Promise<void> {
  if (!serviceAccount) {
    throw new Error(
      "Firebase is not configured. Please add Firebase service account configuration."
    );
  }

  const firestore = getFirestoreDb();

  const accountData: FirestoreAccountData = {
    accountId,
    email,
    data,
    lastUpdated: new Date().toISOString(),
    version: Date.now(), // Use timestamp as version
  };

  await firestore
    .collection("accounts")
    .doc(accountId)
    .set(accountData, { merge: true });
}

// Get account data from Firestore
export async function getAccountData(
  accountId: string
): Promise<FirestoreAccountData | null> {
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

  return doc.data() as FirestoreAccountData;
}

// Check if remote data is newer than local timestamp
export async function isRemoteDataNewer(
  accountId: string,
  localTimestamp: string
): Promise<boolean> {
  if (!serviceAccount) {
    throw new Error(
      "Firebase is not configured. Please add Firebase service account configuration."
    );
  }

  const remoteData = await getAccountData(accountId);

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
  accountData: FirestoreAccountData;
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
      const existingData = existingDoc.data() as FirestoreAccountData;

      return {
        accountId: existingData.accountId,
        isNewAccount: false,
        accountData: existingData,
      };
    }

    console.log(
      "No existing account found, creating new one for email:",
      email
    );
    // No existing account found, create new one
    const newAccountId = `account_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    const now = new Date().toISOString();

    const initialAccountData = {
      tables: {
        profiles: {},
        accounts: {
          [newAccountId]: {
            id: newAccountId,
            email: email,
            provider: "google",
            createdAt: now,
            lastSignIn: now,
          },
        },
      },
      values: {
        activeAccountId: newAccountId,
      },
    };

    const accountData: FirestoreAccountData = {
      accountId: newAccountId,
      email: email,
      data: initialAccountData,
      lastUpdated: now,
      version: Date.now(),
    };

    // Create account document
    const accountRef = firestore.collection("accounts").doc(newAccountId);
    await accountRef.set(accountData);

    return {
      accountId: newAccountId,
      isNewAccount: true,
      accountData: accountData,
    };
  } catch (error) {
    console.error("Error in createOrGetAccountByEmail:", error);
    throw error;
  }
}
