// Profile management and local storage utilities using new decoupled system
import { createStore } from "tinybase";
import { createLocalPersister } from "tinybase/persisters/persister-browser";
import { createCustomPersister } from "tinybase/persisters";
import type { Changes, Store } from "tinybase";
import { AccountData, UserProfile, CourseProgress, TutorialCode } from "@/lib/types";
import {
  getAccountFromStorage,
  saveAccountToStorage,
  // getProfilesByAccountFromStorage,
  saveProfileToStorage,
  removeProfileFromStorage,
  getCourseProgressByAccountAndProfileFromStorage,
  saveCourseProgressToStorage,
  // removeCourseProgressFromStorage,
} from "@/lib/local-storage";

// Legacy interfaces for backward compatibility
export interface Account {
  id: string;
  email: string;
  provider: "google";
  createdAt: string;
  lastSignIn: string;
}

// Constants
const DEFAULT_PROFILE_ID = "default";

// Create TinyBase store with localStorage persistence
const store: Store = createStore();
let persister: any = null;
let firebasePersister: any = null;

// Initialize persistence only on client side
if (typeof window !== "undefined") {
  persister = createLocalPersister(store, "jstutor_tinybase");

  // Create Firebase custom persister with granular updates
  firebasePersister = createCustomPersister(
    store,
    // getPersisted: Load data from Firebase (load all data on startup)
    async (): Promise<undefined> => {
      const activeAccount = getActiveAccount();
      if (!activeAccount) {
        return undefined;
      }

      try {
        // Load account data
        const accountResponse = await fetch(`/api/accounts?accountId=${activeAccount.id}`);
        if (accountResponse.ok) {
          const accountResult = await accountResponse.json();
          saveAccountToStorage(accountResult.data);
        }

        // Load profiles
        const profilesResponse = await fetch(`/api/profiles?accountId=${activeAccount.id}`);
        if (profilesResponse.ok) {
          const profilesResult = await profilesResponse.json();
          profilesResult.data.forEach((profile: UserProfile) => {
            saveProfileToStorage(profile);
          });
        }

        // Load course progress for active profile
        const activeProfile = getActiveProfile();
        if (activeProfile) {
          const progressResponse = await fetch(
            `/api/course-progress?accountId=${activeAccount.id}&profileId=${activeProfile.id}`
          );
          if (progressResponse.ok) {
            const progressResult = await progressResponse.json();
            progressResult.data.forEach((progress: CourseProgress) => {
              saveCourseProgressToStorage(progress);
            });
          }
        }

        return undefined; // We handle storage ourselves
      } catch (error) {
        console.warn("Failed to load from Firebase:", error);
        return undefined;
      }
    },
    // setPersisted: Save data to Firebase based on change type
    async (_getContent, _changes?: Changes | undefined) => {
      const activeAccount = getActiveAccount();
      if (!activeAccount) {
        return;
      }

      const activeProfile = getActiveProfile();
      if (!activeProfile) {
        return;
      }

      // We'll throttle the sync to avoid too many API calls
      throttledSync(activeAccount, activeProfile);
    },
    () => null, // addPersisterListener
    () => {} // delPersisterListener
  );

  // Start persistence
  persister
    .startAutoLoad()
    .then(() => {
      persister.startAutoSave();
      ensureDefaultProfile();
      initializeFirebasePersister();
    })
    .catch((error: any) => {
      console.warn("Failed to load from localStorage:", error);
      ensureDefaultProfile();
    });
} else {
  ensureDefaultProfile();
}


// Throttle sync to avoid too many API calls
let syncTimeout: NodeJS.Timeout | null = null;
let pendingChanges = new Set<string>();

function throttledSync(activeAccount: Account, activeProfile: UserProfile) {
  // Clear existing timeout
  if (syncTimeout) {
    clearTimeout(syncTimeout);
  }
  
  // Set new timeout to batch changes
  syncTimeout = setTimeout(async () => {
    try {
      await processPendingChanges(activeAccount, activeProfile);
    } catch (error) {
      console.warn("Failed to process pending changes:", error);
    }
  }, 1000); // 1 second debounce
}

