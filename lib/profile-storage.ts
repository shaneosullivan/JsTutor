// Profile management and local storage utilities using TinyBase
// This module handles all localStorage access with user profile support

import { createStore } from "tinybase";
import { createLocalPersister } from "tinybase/persisters/persister-browser";
import type { Store } from "tinybase";

export interface UserProfile {
  id: string;
  name: string;
  icon: string;
  createdAt: string;
  lastActive: string;
}

// Constants
const DEFAULT_PROFILE_ID = "default";

// Create TinyBase store with localStorage persistence
const store: Store = createStore();
let persister: any = null;

// Initialize persistence only on client side
if (typeof window !== "undefined") {
  persister = createLocalPersister(store, "jstutor");

  // Start persistence
  persister
    .startAutoLoad()
    .then(() => {
      persister.startAutoSave();
      ensureDefaultProfile();
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

// Table schemas in TinyBase:
// - 'profiles': stores user profiles
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
