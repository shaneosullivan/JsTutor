// Profile management and local storage utilities using TinyBase
// This module handles all localStorage access with user profile support

import { createStore } from "tinybase";
import { createLocalPersister } from "tinybase/persisters/persister-browser";
import { createCustomPersister } from "tinybase/persisters";
import type { Store } from "tinybase";
import { FIREBASE_ACCOUNTS_COLLECTION } from "./consts";

export interface UserProfile {
  id: string;
  name: string;
  icon: string;
  createdAt: string;
  lastActive: string;
}

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
  persister = createLocalPersister(store, "jstutor");

  // Create Firebase custom persister
  firebasePersister = createCustomPersister(
    store,
    // getPersisted: Load data from Firebase
    async () => {
      const activeAccount = getActiveAccount();
      if (!activeAccount) {
        return null; // No account, no remote data
      }

      try {
        const response = await fetch(`/api/sync?accountId=${activeAccount.id}`);
        if (!response.ok) {
          if (response.status === 404) {
            return null; // Account not found, return null to use local data
          }
          throw new Error(`Failed to load: ${response.statusText}`);
        }

        const result = await response.json();

        // Update sync timestamp when we successfully load data
        setLastSyncTimestamp(result.data.lastUpdated);

        return result.data.data; // Return the TinyBase store data
      } catch (error) {
        console.warn("Failed to load from Firebase:", error);
        return null; // Return null to use local data
      }
    },
    // setPersisted: Save data to Firebase
    async (getContent) => {
      const activeAccount = getActiveAccount();
      if (!activeAccount) {
        return; // No account, no remote save
      }

      try {
        const content = getContent();
        await fetch("/api/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accountId: activeAccount.id,
            email: activeAccount.email,
            data: content,
          }),
        });
      } catch (error) {
        console.warn("Failed to save to Firebase:", error);
        // Don't throw - let local persistence continue
      }
    },
    // addPersisterListener: No external change detection needed
    () => null,
    // delPersisterListener: Cleanup function (not needed)
    () => {},
  );

  // Start persistence
  persister
    .startAutoLoad()
    .then(() => {
      persister.startAutoSave();
      ensureDefaultProfile();

      // Initialize Firebase persister after local data is loaded
      initializeFirebasePersister();
    })
    .catch((error: any) => {
      console.warn(
        "Failed to load from localStorage, creating default profile:",
        error,
      );
      ensureDefaultProfile();
    });
} else {
  // Server-side: just ensure default profile (no persistence)
  ensureDefaultProfile();
}

// Initialize Firebase persister when user signs in
async function initializeFirebasePersister(): Promise<void> {
  if (typeof window === "undefined" || !firebasePersister) {
    return;
  }

  const activeAccount = getActiveAccount();
  if (!activeAccount) {
    return; // No account, no Firebase sync
  }

  try {
    // Load from Firebase first (if data exists and is newer)
    await firebasePersister.load();

    // Start auto-save to Firebase
    firebasePersister.startAutoSave();

    console.log(
      "Firebase persister initialized for account:",
      activeAccount.email,
    );
  } catch (error) {
    console.warn("Failed to initialize Firebase persister:", error);
  }
}

// Table schemas in TinyBase:
// - 'profiles': stores user profiles
// - 'accounts': stores account information for cross-device sync
// - 'settings': stores app settings like activeProfileId
// - 'userData': stores user data scoped by profile

// Internal function to get profiles without triggering default profile creation
function getProfilesInternal(): UserProfile[] {
  const profilesTable = store.getTable("profiles");
  return Object.values(profilesTable).map(
    (row) => row as unknown as UserProfile,
  );
}

// Initialize default profile if none exists
function ensureDefaultProfile(): void {
  // Only initialize on client side
  if (typeof window === "undefined") return;

  const profiles = getProfilesInternal();
  if (profiles.length === 0) {
    const defaultProfile: UserProfile = {
      id: DEFAULT_PROFILE_ID,
      name: "No Name",
      icon: "short_brown",
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
    };

    store.setRow("profiles", DEFAULT_PROFILE_ID, defaultProfile as any);
    store.setValue("activeProfileId", DEFAULT_PROFILE_ID);

    // Force save to localStorage immediately after creating default profile
    if (persister) {
      persister.save().catch((error: any) => {
        console.warn("Failed to save default profile to localStorage:", error);
      });
    }
  }
}

// Profile management functions
export function getAllProfiles(): UserProfile[] {
  ensureDefaultProfile();
  return getProfilesInternal();
}

