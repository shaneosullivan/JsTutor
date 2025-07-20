import { useMemo } from "react";
import { useValue, useRow } from "tinybase/ui-react";
import {
  getAllProfiles,
  setActiveProfile,
  ensureDefaultProfile
} from "@/lib/profile-storage";
import type { UserProfile } from "@/lib/types";

const DEFAULT_PROFILE_ID = "default";

/**
 * React hook that returns the currently active profile with automatic reactivity.
 * Uses TinyBase hooks to automatically re-render when the active profile changes.
 */
export function useActiveProfile(): UserProfile {
  // Get the active profile ID reactively
  const activeProfileId =
    (useValue("activeProfileId") as string) || DEFAULT_PROFILE_ID;

  // Get the profile data reactively
  const profileRow = useRow("profiles", activeProfileId);

  // Convert the profile row to UserProfile type and handle fallbacks
  const activeProfile = useMemo((): UserProfile => {
    if (typeof window === "undefined") {
      // Server-side fallback
      return {
        id: DEFAULT_PROFILE_ID,
        accountId: "default",
        name: "Default",
        icon: "short_brown",
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString()
      };
    }

    // Ensure default profile exists
    ensureDefaultProfile();

    // If we have a valid profile row, return it
    if (profileRow && Object.keys(profileRow).length > 0) {
      return profileRow as unknown as UserProfile;
    }

    // Fallback: find first available profile and set it as active
    const profiles = getAllProfiles();
    const firstProfile = profiles[0];
    if (firstProfile) {
      setActiveProfile(firstProfile.id);
      return firstProfile;
    }

    // Final fallback: ensure default and return it
    ensureDefaultProfile();
    return getAllProfiles()[0];
  }, [profileRow, activeProfileId]);

  return activeProfile;
}
