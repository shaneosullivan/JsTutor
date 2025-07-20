// Profile management and local storage utilities using new decoupled system
import { createStore } from "tinybase";
import { createLocalPersister } from "tinybase/persisters/persister-browser";
import { createCustomPersister } from "tinybase/persisters";
import type { Changes, Store } from "tinybase";
import {
  AccountData,
  UserProfile,
  CourseProgress,
  TutorialCode
} from "@/lib/types";

// Import clearSyncCache but only for client-side use
let clearSyncCache: (() => void) | null = null;
let debouncedSyncCourseProgress:
  | ((
      accountId: string,
      profileId: string,
      courseId: string,
      delay?: number
    ) => void)
  | null = null;

if (typeof window !== "undefined") {
  import("@/lib/sync-changes").then((module) => {
    clearSyncCache = module.clearSyncCache;
  });

  import("@/lib/course-progress-sync").then((module) => {
    debouncedSyncCourseProgress = module.debouncedSyncCourseProgress;
  });
}
// Course progress is now computed from TinyBase tutorial data

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
let isLoadingFromFirebase = false;

// Initialize persistence only on client side
if (typeof window !== "undefined") {
  persister = createLocalPersister(store, "jstutor_tinybase");

  // Create Firebase custom persister with granular updates
  firebasePersister = createCustomPersister(
    store,
    // getPersisted: Load data from Firebase (load all data on startup)
    async (): Promise<undefined> => {
      const activeAccount = getActiveAccount();
      if (!activeAccount || !isValidRecord(activeAccount)) {
        return undefined;
      }

      try {
        isLoadingFromFirebase = true;
        // Load account data
        const accountResponse = await fetch(
          `/api/accounts?accountId=${activeAccount.id}`
        );
        if (accountResponse.ok) {
          const accountResult = await accountResponse.json();
          store.setRow(
            "accounts",
            accountResult.data.id,
            accountResult.data as any
          );
        }

        // Load profiles
        const profilesResponse = await fetch(
          `/api/profiles?accountId=${activeAccount.id}`
        );
        if (profilesResponse.ok) {
          const profilesResult = await profilesResponse.json();

          // Check if existing local profiles have progress that should be preserved
          const existingProfiles = store.getTable("profiles");
          const existingTutorialCode = store.getTable("tutorialCode");
          const existingValues = store.getValues();

          // Find profiles with progress (tutorial code or completed tutorials)
          const profilesWithProgress = Object.entries(existingProfiles).filter(
            ([profileId, _profileData]) => {
              // Check if this profile has tutorial code
              const hasTutorialCode = Object.keys(existingTutorialCode).some(
                (codeId) => codeId.startsWith(`${profileId}_`)
              );

              // Check if this profile has completed tutorials or other progress
              const hasProgressValues = Object.keys(existingValues).some(
                (key) =>
                  key.startsWith(`${profileId}_`) &&
                  (key.includes("completedTutorials") ||
                    key.includes("currentTutorial"))
              );

              return hasTutorialCode || hasProgressValues;
            }
          );

          // Load server profiles into TinyBase store
          if (profilesResult.data && profilesResult.data.length > 0) {
            profilesResult.data.forEach((profile: UserProfile) => {
              // Save to TinyBase store only
              store.setRow("profiles", profile.id, profile as any);
            });
          }

          // Handle local profiles with progress
          if (profilesWithProgress.length > 0) {
            for (const [profileId, profileData] of profilesWithProgress) {
              const profile = profileData as unknown as UserProfile;

              // Skip if this profile already exists on the server
              const existsOnServer = profilesResult.data?.some(
                (serverProfile: UserProfile) => serverProfile.id === profileId
              );

              if (!existsOnServer) {
                // Create a new profile ID to avoid conflicts
                const newProfileId = `local_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

                // Update the profile with the new ID and account ID
                const updatedProfile: UserProfile = {
                  ...profile,
                  id: newProfileId,
                  accountId: activeAccount.id,
                  name: profile.name + " (Local Progress)",
                  lastActive: new Date().toISOString()
                };

                // Save the updated profile to TinyBase store
                store.setRow("profiles", newProfileId, updatedProfile as any);

                // Migrate tutorial code to use the new profile ID
                Object.keys(existingTutorialCode).forEach((codeId) => {
                  if (codeId.startsWith(`${profileId}_`)) {
                    const tutorialCode = existingTutorialCode[
                      codeId
                    ] as unknown as TutorialCode;
                    const newCodeId = codeId.replace(
                      `${profileId}_`,
                      `${newProfileId}_`
                    );

                    const updatedTutorialCode: TutorialCode = {
                      ...tutorialCode,
                      id: newCodeId,
                      profileId: newProfileId
                    };

                    store.setRow(
                      "tutorialCode",
                      newCodeId,
                      updatedTutorialCode as any
                    );
                  }
                });

                // Migrate progress values to use the new profile ID
                Object.keys(existingValues).forEach((key) => {
                  if (key.startsWith(`${profileId}_`)) {
                    const newKey = key.replace(
                      `${profileId}_`,
                      `${newProfileId}_`
                    );
                    const value = existingValues[key];
                    store.setValue(newKey, value);
                  }
                });

                // Upload the new profile to the server
                try {
                  await fetch("/api/profiles", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updatedProfile)
                  });

                  // Profile is already in TinyBase store, no need to save separately

                  // Sync tutorial code and progress to server
                  await syncLocalProgressToServer(
                    activeAccount.id,
                    newProfileId
                  );
                } catch (error) {
                  console.warn(
                    "Failed to upload local profile to server:",
                    error
                  );
                }
              }
            }
          }

          // Clean up old local profiles
          Object.keys(existingProfiles).forEach((profileId) => {
            const existsOnServer = profilesResult.data?.some(
              (serverProfile: UserProfile) => serverProfile.id === profileId
            );

            if (!existsOnServer) {
              // Remove the original local profile (either it was migrated or had no progress)
              store.delRow("profiles", profileId);

              // Clean up original tutorial code and values
              Object.keys(existingTutorialCode).forEach((codeId) => {
                if (codeId.startsWith(`${profileId}_`)) {
                  store.delRow("tutorialCode", codeId);
                }
              });

              Object.keys(existingValues).forEach((key) => {
                if (key.startsWith(`${profileId}_`)) {
                  store.delValue(key);
                }
              });
            }
          });

          // Set the first profile as active if no active profile is set
          const currentActiveProfileId = store.getValue("activeProfileId");
          if (!currentActiveProfileId) {
            const allProfiles = store.getTable("profiles");
            const profileIds = Object.keys(allProfiles);
            if (profileIds.length > 0) {
              store.setValue("activeProfileId", profileIds[0]);
            }
          }
        }

        // Course progress is now computed from tutorial data, no need to load separately

        return undefined; // We handle storage ourselves
      } catch (error) {
        console.warn("Failed to load from Firebase:", error);
        return undefined;
      } finally {
        isLoadingFromFirebase = false;
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
      // Don't call ensureDefaultProfile here - let initializeFirebasePersister handle it
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
  tutorialCode: {} as Record<string, any>
};

async function processPendingChanges(
  activeAccount: Account,
  activeProfile: UserProfile
) {
  // Get current state
  const currentProfiles = store.getTable("profiles");
  const currentAccounts = store.getTable("accounts");
  const currentValues = store.getValues();

  // Sync profiles - check all profiles for changes, not just the active one
  for (const [profileId, profileData] of Object.entries(currentProfiles)) {
    const lastSyncedProfile = lastSyncedState.profiles[profileId];

    if (
      profileData &&
      JSON.stringify(profileData) !== JSON.stringify(lastSyncedProfile)
    ) {
      const profile = profileData as unknown as UserProfile;
      const profileWithAccount: UserProfile = {
        ...profile,
        accountId: activeAccount.id
      };

      try {
        await fetch("/api/profiles", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(profileWithAccount)
        });
        // Profile is already in TinyBase store, no need to save separately
        lastSyncedState.profiles[profileId] = { ...profile };
      } catch (error) {
        console.warn(`Failed to sync profile ${profileId}:`, error);
      }
    }
  }

  // Sync accounts - only sync the currently active account (since only it can change)
  const currentAccountData = currentAccounts[activeAccount.id];
  const lastAccountData = lastSyncedState.accounts[activeAccount.id];

  if (
    currentAccountData &&
    JSON.stringify(currentAccountData) !== JSON.stringify(lastAccountData)
  ) {
    const account = currentAccountData as unknown as Account;
    const accountForApi: AccountData = {
      id: account.id,
      email: account.email,
      lastUpdated: new Date().toISOString(),
      version: Date.now()
    };

    try {
      await fetch("/api/accounts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(accountForApi)
      });
      // Account data is already in TinyBase store, no need to save separately
      lastSyncedState.accounts[activeAccount.id] = { ...account };
    } catch (error) {
      console.warn(`Failed to sync active account ${activeAccount.id}:`, error);
    }
  }

  // Sync tutorial code - only for the active profile (since only it can have changes)
  const currentTutorialCode = store.getTable("tutorialCode");
  const activeProfileTutorialCode = Object.entries(currentTutorialCode).filter(
    ([_, tutorialData]) => {
      const tutorial = tutorialData as unknown as TutorialCode;
      return tutorial.profileId === activeProfile.id;
    }
  );

  // Check if any tutorial code changed for the active profile
  const changedTutorialCode = activeProfileTutorialCode.filter(
    ([tutorialId, tutorialData]) =>
      JSON.stringify(tutorialData) !==
      JSON.stringify(lastSyncedState.tutorialCode[tutorialId])
  );

  if (changedTutorialCode.length > 0) {
    try {
      // Group changed tutorial code by course and sync only affected courses
      const courseGroups = new Map<string, TutorialCode[]>();

      changedTutorialCode.forEach(([_, tutorialData]) => {
        const tutorial = tutorialData as unknown as TutorialCode;
        if (!courseGroups.has(tutorial.courseId)) {
          courseGroups.set(tutorial.courseId, []);
        }
        courseGroups.get(tutorial.courseId)!.push(tutorial);
      });

      // Tutorial code changes are already in TinyBase store, no additional sync needed

      // Update last synced state for changed tutorial code
      changedTutorialCode.forEach(([tutorialId, tutorialData]) => {
        lastSyncedState.tutorialCode[tutorialId] = JSON.parse(
          JSON.stringify(tutorialData)
        );
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
  const changedValues = relevantValues.filter(
    ([key, value]) =>
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

      // Course progress is computed from tutorial data, no need to sync separately

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

// Tutorial code and course progress are already in TinyBase store, no additional sync needed
async function syncLocalProgressToServer(
  _accountId: string,
  _profileId: string
): Promise<void> {
  // Course progress is computed from tutorial data, no sync needed
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

// Course progress is computed from tutorial data, no need to sync separately

// Initialize Firebase persister
async function initializeFirebasePersister(
  isNewAccount: boolean = false
): Promise<void> {
  if (typeof window === "undefined" || !firebasePersister) {
    return;
  }

  const activeAccount = getActiveAccount();
  if (!activeAccount) {
    return;
  }

  try {
    if (isNewAccount) {
      // For new accounts, ensure we have a default profile and start auto-save
      ensureDefaultProfile();
      firebasePersister.startAutoSave();
    } else {
      // For existing accounts, load profiles from server first
      await firebasePersister.load();
      if (persister) {
        await persister.save();
      }

      // Only create default profile if no profiles were loaded from server
      const profiles = store.getTable("profiles");
      if (Object.keys(profiles).length === 0) {
        ensureDefaultProfile();
      }

      // Course progress is computed from tutorial data, no sync needed
    }
  } catch (error) {
    console.warn("Failed to initialize Firebase persister:", error);
    // If Firebase loading fails, ensure we have a default profile
    ensureDefaultProfile();
  }
}

// Profile management functions
export function ensureDefaultProfile(): void {
  if (typeof window === "undefined") return;

  // Don't create default profile if we're currently loading from Firebase
  if (isLoadingFromFirebase) return;

  const profiles = getProfilesInternal();
  if (profiles.length === 0) {
    const defaultProfile: UserProfile = {
      id: DEFAULT_PROFILE_ID,
      accountId: "", // Will be set when account is created
      name: "No Name",
      icon: "short_brown",
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
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
  return Object.values(profilesTable).map(
    (row) => row as unknown as UserProfile
  );
}

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
    activeProfileId
  ) as unknown as UserProfile;

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

  // Force the Firebase persister to sync
  if (firebasePersister) {
    firebasePersister.save?.();
  }

  return true;
}

export function createProfile(
  name: string,
  icon: string = "short_brown"
): UserProfile {
  const activeAccount = getActiveAccount();
  const newProfile: UserProfile = {
    id: `profile_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
    accountId: activeAccount?.id || "",
    name: name.trim() || "Unnamed Profile",
    icon: icon,
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString()
  };

  store.setRow("profiles", newProfile.id, newProfile as any);

  // Clear sync cache on client-side write
  if (typeof window !== "undefined" && clearSyncCache) {
    clearSyncCache();
  }

  enableFirebaseAutoSave();

  // Force the Firebase persister to sync
  if (firebasePersister) {
    firebasePersister.save?.();
  }

  return newProfile;
}

export function updateProfile(updatedProfile: UserProfile): boolean {
  const existingProfile = store.getRow("profiles", updatedProfile.id);
  if (!existingProfile) {
    return false;
  }

  const profileWithTimestamp = {
    ...updatedProfile,
    lastActive: new Date().toISOString()
  };
  store.setRow("profiles", updatedProfile.id, profileWithTimestamp as any);

  // Clear sync cache on client-side write
  if (typeof window !== "undefined" && clearSyncCache) {
    clearSyncCache();
  }

  enableFirebaseAutoSave();

  // Force the Firebase persister to sync
  if (firebasePersister) {
    firebasePersister.save?.();
  }

  return true;
}

export async function deleteProfile(profileId: string): Promise<boolean> {
  const profiles = getAllProfiles();
  if (profiles.length <= 1) {
    return false;
  }

  const activeAccount = getActiveAccount();
  if (!activeAccount) {
    return false;
  }

  try {
    // Delete from server first - this will also delete all course progress in a batch
    await fetch(`/api/profiles?profileId=${profileId}`, {
      method: "DELETE"
    });

    // Now delete from local storage
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

    // Profile is already removed from TinyBase store above, no need to remove from local storage

    return true;
  } catch (error) {
    console.error("Failed to delete profile from server:", error);
    // Even if server deletion fails, we might want to still delete locally
    // But in this case, let's return false to indicate failure
    return false;
  }
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

export function getProfileItemAsObject(
  key: string,
  defaultValue: any = {}
): any {
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
export function getCompletedTutorials(courseId: string): number[] {
  return getProfileItemAsArray(`completedTutorials_course_${courseId}`);
}

export function setCompletedTutorials(
  courseId: string,
  tutorialIds: number[]
): void {
  setProfileItemAsArray(`completedTutorials_course_${courseId}`, tutorialIds);
}

export function getCurrentTutorial(courseId: string): number | null {
  const item = getProfileItem(`currentTutorial_course_${courseId}`);
  return item ? parseInt(item) : null;
}

export function setCurrentTutorial(
  courseId: string,
  tutorialOrder: number
): void {
  setProfileItem(
    `currentTutorial_course_${courseId}`,
    tutorialOrder.toString()
  );
}

// Updated tutorial code functions using TinyBase table
export function getUserCode(tutorialId: number): string | null {
  const activeProfile = getActiveProfile();
  const tutorialCodeId = `${activeProfile.id}_${tutorialId}`;
  const tutorialCode = store.getRow(
    "tutorialCode",
    tutorialCodeId
  ) as unknown as TutorialCode;
  return tutorialCode?.code || null;
}

export function setUserCode(
  tutorialId: number,
  code: string,
  courseId: string
): void {
  const activeProfile = getActiveProfile();
  const tutorialCodeId = `${activeProfile.id}_${tutorialId}`;

  const existingTutorialCode = getTutorialCode(tutorialId);

  const newTutorialRecord: TutorialCode =
    existingTutorialCode && isValidRecord(existingTutorialCode)
      ? {
          ...existingTutorialCode,
          code,
          lastAccessed: new Date().toISOString()
        }
      : {
          id: tutorialCodeId,
          profileId: activeProfile.id,
          tutorialId,
          courseId,
          code,
          completed: false,
          lastAccessed: new Date().toISOString()
        };

  store.setRow("tutorialCode", tutorialCodeId, newTutorialRecord as any);

  // Clear sync cache on client-side write
  if (typeof window !== "undefined" && clearSyncCache) {
    clearSyncCache();
  }

  // Force the Firebase persister to sync
  if (firebasePersister) {
    firebasePersister.save?.();
  }
}

export function getTutorialCode(tutorialId: number): TutorialCode | null {
  const activeProfile = getActiveProfile();
  const tutorialCodeId = `${activeProfile.id}_${tutorialId}`;
  const tutorialCode = store.getRow(
    "tutorialCode",
    tutorialCodeId
  ) as unknown as TutorialCode;
  return tutorialCode || null;
}

export function setTutorialCompleted(
  tutorialId: number,
  completed: boolean,
  courseId: string
): void {
  const activeProfile = getActiveProfile();
  const tutorialCodeId = `${activeProfile.id}_${tutorialId}`;

  let tutorialCode = store.getRow(
    "tutorialCode",
    tutorialCodeId
  ) as unknown as TutorialCode;

  if (!isValidRecord(tutorialCode)) {
    tutorialCode = {
      id: tutorialCodeId,
      profileId: activeProfile.id,
      tutorialId,
      courseId,
      code: "",
      completed,
      lastAccessed: new Date().toISOString()
    };
  } else {
    tutorialCode = {
      ...tutorialCode,
      completed,
      lastAccessed: new Date().toISOString()
    };
  }

  store.setRow("tutorialCode", tutorialCodeId, tutorialCode as any);

  // Clear sync cache on client-side write
  if (typeof window !== "undefined" && clearSyncCache) {
    clearSyncCache();
  }

  // Force the Firebase persister to sync
  if (firebasePersister) {
    firebasePersister.save?.();
  }
}

export function getTutorialCodesForProfile(profileId: string): TutorialCode[] {
  const tutorialCodeTable = store.getTable("tutorialCode");
  return Object.values(tutorialCodeTable)
    .map((row) => row as unknown as TutorialCode)
    .filter((tutorialCode) => tutorialCode.profileId === profileId);
}

export function getTutorialCodesForCourse(courseId: string): TutorialCode[] {
  const activeProfile = getActiveProfile();
  const tutorialCodeTable = store.getTable("tutorialCode");
  return Object.values(tutorialCodeTable)
    .map((row) => row as unknown as TutorialCode)
    .filter(
      (tutorialCode) =>
        tutorialCode.profileId === activeProfile.id &&
        tutorialCode.courseId === courseId
    );
}

// Compute course progress from TinyBase tutorial data
export function getComputedCourseProgress(
  accountId: string,
  profileId: string,
  courseId: string
): CourseProgress {
  const tutorialCodeTable = store.getTable("tutorialCode");
  const profileTutorialCodes = Object.values(tutorialCodeTable)
    .map((row) => row as unknown as TutorialCode)
    .filter(
      (tutorialCode) =>
        tutorialCode.profileId === profileId &&
        tutorialCode.courseId === courseId
    );

  // Build tutorialCode object from TinyBase data
  const tutorialCode: Record<string, any> = {};
  profileTutorialCodes.forEach((tutorial) => {
    tutorialCode[tutorial.tutorialId.toString()] = {
      code: tutorial.code,
      completed: tutorial.completed,
      lastAccessed: tutorial.lastAccessed
    };
  });

  return {
    accountId,
    profileId,
    courseId,
    tutorialCode,
    lastUpdated: new Date().toISOString()
  };
}

export function getComputedCourseProgressList(
  accountId: string,
  profileId: string
): CourseProgress[] {
  const tutorialCodeTable = store.getTable("tutorialCode");
  const profileTutorialCodes = Object.values(tutorialCodeTable)
    .map((row) => row as unknown as TutorialCode)
    .filter((tutorialCode) => tutorialCode.profileId === profileId);

  // Group by course
  const courseGroups = new Map<string, TutorialCode[]>();
  profileTutorialCodes.forEach((tutorial) => {
    const courseId = tutorial.courseId.toString();
    if (!courseGroups.has(courseId)) {
      courseGroups.set(courseId, []);
    }
    courseGroups.get(courseId)!.push(tutorial);
  });

  // Build course progress for each course
  const courseProgressList: CourseProgress[] = [];
  courseGroups.forEach((tutorials, courseId) => {
    const tutorialCode: Record<string, any> = {};
    tutorials.forEach((tutorial) => {
      tutorialCode[tutorial.tutorialId.toString()] = {
        code: tutorial.code,
        completed: tutorial.completed,
        lastAccessed: tutorial.lastAccessed
      };
    });

    courseProgressList.push({
      accountId,
      profileId,
      courseId,
      tutorialCode,
      lastUpdated: new Date().toISOString()
    });
  });

  return courseProgressList;
}

export function getCompletedCourses(): string[] {
  return getProfileItemAsArray("completedCourses");
}

export function setCompletedCourses(courseIds: string[]): void {
  setProfileItemAsArray("completedCourses", courseIds);

  // Clear sync cache on client-side write
  if (typeof window !== "undefined" && clearSyncCache) {
    clearSyncCache();
  }
}

// Account management functions
export function createAccount(
  email: string,
  provider: "google" = "google"
): Account {
  const newAccount: Account = {
    id: `account_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
    email: email,
    provider: provider,
    createdAt: new Date().toISOString(),
    lastSignIn: new Date().toISOString()
  };

  store.setRow("accounts", newAccount.id, newAccount as any);
  store.setValue("activeAccountId", newAccount.id);
  return newAccount;
}

export function getActiveAccount(): Account | null {
  const activeAccountId = store.getValue("activeAccountId") as string;
  if (!activeAccountId) {
    return null;
  }

  const account = store.getRow(
    "accounts",
    activeAccountId
  ) as unknown as Account;
  return isValidRecord(account) ? account || null : null;
}

export function getAllAccounts(): Account[] {
  const accountsTable = store.getTable("accounts");
  return Object.values(accountsTable).map((row) => row as unknown as Account);
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
  if (!isValidRecord(account)) {
    return false;
  }

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
  if (!isValidRecord(account)) {
    return false;
  }

  store.setValue("activeAccountId", accountId);
  updateAccountLastSignIn(accountId);
  return true;
}

// Set up TinyBase listeners for automatic course progress sync
async function setupCourseProgressListeners(): Promise<void> {
  if (typeof window === "undefined") return;

  // Ensure the modules are loaded before setting up listeners
  if (!debouncedSyncCourseProgress) {
    try {
      const module = await import("@/lib/course-progress-sync");
      debouncedSyncCourseProgress = module.debouncedSyncCourseProgress;
    } catch (error) {
      console.error("Failed to load course-progress-sync module:", error);
      return;
    }
  }

  if (!clearSyncCache) {
    try {
      const module = await import("@/lib/sync-changes");
      clearSyncCache = module.clearSyncCache;
    } catch (error) {
      console.error("Failed to load sync-changes module:", error);
      return;
    }
  }

  // Listen for changes to tutorial code table - using cell listener for better control
  store.addCellListener(
    "tutorialCode",
    null,
    "code",
    (store, tableId, rowId, cellId, newCell, oldCell, getCellChange) => {
      // Only sync on client side and if we have the sync function
      if (typeof window === "undefined" || !debouncedSyncCourseProgress) return;

      const activeAccount = getActiveAccount();
      if (!activeAccount) return;

      const tutorialCode = store.getRow(
        "tutorialCode",
        rowId
      ) as unknown as TutorialCode;
      if (!tutorialCode) return;

      // Debounced sync to server
      debouncedSyncCourseProgress(
        activeAccount.id,
        tutorialCode.profileId,
        tutorialCode.courseId,
        2000 // 2 second delay
      );
    }
  );

  // Listen for tutorial completion changes
  store.addCellListener(
    "tutorialCode",
    null,
    "completed",
    (store, tableId, rowId, cellId, newCell, oldCell, getCellChange) => {
      // Only sync on client side and if we have the sync function
      if (typeof window === "undefined") {
        return;
      }

      if (!debouncedSyncCourseProgress) {
        return;
      }

      const activeAccount = getActiveAccount();
      if (!activeAccount) {
        return;
      }

      const tutorialCode = store.getRow(
        "tutorialCode",
        rowId
      ) as unknown as TutorialCode;
      if (!tutorialCode) {
        return;
      }

      // Debounced sync to server
      debouncedSyncCourseProgress(
        activeAccount.id,
        tutorialCode.profileId,
        tutorialCode.courseId,
        2000 // 2 second delay
      );
    }
  );

  // Add diagnostic function to verify listeners are working
  if (typeof window !== "undefined") {
    (window as any).debugTinyBaseListeners = () => {};

    (window as any).testTutorialCompletion = (
      tutorialId: number = 1,
      courseId: string = "1"
    ) => {
      setTutorialCompleted(tutorialId, true, courseId);
    };
  }
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

export async function initializeFirebaseSync(
  isNewAccount: boolean = false
): Promise<void> {
  await initializeFirebasePersister(isNewAccount);
}

export function enableFirebaseAutoSave(): void {
  if (firebasePersister && getActiveAccount()) {
    firebasePersister.startAutoSave();
  }
}

export async function initializeProfileSystem(): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    if (persister) {
      await persister.startAutoLoad();
      persister.startAutoSave();
    }

    ensureDefaultProfile();

    // Set up TinyBase listeners for course progress sync
    await setupCourseProgressListeners();

    // Migrate existing tutorial code to the new table structure
    // migrateTutorialCodeToTable();

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
  if (!activeAccount || !isValidRecord(activeAccount)) {
    return null;
  }

  // Get account data from TinyBase store
  const accountData = store.getRow(
    "accounts",
    activeAccount.id
  ) as unknown as AccountData;
  return accountData?.lastUpdated || null;
}

export function setLastSyncTimestamp(timestamp: string): void {
  const activeAccount = getActiveAccount();
  if (!activeAccount || !isValidRecord(activeAccount)) {
    return;
  }

  // Update account data in TinyBase store
  const accountData = store.getRow(
    "accounts",
    activeAccount.id
  ) as unknown as AccountData;
  if (accountData) {
    const updatedAccountData = { ...accountData, lastUpdated: timestamp };
    store.setRow("accounts", activeAccount.id, updatedAccountData as any);
  }
}

export async function isRemoteDataNewer(): Promise<boolean> {
  const activeAccount = getActiveAccount();
  if (!activeAccount || !isValidRecord(activeAccount)) {
    return false;
  }

  try {
    const response = await fetch(`/api/accounts?accountId=${activeAccount.id}`);
    if (!response.ok) {
      return false;
    }

    const result = await response.json();
    const remoteTime = new Date(result.data.lastUpdated).getTime();
    const localTime = new Date(
      getLastSyncTimestamp() || "1970-01-01"
    ).getTime();

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

// Course progress is computed from tutorial data, no remote sync needed

export function isValidRecord(obj: any): boolean {
  return !!obj && Object.keys(obj).length > 0;
}
export { store };