export function getActiveProfile(): UserProfile {
  ensureDefaultProfile();

  const activeProfileId =
    (store.getValue("activeProfileId") as string) || DEFAULT_PROFILE_ID;
  const profile = store.getRow(
    "profiles",
    activeProfileId,
  ) as unknown as UserProfile;

  if (!profile) {
    // Fallback to first profile if active profile not found
    const profiles = getAllProfiles();
    const firstProfile = profiles[0];
    if (firstProfile) {
      setActiveProfile(firstProfile.id);
      return firstProfile;
    }

    // Create default profile if none exist
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

  // Update last active time
  const updatedProfile = { ...profile, lastActive: new Date().toISOString() };
  store.setRow("profiles", profileId, updatedProfile as any);

  store.setValue("activeProfileId", profileId);
  return true;
}

export function createProfile(
  name: string,
  icon: string = "short_brown",
): UserProfile {
  const newProfile: UserProfile = {
    id: `profile_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
    name: name.trim() || "Unnamed Profile",
    icon: icon,
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
  };

  store.setRow("profiles", newProfile.id, newProfile as any);
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

  return true;
}

export function deleteProfile(profileId: string): boolean {
  const profiles = getAllProfiles();

  // Cannot delete if it's the only profile
  if (profiles.length <= 1) {
    return false;
  }

  // Cannot delete the default profile if it's the only one
  if (profileId === DEFAULT_PROFILE_ID && profiles.length <= 1) {
    return false;
  }

  store.delRow("profiles", profileId);

  // If we deleted the active profile, switch to the first remaining profile
  const activeProfileId = store.getValue("activeProfileId") as string;
  if (activeProfileId === profileId) {
    const remainingProfiles = getAllProfiles();
    if (remainingProfiles.length > 0) {
      setActiveProfile(remainingProfiles[0].id);
    }
  }

  // Also clear all user data for this profile
  const allValues = store.getValues();
  Object.keys(allValues).forEach((valueId) => {
    if (valueId.startsWith(`${profileId}_`)) {
      store.delValue(valueId);
    }
  });

  return true;
}

// Profile-aware TinyBase functions
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
    console.error(`Error parsing array from TinyBase key ${key}:`, error);
    return [];
  }
}

export function setProfileItemAsArray(key: string, value: any[]): void {
  setProfileItem(key, JSON.stringify(value));
}

export function getProfileItemAsObject(
  key: string,
  defaultValue: any = {},
): any {
  try {
    const item = getProfileItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error parsing object from TinyBase key ${key}:`, error);
    return defaultValue;
  }
}

export function setProfileItemAsObject(key: string, value: any): void {
  setProfileItem(key, JSON.stringify(value));
}

// Convenience functions for common tutorial/course data
export function getCompletedTutorials(courseId: number): number[] {
  return getProfileItemAsArray(`completedTutorials_course_${courseId}`);
}

export function setCompletedTutorials(
  courseId: number,
  tutorialIds: number[],
): void {
  setProfileItemAsArray(`completedTutorials_course_${courseId}`, tutorialIds);
}

export function getCurrentTutorial(courseId: number): number | null {
  const item = getProfileItem(`currentTutorial_course_${courseId}`);
  return item ? parseInt(item) : null;
}

export function setCurrentTutorial(
  courseId: number,
  tutorialOrder: number,
): void {
  setProfileItem(
    `currentTutorial_course_${courseId}`,
    tutorialOrder.toString(),
  );
}

export function getUserCode(tutorialId: number): string | null {
  return getProfileItem(`userCode_tutorial_${tutorialId}`);
}

export function setUserCode(tutorialId: number, code: string): void {
  setProfileItem(`userCode_tutorial_${tutorialId}`, code);
}

export function getCompletedCourses(): number[] {
  return getProfileItemAsArray("completedCourses");
}

export function setCompletedCourses(courseIds: number[]): void {
  setProfileItemAsArray("completedCourses", courseIds);
}

// Get the store instance for advanced usage
export function getStore(): Store {
  return store;
}

// Export the persister for advanced usage
export function getPersister() {
  return persister;
}

// Export the Firebase persister
export function getFirebasePersister() {
  return firebasePersister;
}

// Initialize Firebase sync for an account
export async function initializeFirebaseSync(): Promise<void> {
  await initializeFirebasePersister();
}

// Get the last sync timestamp for the active account
export function getLastSyncTimestamp(): string | null {
  const activeAccount = getActiveAccount();
  if (!activeAccount) {
    return null;
  }

  // Store sync timestamp per account
  const syncKey = `_lastSync_${activeAccount.id}`;
  const timestamp = store.getValue(syncKey);
  return timestamp ? String(timestamp) : null;
}

// Set the last sync timestamp for the active account
export function setLastSyncTimestamp(timestamp: string): void {
  const activeAccount = getActiveAccount();
  if (!activeAccount) {
    return;
  }

  const syncKey = `_lastSync_${activeAccount.id}`;
  store.setValue(syncKey, timestamp);
}