// Track last synced state to detect actual changes
let lastSyncedState = {
  profiles: {} as Record<string, any>,
  accounts: {} as Record<string, any>,
  values: {} as Record<string, any>,
  tutorialCode: {} as Record<string, any>,
};

async function processPendingChanges(activeAccount: Account, activeProfile: UserProfile) {
  // Get current state
  const currentProfiles = store.getTable("profiles");
  const currentAccounts = store.getTable("accounts");
  const currentValues = store.getValues();
  
  // Sync profiles - only sync the currently active profile (since only it can change)
  const activeProfileData = currentProfiles[activeProfile.id];
  const lastActiveProfile = lastSyncedState.profiles[activeProfile.id];
  
  if (activeProfileData && JSON.stringify(activeProfileData) !== JSON.stringify(lastActiveProfile)) {
    const profile = activeProfileData as unknown as UserProfile;
    const profileWithAccount: UserProfile = {
      ...profile,
      accountId: activeAccount.id,
    };
    
    try {
      await fetch("/api/profiles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileWithAccount),
      });
      saveProfileToStorage(profileWithAccount);
      lastSyncedState.profiles[activeProfile.id] = { ...profile };
    } catch (error) {
      console.warn(`Failed to sync profile ${activeProfile.id}:`, error);
    }
  }

  // Sync accounts - only sync the currently active account (since only it can change)
  const currentAccountData = currentAccounts[activeAccount.id];
  const lastAccountData = lastSyncedState.accounts[activeAccount.id];
  
  if (currentAccountData && JSON.stringify(currentAccountData) !== JSON.stringify(lastAccountData)) {
    const account = currentAccountData as unknown as Account;
    const accountForApi: AccountData = {
      id: account.id,
      email: account.email,
      lastUpdated: new Date().toISOString(),
      version: Date.now(),
    };
    
    try {
      await fetch("/api/accounts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(accountForApi),
      });
      saveAccountToStorage(accountForApi);
      lastSyncedState.accounts[activeAccount.id] = { ...account };
    } catch (error) {
      console.warn(`Failed to sync active account ${activeAccount.id}:`, error);
    }
  }

  // Sync tutorial code - only for the active profile (since only it can have changes)
  const currentTutorialCode = store.getTable("tutorialCode");
  const activeProfileTutorialCode = Object.entries(currentTutorialCode)
    .filter(([_, tutorialData]) => {
      const tutorial = tutorialData as unknown as TutorialCode;
      return tutorial.profileId === activeProfile.id;
    });
  
  // Check if any tutorial code changed for the active profile
  const changedTutorialCode = activeProfileTutorialCode.filter(([tutorialId, tutorialData]) => 
    JSON.stringify(tutorialData) !== JSON.stringify(lastSyncedState.tutorialCode[tutorialId])
  );
  
  if (changedTutorialCode.length > 0) {
    try {
      // Group changed tutorial code by course and sync only affected courses
      const courseGroups = new Map<number, TutorialCode[]>();
      
      changedTutorialCode.forEach(([_, tutorialData]) => {
        const tutorial = tutorialData as unknown as TutorialCode;
        if (!courseGroups.has(tutorial.courseId)) {
          courseGroups.set(tutorial.courseId, []);
        }
        courseGroups.get(tutorial.courseId)!.push(tutorial);
      });
      
      // Sync each affected course's tutorial code for the active profile
      for (const [courseId, tutorials] of courseGroups) {
        await syncTutorialCodeForCourse(activeAccount.id, activeProfile.id, courseId, tutorials);
      }
      
      // Update last synced state for changed tutorial code
      changedTutorialCode.forEach(([tutorialId, tutorialData]) => {
        lastSyncedState.tutorialCode[tutorialId] = JSON.parse(JSON.stringify(tutorialData));
      });
    } catch (error) {
      console.warn("Failed to sync tutorial code for active profile:", error);
    }
  }
  
  // Sync other course progress values (completed courses, current tutorial, etc.)
  const activeProfilePrefix = `${activeProfile.id}_`;
  const relevantValues = Object.entries(currentValues).filter(([key]) => 
    key.startsWith(activeProfilePrefix)
  );
  
  // Check if any course progress values changed for the active profile
  const changedValues = relevantValues.filter(([key, value]) => 
    JSON.stringify(value) !== JSON.stringify(lastSyncedState.values[key])
  );
  
  if (changedValues.length > 0) {
    try {
      // Group changed values by course and sync only affected courses
      const courseGroups = new Map<string, Record<string, any>>();
      
      changedValues.forEach(([key, value]) => {
        const courseId = extractCourseId(key);
        if (courseId) {
          if (!courseGroups.has(courseId)) {
            courseGroups.set(courseId, {});
          }
          const cleanKey = key.replace(activeProfilePrefix, "");
          courseGroups.get(courseId)![cleanKey] = value;
        }
      });
      
      // Sync each affected course's progress for the active profile
      for (const [courseId, courseData] of courseGroups) {
        await syncCourseProgressForCourse(activeAccount.id, activeProfile.id, courseId, courseData);
      }
      
      // Update last synced state for changed values
      changedValues.forEach(([key, value]) => {
        lastSyncedState.values[key] = JSON.parse(JSON.stringify(value));
      });
    } catch (error) {
      console.warn("Failed to sync course progress for active profile:", error);
    }
  }
  
  // Clear pending changes
  pendingChanges.clear();
}

