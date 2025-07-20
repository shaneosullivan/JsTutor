// Utility functions for syncing changes from other clients
import { getActiveAccount, getStore } from "@/lib/profile-storage";
import { getClientId } from "@/lib/client-id";
import { AccountData, UserProfile, CourseProgress } from "@/lib/types";

// Client-side cache for identical requests
interface CacheEntry {
  promise: Promise<SyncChangesResult>;
  timestamp: number;
  key: string;
}

const CACHE_DURATION = 10000; // 10 seconds
let requestCache: Map<string, CacheEntry> | null = null;

// Initialize cache only on client side
function getCache(): Map<string, CacheEntry> {
  if (typeof window === "undefined") {
    // Server side - no caching
    return new Map();
  }

  if (!requestCache) {
    requestCache = new Map();
  }

  return requestCache;
}

// Generate cache key from options
function generateCacheKey(
  options: SyncChangesOptions,
  accountId: string
): string {
  const types = options.types ? options.types.sort().join(",") : "all";
  const courseId = options.courseId || "all";
  return `${accountId}:${types}:${courseId}`;
}

// Clear all cached promises (called on writes) - client side only
export function clearSyncCache(): void {
  if (typeof window === "undefined") {
    return;
  }

  const cache = getCache();
  cache.clear();
}

// Clean expired entries from cache - client side only
function cleanExpiredCache(): void {
  if (typeof window === "undefined") {
    return;
  }

  const cache = getCache();
  const now = Date.now();
  for (const [key, entry] of cache.entries()) {
    if (now - entry.timestamp > CACHE_DURATION) {
      cache.delete(key);
    }
  }
}

export interface SyncChangesOptions {
  types?: ("account" | "profile" | "course")[];
  courseId?: string;
}

export interface SyncChangesResult {
  success: boolean;
  data?: {
    account: AccountData[];
    profile: UserProfile[];
    course: CourseProgress[];
  };
  error?: string;
  synced: {
    accounts: number;
    profiles: number;
    courses: number;
  };
}

// Call the changes API to get updates from other clients (with client-side caching)
async function fetchChangesFromOtherClients(
  options: SyncChangesOptions = {}
): Promise<SyncChangesResult> {
  const activeAccount = getActiveAccount();
  if (!activeAccount) {
    return {
      success: false,
      error: "No active account found",
      synced: { accounts: 0, profiles: 0, courses: 0 }
    };
  }

  const clientId = getClientId();
  if (!clientId) {
    return {
      success: false,
      error: "No client ID found",
      synced: { accounts: 0, profiles: 0, courses: 0 }
    };
  }

  // Only use caching on client side
  if (typeof window !== "undefined") {
    // Generate cache key and check for existing request
    const cacheKey = generateCacheKey(options, activeAccount.id);
    const cache = getCache();
    cleanExpiredCache(); // Clean up expired entries

    const existingEntry = cache.get(cacheKey);
    if (
      existingEntry &&
      Date.now() - existingEntry.timestamp < CACHE_DURATION
    ) {
      return existingEntry.promise;
    }

    // Create new request
    const requestPromise = performFetchRequest(activeAccount.id, options);

    // Cache the promise
    cache.set(cacheKey, {
      promise: requestPromise,
      timestamp: Date.now(),
      key: cacheKey
    });

    return requestPromise;
  } else {
    // Server side - no caching
    return performFetchRequest(activeAccount.id, options);
  }
}

