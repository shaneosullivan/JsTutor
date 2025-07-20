// Utility for syncing course progress to server
import { getTutorialCodesForCourse } from "@/lib/profile-storage";
import { CourseProgress } from "@/lib/types";
import { syncCourseChanges } from "@/lib/sync-changes";
import { getClientId } from "@/lib/client-id";

// Track which courses have been checked for remote changes in this session
const remoteCheckedCourses = new Set<string>();

// Reset the remote check cache when the window gets focus
if (typeof window !== "undefined") {
  window.addEventListener("focus", () => {
    remoteCheckedCourses.clear();
  });
}

// Clear the remote check cache (useful for testing or manual refresh)
export function clearRemoteCheckCache(): void {
  remoteCheckedCourses.clear();
}

// Sync course progress to server
export async function syncCourseProgressToServer(
  accountId: string,
  profileId: string,
  courseId: string
): Promise<boolean> {
  try {
    if (typeof window === "undefined") {
      return false;
    }

    // Check for remote changes first (only once per session/course)
    const courseKey = `${accountId}_${profileId}_${courseId}`;
    if (!remoteCheckedCourses.has(courseKey)) {
      try {
        const syncResult = await syncCourseChanges(courseId);
        if (syncResult.success && syncResult.synced.courses > 0) {
          console.log(
            `Synced ${syncResult.synced.courses} remote course changes before local sync`
          );
        }
      } catch (error) {
        console.warn(
          "Failed to check for remote changes, proceeding with local sync:",
          error
        );
      }

      // Mark this course as checked for this session
      remoteCheckedCourses.add(courseKey);
    }

    // Get all tutorial codes for the course and profile
    const tutorialCodes = getTutorialCodesForCourse(courseId);
    const profileTutorialCodes = tutorialCodes.filter(
      (tc) => tc.profileId === profileId
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

    const courseProgress: CourseProgress = {
      accountId,
      profileId,
      courseId: courseId,
      tutorialCode,
      lastUpdated: new Date().toISOString()
    };

    // Get client ID for the request
    const clientId = getClientId();

    // Always use POST for both creating and updating
    const response = await fetch("/api/course-progress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(courseProgress)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to sync course progress:", errorData);
      console.error("Request body was:", courseProgress);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error syncing course progress to server:", error);
    return false;
  }
}

// Debounced sync to avoid too many API calls
const syncTimeouts = new Map<string, NodeJS.Timeout>();

export function debouncedSyncCourseProgress(
  accountId: string,
  profileId: string,
  courseId: string,
  delay: number = 2000
): void {
  const key = `${accountId}_${profileId}_${courseId}`;

  // Clear existing timeout
  const existingTimeout = syncTimeouts.get(key);
  if (existingTimeout) {
    clearTimeout(existingTimeout);
  }

  // Set new timeout
  const timeout = setTimeout(async () => {
    const result = await syncCourseProgressToServer(
      accountId,
      profileId,
      courseId
    );
    syncTimeouts.delete(key);
  }, delay);

  syncTimeouts.set(key, timeout);
}