// Extract course ID from a profile-scoped key
function extractCourseId(key: string): string | null {
  if (key.includes("_course_")) {
    const match = key.match(/_course_(\d+)/);
    return match ? match[1] : null;
  } else if (key.includes("_tutorial_")) {
    // For tutorial data, we need to map to course - simplified approach
    return "1"; // Default to course 1
  } else if (key.includes("completedCourses")) {
    return "general";
  }
  return null;
}

// Sync tutorial code for a specific course
async function syncTutorialCodeForCourse(
  accountId: string,
  profileId: string,
  courseId: number,
  tutorials: TutorialCode[]
): Promise<void> {
  // Get or create course progress
  let courseProgress = getCourseProgressByAccountAndProfileFromStorage(accountId, profileId).find(
    cp => cp.courseId === courseId.toString()
  );

  if (!courseProgress) {
    courseProgress = {
      accountId,
      profileId,
      courseId: courseId.toString(),
      tutorialCode: {},
      lastUpdated: new Date().toISOString(),
    };
  }

  // Build tutorial code object from the TutorialCode table data
  const tutorialCode: Record<string, any> = { ...courseProgress.tutorialCode };
  
  tutorials.forEach(tutorial => {
    tutorialCode[tutorial.tutorialId.toString()] = {
      code: tutorial.code,
      completed: tutorial.completed,
      lastAccessed: tutorial.lastAccessed,
    };
  });

  // Update course progress
  courseProgress.tutorialCode = tutorialCode;
  courseProgress.lastUpdated = new Date().toISOString();

  // Save to Firebase and local storage
  await fetch("/api/course-progress", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(courseProgress),
  });

  saveCourseProgressToStorage(courseProgress);
}