// Actual fetch implementation (separated for caching)
async function performFetchRequest(
  accountId: string,
  options: SyncChangesOptions
): Promise<SyncChangesResult> {
  try {
    // Build query parameters
    const params = new URLSearchParams({
      accountId: accountId
    });

    if (options.types && options.types.length > 0) {
      params.append("types", options.types.join(","));
    }

    if (options.courseId !== undefined) {
      params.append("courseId", options.courseId);
    }

    const response = await fetch(`/api/changes?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.error || "Failed to fetch changes",
        synced: { accounts: 0, profiles: 0, courses: 0 }
      };
    }

    const result = await response.json();

    if (!result.success) {
      return {
        success: false,
        error: result.error || "API returned failure",
        synced: { accounts: 0, profiles: 0, courses: 0 }
      };
    }

    return {
      success: true,
      data: result.data,
      synced: {
        accounts: result.data.account?.length || 0,
        profiles: result.data.profile?.length || 0,
        courses: result.data.course?.length || 0
      }
    };
  } catch (error) {
    console.error("Error fetching changes from other clients:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      synced: { accounts: 0, profiles: 0, courses: 0 }
    };
  }
}

// Sync the fetched changes to the local TinyBase store
export async function syncChangesToLocalStore(changes: {
  account: AccountData[];
  profile: UserProfile[];
  course: CourseProgress[];
}): Promise<{ synced: number; errors: string[] }> {
  const store = getStore();
  const errors: string[] = [];
  let synced = 0;

  try {
    // Sync account changes
    for (const account of changes.account) {
      try {
        store.setRow("accounts", account.id, account as any);
        synced++;
      } catch (error) {
        errors.push(`Failed to sync account ${account.id}: ${error}`);
      }
    }

    // Sync profile changes
    for (const profile of changes.profile) {
      try {
        store.setRow("profiles", profile.id, profile as any);
        synced++;
      } catch (error) {
        errors.push(`Failed to sync profile ${profile.id}: ${error}`);
      }
    }

    // Sync course progress changes
    for (const courseProgress of changes.course) {
      try {
        // Course progress is now computed from tutorial data, so we need to update tutorial data
        if (courseProgress.tutorialCode) {
          Object.entries(courseProgress.tutorialCode).forEach(
            ([tutorialIdStr, tutorialData]) => {
              const tutorialId = parseInt(tutorialIdStr);
              if (!isNaN(tutorialId) && tutorialData) {
                const tutorialCodeId = `${courseProgress.profileId}_${tutorialId}`;
                const tutorialCodeData = {
                  id: tutorialCodeId,
                  profileId: courseProgress.profileId,
                  tutorialId: tutorialId,
                  courseId: courseProgress.courseId,
                  code: tutorialData.code || "",
                  completed: tutorialData.completed || false,
                  lastAccessed:
                    tutorialData.lastAccessed || new Date().toISOString()
                };

                store.setRow(
                  "tutorialCode",
                  tutorialCodeId,
                  tutorialCodeData as any
                );
              }
            }
          );
        }
        synced++;
      } catch (error) {
        errors.push(
          `Failed to sync course progress ${courseProgress.courseId}: ${error}`
        );
      }
    }

    return { synced, errors };
  } catch (error) {
    errors.push(`General sync error: ${error}`);
    return { synced, errors };
  }
}

// Main function to fetch and sync changes
export async function fetchAndSyncChanges(
  options: SyncChangesOptions = {}
): Promise<SyncChangesResult> {
  const fetchResult = await fetchChangesFromOtherClients(options);

  if (!fetchResult.success || !fetchResult.data) {
    return fetchResult;
  }

  const syncResult = await syncChangesToLocalStore(fetchResult.data);

  if (syncResult.errors.length > 0) {
    console.warn("Sync errors:", syncResult.errors);
  }

  return {
    success: true,
    data: fetchResult.data,
    synced: {
      accounts: fetchResult.data.account?.length || 0,
      profiles: fetchResult.data.profile?.length || 0,
      courses: fetchResult.data.course?.length || 0
    }
  };
}

// Convenience function to sync only course-related changes
export async function syncCourseChanges(
  courseId?: string
): Promise<SyncChangesResult> {
  return fetchAndSyncChanges({
    types: ["course"],
    courseId
  });
}

// Convenience function to sync only profile changes
export async function syncProfileChanges(): Promise<SyncChangesResult> {
  return fetchAndSyncChanges({
    types: ["profile"]
  });
}

// Convenience function to sync all changes
export async function syncAllChanges(): Promise<SyncChangesResult> {
  return fetchAndSyncChanges();
}
