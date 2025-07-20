"use client";

import { useEffect, useState } from "react";
import { getAllProfiles, initializeProfileSystem } from "@/lib/profile-storage";

interface ProfileEnsurerProps {
  children: React.ReactNode;
}

/**
 * ProfileEnsurer is a wrapper component that ensures the default profile exists
 * when any page loads. It initializes the profile system if no profiles are found.
 *
 * This component should wrap any page that needs to access profile data.
 */
export default function ProfileEnsurer({ children }: ProfileEnsurerProps) {
  const [isProfileSystemReady, setIsProfileSystemReady] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Track client-side mounting to prevent hydration mismatches
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Only run on client side after component has mounted
    if (!isClient) {
      return;
    }

    const initializeProfiles = async () => {
      try {
        // Use the explicit initialization function to ensure persistence
        await initializeProfileSystem();

        // Verify profiles exist after initialization
        const profiles = getAllProfiles();
        if (profiles.length === 0) {
          console.warn(
            "Profile system initialization failed - no profiles found"
          );
        }

        setIsProfileSystemReady(true);
      } catch (error) {
        console.error("Error initializing profile system:", error);
        // Still set as ready to prevent infinite loading
        setIsProfileSystemReady(true);
      }
    };

    // Small delay to ensure TinyBase persistence is ready
    const timeoutId = setTimeout(initializeProfiles, 100);

    return () => clearTimeout(timeoutId);
  }, [isClient]);

  // Always render children on server side and during hydration to prevent mismatch
  if (!isClient) {
    return <>{children}</>;
  }

  // On client side, show loading only after we're sure we're mounted
  if (!isProfileSystemReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"
            role="status"
            aria-label="Loading profiles"
          ></div>
          <p className="text-gray-600 font-medium">Initializing profiles...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