// Sync course progress for a specific course (non-tutorial data)
async function syncCourseProgressForCourse(
  accountId: string,
  profileId: string,
  courseId: string,
  courseData: Record<string, any>
): Promise<void> {
  // Get or create course progress
  let courseProgress = getCourseProgressByAccountAndProfileFromStorage(accountId, profileId).find(
    cp => cp.courseId === courseId
  );

  if (!courseProgress) {
    courseProgress = {
      accountId,
      profileId,
      courseId,
      tutorialCode: {},
      lastUpdated: new Date().toISOString(),
    };
  }

  // Handle completed tutorials from the legacy values
  Object.entries(courseData).forEach(([key, value]) => {
    if (key.startsWith("completedTutorials_course_")) {
      const completedTutorials = Array.isArray(value) ? value : JSON.parse(value || "[]");
      completedTutorials.forEach((tutorialId: number) => {
        if (!courseProgress!.tutorialCode[tutorialId.toString()]) {
          courseProgress!.tutorialCode[tutorialId.toString()] = {
            code: "",
            completed: false,
            lastAccessed: new Date().toISOString(),
          };
        }
        courseProgress!.tutorialCode[tutorialId.toString()].completed = true;
        courseProgress!.tutorialCode[tutorialId.toString()].lastAccessed = new Date().toISOString();
      });
    }
  });

  // Update course progress
  courseProgress.lastUpdated = new Date().toISOString();

  // Save to Firebase and local storage
  await fetch("/api/course-progress", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(courseProgress),
  });

  saveCourseProgressToStorage(courseProgress);
}

// Initialize Firebase persister
async function initializeFirebasePersister(isNewAccount: boolean = false): Promise<void> {
  if (typeof window === "undefined" || !firebasePersister) {
    return;
  }

  const activeAccount = getActiveAccount();
  if (!activeAccount) {
    return;
  }

  try {
    if (isNewAccount) {
      firebasePersister.startAutoSave();
    } else {
      await firebasePersister.load();
      if (persister) {
        await persister.save();
      }
    }
  } catch (error) {
    console.warn("Failed to initialize Firebase persister:", error);
  }
}

// Profile management functions
function ensureDefaultProfile(): void {
  if (typeof window === "undefined") return;

  const profiles = getProfilesInternal();
  if (profiles.length === 0) {
    const defaultProfile: UserProfile = {
      id: DEFAULT_PROFILE_ID,
      accountId: "", // Will be set when account is created
      name: "No Name",
      icon: "short_brown",
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
    };

    store.setRow("profiles", DEFAULT_PROFILE_ID, defaultProfile as any);
    store.setValue("activeProfileId", DEFAULT_PROFILE_ID);

    if (persister) {
      persister.save().catch((error: any) => {
        console.warn("Failed to save default profile:", error);
      });
    }
  }
}

function getProfilesInternal(): UserProfile[] {
  const profilesTable = store.getTable("profiles");
  return Object.values(profilesTable).map(row => row as unknown as UserProfile);
}

export function getAllProfiles(): UserProfile[] {
  ensureDefaultProfile();
  return getProfilesInternal();
}

export function getActiveProfile(): UserProfile {
  ensureDefaultProfile();

  const activeProfileId = (store.getValue("activeProfileId") as string) || DEFAULT_PROFILE_ID;
  const profile = store.getRow("profiles", activeProfileId) as unknown as UserProfile;

  if (!profile) {
    const profiles = getAllProfiles();
    const firstProfile = profiles[0];
    if (firstProfile) {
      setActiveProfile(firstProfile.id);
      return firstProfile;
    }
    ensureDefaultProfile();
    return getAllProfiles()[0];
  }

  return profile;
}

export function setActiveProfile(profileId: string): boolean {
  const profile = store.getRow("profiles", profileId) as unknown as UserProfile;
  if (!profile) {
    return false;
  }

  const updatedProfile = { ...profile, lastActive: new Date().toISOString() };
  store.setRow("profiles", profileId, updatedProfile as any);
  store.setValue("activeProfileId", profileId);

  enableFirebaseAutoSave();
  return true;
}