// Check if remote data is newer without downloading it
export async function isRemoteDataNewer(): Promise<boolean> {
  const activeAccount = getActiveAccount();
  if (!activeAccount) {
    return false;
  }

  try {
    const response = await fetch(
      `/api/sync/timestamp?accountId=${activeAccount.id}`,
    );

    if (!response.ok) {
      if (response.status === 404) {
        return false; // No remote data
      }
      throw new Error(
        `Failed to check remote timestamp: ${response.statusText}`,
      );
    }

    const remoteInfo = await response.json();
    const remoteTimestamp = new Date(remoteInfo.lastUpdated).getTime();

    const localTimestamp = getLastSyncTimestamp();
    const localTime = localTimestamp ? new Date(localTimestamp).getTime() : 0;

    return remoteTimestamp > localTime;
  } catch (error) {
    console.warn("Failed to check if remote data is newer:", error);
    return false;
  }
}

// Sync from remote if newer data is available
export async function syncIfNewer(): Promise<boolean> {
  const activeAccount = getActiveAccount();
  if (!activeAccount || !firebasePersister) {
    return false;
  }

  try {
    const isNewer = await isRemoteDataNewer();
    if (isNewer) {
      console.log("Remote data is newer, syncing...");
      await firebasePersister.load();

      // Update our local sync timestamp
      setLastSyncTimestamp(new Date().toISOString());
      return true;
    }
    return false;
  } catch (error) {
    console.warn("Failed to sync newer data:", error);
    return false;
  }
}

// Account management functions
export function createAccount(
  email: string,
  provider: "google" = "google",
): Account {
  const newAccount: Account = {
    id: `account_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
    email: email,
    provider: provider,
    createdAt: new Date().toISOString(),
    lastSignIn: new Date().toISOString(),
  };

  store.setRow(FIREBASE_ACCOUNTS_COLLECTION, newAccount.id, newAccount as any);
  store.setValue("activeAccountId", newAccount.id);
  return newAccount;
}

export function getActiveAccount(): Account | null {
  const activeAccountId = store.getValue("activeAccountId") as string;
  if (!activeAccountId) return null;

  const account = store.getRow(
    FIREBASE_ACCOUNTS_COLLECTION,
    activeAccountId,
  ) as unknown as Account;
  return account || null;
}

export function getAllAccounts(): Account[] {
  const accountsTable = store.getTable(FIREBASE_ACCOUNTS_COLLECTION);
  return Object.values(accountsTable).map((row) => row as unknown as Account);
}

export function updateAccountLastSignIn(accountId: string): void {
  const account = store.getRow(
    FIREBASE_ACCOUNTS_COLLECTION,
    accountId,
  ) as unknown as Account;
  if (account) {
    const updatedAccount = { ...account, lastSignIn: new Date().toISOString() };
    store.setRow(
      FIREBASE_ACCOUNTS_COLLECTION,
      accountId,
      updatedAccount as any,
    );
  }
}

export function removeAccount(accountId: string): boolean {
  const account = store.getRow(FIREBASE_ACCOUNTS_COLLECTION, accountId);
  if (!account) return false;

  store.delRow(FIREBASE_ACCOUNTS_COLLECTION, accountId);

  // If this was the active account, clear it
  const activeAccountId = store.getValue("activeAccountId") as string;
  if (activeAccountId === accountId) {
    store.delValue("activeAccountId");
  }

  return true;
}

export function setActiveAccount(accountId: string): boolean {
  const account = store.getRow(
    FIREBASE_ACCOUNTS_COLLECTION,
    accountId,
  ) as unknown as Account;
  if (!account) return false;

  store.setValue("activeAccountId", accountId);
  updateAccountLastSignIn(accountId);
  return true;
}

// Firebase sync using TinyBase custom persister
// The sync is handled automatically by the persister

// Initialize profile system explicitly (useful for components that need to ensure profiles exist)
export async function initializeProfileSystem(): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    if (persister) {
      // Ensure persister is started
      await persister.startAutoLoad();
      // Always try to start auto-save (it's safe to call multiple times)
      persister.startAutoSave();
    }

    // Ensure default profile exists
    ensureDefaultProfile();

    // Check if user has an account and initialize Firebase sync if needed
    const activeAccount = getActiveAccount();
    if (activeAccount) {
      await initializeFirebasePersister();
    }

    // Force save if we created the default profile
    if (persister) {
      await persister.save();
    }
  } catch (error) {
    console.error("Failed to initialize profile system:", error);
    // Fallback: create default profile without persistence
    ensureDefaultProfile();
  }
}
