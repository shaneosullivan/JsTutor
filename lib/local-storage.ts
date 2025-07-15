import { AccountData, UserProfile, CourseProgress } from "@/lib/types";

// Local storage keys
const ACCOUNTS_KEY = "jstutor_accounts";
const PROFILES_KEY = "jstutor_profiles";
const COURSE_PROGRESS_KEY = "jstutor_course_progress";

// Account local storage operations
export function getAccountFromStorage(accountId: string): AccountData | null {
  const accounts = getAccountsFromStorage();
  return accounts.find((account) => account.id === accountId) || null;
}

export function getAccountsFromStorage(): AccountData[] {
  const stored = localStorage.getItem(ACCOUNTS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveAccountToStorage(account: AccountData): void {
  const accounts = getAccountsFromStorage();
  const existingIndex = accounts.findIndex((a) => a.id === account.id);

  if (existingIndex >= 0) {
    accounts[existingIndex] = account;
  } else {
    accounts.push(account);
  }

  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export function removeAccountFromStorage(accountId: string): void {
  const accounts = getAccountsFromStorage();
  const filtered = accounts.filter((a) => a.id !== accountId);
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(filtered));
}

// Profile local storage operations
export function getProfileFromStorage(profileId: string): UserProfile | null {
  const profiles = getProfilesFromStorage();
  return profiles.find((profile) => profile.id === profileId) || null;
}

export function getProfilesFromStorage(): UserProfile[] {
  const stored = localStorage.getItem(PROFILES_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function getProfilesByAccountFromStorage(
  accountId: string,
): UserProfile[] {
  const profiles = getProfilesFromStorage();
  return profiles.filter((profile) => profile.accountId === accountId);
}

export function saveProfileToStorage(profile: UserProfile): void {
  const profiles = getProfilesFromStorage();
  const existingIndex = profiles.findIndex((p) => p.id === profile.id);

  if (existingIndex >= 0) {
    profiles[existingIndex] = profile;
  } else {
    profiles.push(profile);
  }

  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
}

export function removeProfileFromStorage(profileId: string): void {
  const profiles = getProfilesFromStorage();
  const filtered = profiles.filter((p) => p.id !== profileId);
  localStorage.setItem(PROFILES_KEY, JSON.stringify(filtered));

  // Also remove all course progress for this profile
  const courseProgress = getCourseProgressFromStorage();
  const filteredProgress = courseProgress.filter(
    (cp) => cp.profileId !== profileId,
  );
  localStorage.setItem(COURSE_PROGRESS_KEY, JSON.stringify(filteredProgress));
}

// Course progress local storage operations
export function getCourseProgressFromStorage(): CourseProgress[] {
  const stored = localStorage.getItem(COURSE_PROGRESS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function getCourseProgressByAccountAndProfileFromStorage(
  accountId: string,
  profileId: string,
): CourseProgress[] {
  const courseProgress = getCourseProgressFromStorage();
  return courseProgress.filter(
    (cp) => cp.accountId === accountId && cp.profileId === profileId,
  );
}

export function getCourseProgressByIdFromStorage(
  accountId: string,
  profileId: string,
  courseId: string,
): CourseProgress | null {
  const courseProgress = getCourseProgressFromStorage();
  return (
    courseProgress.find(
      (cp) =>
        cp.accountId === accountId &&
        cp.profileId === profileId &&
        cp.courseId === courseId,
    ) || null
  );
}

export function saveCourseProgressToStorage(progress: CourseProgress): void {
  const courseProgress = getCourseProgressFromStorage();
  const existingIndex = courseProgress.findIndex(
    (cp) =>
      cp.accountId === progress.accountId &&
      cp.profileId === progress.profileId &&
      cp.courseId === progress.courseId,
  );

  if (existingIndex >= 0) {
    courseProgress[existingIndex] = progress;
  } else {
    courseProgress.push(progress);
  }

  localStorage.setItem(COURSE_PROGRESS_KEY, JSON.stringify(courseProgress));
}

export function removeCourseProgressFromStorage(
  accountId: string,
  profileId: string,
  courseId: string,
): void {
  const courseProgress = getCourseProgressFromStorage();
  const filtered = courseProgress.filter(
    (cp) =>
      !(
        cp.accountId === accountId &&
        cp.profileId === profileId &&
        cp.courseId === courseId
      ),
  );
  localStorage.setItem(COURSE_PROGRESS_KEY, JSON.stringify(filtered));
}

// Utility functions for syncing
export function getAllStoredData() {
  return {
    accounts: getAccountsFromStorage(),
    profiles: getProfilesFromStorage(),
    courseProgress: getCourseProgressFromStorage(),
  };
}

export function clearAllStoredData(): void {
  localStorage.removeItem(ACCOUNTS_KEY);
  localStorage.removeItem(PROFILES_KEY);
  localStorage.removeItem(COURSE_PROGRESS_KEY);
}