export function createProfile(name: string, icon: string = "short_brown"): UserProfile {
  const activeAccount = getActiveAccount();
  const newProfile: UserProfile = {
    id: `profile_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
    accountId: activeAccount?.id || "",
    name: name.trim() || "Unnamed Profile",
    icon: icon,
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
  };

  store.setRow("profiles", newProfile.id, newProfile as any);
  enableFirebaseAutoSave();
  return newProfile;
}

export function updateProfile(updatedProfile: UserProfile): boolean {
  const existingProfile = store.getRow("profiles", updatedProfile.id);
  if (!existingProfile) {
    return false;
  }

  const profileWithTimestamp = {
    ...updatedProfile,
    lastActive: new Date().toISOString(),
  };
  store.setRow("profiles", updatedProfile.id, profileWithTimestamp as any);
  enableFirebaseAutoSave();
  return true;
}

export function deleteProfile(profileId: string): boolean {
  const profiles = getAllProfiles();
  if (profiles.length <= 1) {
    return false;
  }

  store.delRow("profiles", profileId);

  const activeProfileId = store.getValue("activeProfileId") as string;
  if (activeProfileId === profileId) {
    const remainingProfiles = getAllProfiles();
    if (remainingProfiles.length > 0) {
      setActiveProfile(remainingProfiles[0].id);
    }
  }

  // Clear profile data
  const allValues = store.getValues();
  Object.keys(allValues).forEach((valueId) => {
    if (valueId.startsWith(`${profileId}_`)) {
      store.delValue(valueId);
    }
  });

  // Clear tutorial code for this profile
  const tutorialCodeTable = store.getTable("tutorialCode");
  Object.keys(tutorialCodeTable).forEach((tutorialCodeId) => {
    if (tutorialCodeId.startsWith(`${profileId}_`)) {
      store.delRow("tutorialCode", tutorialCodeId);
    }
  });

  // Remove from local storage
  removeProfileFromStorage(profileId);

  return true;
}

// Profile-aware storage functions
function getProfileKey(key: string): string {
  const activeProfile = getActiveProfile();
  return `${activeProfile.id}_${key}`;
}

export function getProfileItem(key: string): string | null {
  const profileKey = getProfileKey(key);
  const value = store.getValue(profileKey);
  return value ? String(value) : null;
}

export function setProfileItem(key: string, value: string): void {
  const profileKey = getProfileKey(key);
  store.setValue(profileKey, value);
}

export function removeProfileItem(key: string): void {
  const profileKey = getProfileKey(key);
  store.delValue(profileKey);
}

export function getProfileItemAsArray(key: string): any[] {
  try {
    const item = getProfileItem(key);
    return item ? JSON.parse(item) : [];
  } catch (error) {
    console.error(`Error parsing array from key ${key}:`, error);
    return [];
  }
}

export function setProfileItemAsArray(key: string, value: any[]): void {
  setProfileItem(key, JSON.stringify(value));
}

export function getProfileItemAsObject(key: string, defaultValue: any = {}): any {
  try {
    const item = getProfileItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error parsing object from key ${key}:`, error);
    return defaultValue;
  }
}

export function setProfileItemAsObject(key: string, value: any): void {
  setProfileItem(key, JSON.stringify(value));
}


// Tutorial/course convenience functions
export function getCompletedTutorials(courseId: number): number[] {
  return getProfileItemAsArray(`completedTutorials_course_${courseId}`);
}

export function setCompletedTutorials(courseId: number, tutorialIds: number[]): void {
  setProfileItemAsArray(`completedTutorials_course_${courseId}`, tutorialIds);
}

export function getCurrentTutorial(courseId: number): number | null {
  const item = getProfileItem(`currentTutorial_course_${courseId}`);
  return item ? parseInt(item) : null;
}

export function setCurrentTutorial(courseId: number, tutorialOrder: number): void {
  setProfileItem(`currentTutorial_course_${courseId}`, tutorialOrder.toString());
}

// Updated tutorial code functions using TinyBase table
export function getUserCode(tutorialId: number): string | null {
  const activeProfile = getActiveProfile();
  const tutorialCodeId = `${activeProfile.id}_${tutorialId}`;
  const tutorialCode = store.getRow("tutorialCode", tutorialCodeId) as unknown as TutorialCode;
  return tutorialCode?.code || null;
}

export function setUserCode(tutorialId: number, code: string, courseId: number = 1): void {
  const activeProfile = getActiveProfile();
  const tutorialCodeId = `${activeProfile.id}_${tutorialId}`;
  
  const tutorialCode: TutorialCode = {
    id: tutorialCodeId,
    profileId: activeProfile.id,
    tutorialId,
    courseId,
    code,
    completed: false, // Will be updated separately
    lastAccessed: new Date().toISOString(),
  };
  
  store.setRow("tutorialCode", tutorialCodeId, tutorialCode as any);
  
  // Force the Firebase persister to sync
  if (firebasePersister) {
    firebasePersister.save?.();
  }
}

export function getTutorialCode(tutorialId: number): TutorialCode | null {
  const activeProfile = getActiveProfile();
  const tutorialCodeId = `${activeProfile.id}_${tutorialId}`;
  const tutorialCode = store.getRow("tutorialCode", tutorialCodeId) as unknown as TutorialCode;
  return tutorialCode || null;
}

export function setTutorialCompleted(tutorialId: number, completed: boolean, courseId: number = 1): void {
  const activeProfile = getActiveProfile();
  const tutorialCodeId = `${activeProfile.id}_${tutorialId}`;
  
  let tutorialCode = store.getRow("tutorialCode", tutorialCodeId) as unknown as TutorialCode;
  
  if (!tutorialCode) {
    tutorialCode = {
      id: tutorialCodeId,
      profileId: activeProfile.id,
      tutorialId,
      courseId,
      code: "",
      completed,
      lastAccessed: new Date().toISOString(),
    };
  } else {
    tutorialCode = {
      ...tutorialCode,
      completed,
      lastAccessed: new Date().toISOString(),
    };
  }
  
  store.setRow("tutorialCode", tutorialCodeId, tutorialCode as any);
}

export function getTutorialCodesForProfile(profileId: string): TutorialCode[] {
  const tutorialCodeTable = store.getTable("tutorialCode");
  return Object.values(tutorialCodeTable)
    .map(row => row as unknown as TutorialCode)
    .filter(tutorialCode => tutorialCode.profileId === profileId);
}

export function getTutorialCodesForCourse(courseId: number): TutorialCode[] {
  const activeProfile = getActiveProfile();
  const tutorialCodeTable = store.getTable("tutorialCode");
  return Object.values(tutorialCodeTable)
    .map(row => row as unknown as TutorialCode)
    .filter(tutorialCode => tutorialCode.profileId === activeProfile.id && tutorialCode.courseId === courseId);
}

export function getCompletedCourses(): number[] {
  return getProfileItemAsArray("completedCourses");
}

export function setCompletedCourses(courseIds: number[]): void {
  setProfileItemAsArray("completedCourses", courseIds);
}

// Account management functions
export function createAccount(email: string, provider: "google" = "google"): Account {
  const newAccount: Account = {
    id: `account_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
    email: email,
    provider: provider,
    createdAt: new Date().toISOString(),
    lastSignIn: new Date().toISOString(),
  };

  store.setRow("accounts", newAccount.id, newAccount as any);
  store.setValue("activeAccountId", newAccount.id);
  return newAccount;
}

export function getActiveAccount(): Account | null {
  const activeAccountId = store.getValue("activeAccountId") as string;
  if (!activeAccountId) return null;

  const account = store.getRow("accounts", activeAccountId) as unknown as Account;
  return account || null;
}

export function getAllAccounts(): Account[] {
  const accountsTable = store.getTable("accounts");
  return Object.values(accountsTable).map(row => row as unknown as Account);
}

export function updateAccountLastSignIn(accountId: string): void {
  const account = store.getRow("accounts", accountId) as unknown as Account;
  if (account) {
    const updatedAccount = { ...account, lastSignIn: new Date().toISOString() };
    store.setRow("accounts", accountId, updatedAccount as any);
  }
}

export function removeAccount(accountId: string): boolean {
  const account = store.getRow("accounts", accountId);
  if (!account) return false;

  store.delRow("accounts", accountId);
  
  const activeAccountId = store.getValue("activeAccountId") as string;
  if (activeAccountId === accountId) {
    store.delValue("activeAccountId");
  }

  if (persister) {
    persister.save().catch((error: any) => {
      console.warn("Failed to save account removal:", error);
    });
  }

  return true;
}

export function setActiveAccount(accountId: string): boolean {
  const account = store.getRow("accounts", accountId) as unknown as Account;
  if (!account) return false;

  store.setValue("activeAccountId", accountId);
  updateAccountLastSignIn(accountId);
  return true;
}

// Utility functions
export function getStore(): Store {
  return store;
}

export function getPersister() {
  return persister;
}

export function getFirebasePersister() {
  return firebasePersister;
}

export async function initializeFirebaseSync(isNewAccount: boolean = false): Promise<void> {
  await initializeFirebasePersister(isNewAccount);
}

export function enableFirebaseAutoSave(): void {
  if (firebasePersister && getActiveAccount()) {
    firebasePersister.startAutoSave();
  }
}

// Migrate existing tutorial code from values to tutorialCode table
function migrateTutorialCodeToTable(): void {
  const allValues = store.getValues();
  const profiles = store.getTable("profiles");
  
  Object.keys(profiles).forEach(profileId => {
    Object.entries(allValues).forEach(([key, value]) => {
      if (key.startsWith(`${profileId}_userCode_tutorial_`)) {
        const tutorialId = parseInt(key.replace(`${profileId}_userCode_tutorial_`, ""));
        const tutorialCodeId = `${profileId}_${tutorialId}`;
        
        // Check if already exists in table
        const existingTutorialCode = store.getRow("tutorialCode", tutorialCodeId);
        if (!existingTutorialCode) {
          const tutorialCode: TutorialCode = {
            id: tutorialCodeId,
            profileId,
            tutorialId,
            courseId: 1, // Default to course 1 for migrated data
            code: value as string,
            completed: false,
            lastAccessed: new Date().toISOString(),
          };
          
          store.setRow("tutorialCode", tutorialCodeId, tutorialCode as any);
        }
      }
    });
  });
}

export async function initializeProfileSystem(): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    if (persister) {
      await persister.startAutoLoad();
      persister.startAutoSave();
    }
    
    ensureDefaultProfile();
    
    // Migrate existing tutorial code to the new table structure
    migrateTutorialCodeToTable();
    
    const activeAccount = getActiveAccount();
    if (activeAccount) {
      await initializeFirebasePersister();
    }
  } catch (error) {
    console.error("Failed to initialize profile system:", error);
    ensureDefaultProfile();
  }
}

// Legacy compatibility functions (simplified)
export function getLastSyncTimestamp(): string | null {
  const activeAccount = getActiveAccount();
  if (!activeAccount) return null;
  
  const accountData = getAccountFromStorage(activeAccount.id);
  return accountData?.lastUpdated || null;
}

export function setLastSyncTimestamp(timestamp: string): void {
  const activeAccount = getActiveAccount();
  if (!activeAccount) return;
  
  const accountData = getAccountFromStorage(activeAccount.id);
  if (accountData) {
    accountData.lastUpdated = timestamp;
    saveAccountToStorage(accountData);
  }
}

export async function isRemoteDataNewer(): Promise<boolean> {
  const activeAccount = getActiveAccount();
  if (!activeAccount) return false;

  try {
    const response = await fetch(`/api/accounts?accountId=${activeAccount.id}`);
    if (!response.ok) return false;
    
    const result = await response.json();
    const remoteTime = new Date(result.data.lastUpdated).getTime();
    const localTime = new Date(getLastSyncTimestamp() || "1970-01-01").getTime();
    
    return remoteTime > localTime;
  } catch (error) {
    console.warn("Failed to check remote data:", error);
    return false;
  }
}

export async function syncIfNewer(): Promise<boolean> {
  const isNewer = await isRemoteDataNewer();
  if (isNewer && firebasePersister) {
    await firebasePersister.load();
    return true;
  }
  return false;
}