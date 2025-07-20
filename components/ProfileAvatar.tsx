"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { User } from "lucide-react";
import { useActiveProfile } from "@/hooks/useActiveProfile";
import { getProfileIcon } from "@/components/profile-icons/ProfileIcons";

interface ProfileAvatarProps {
  className?: string;
  size?: number;
}

export default function ProfileAvatar({
  className = "",
  size = 32
}: ProfileAvatarProps) {
  const [isClient, setIsClient] = useState(false);

  // Get active profile reactively
  const activeProfile = useActiveProfile();
  const profileIcon = activeProfile?.icon || "short_brown";
  const profileName = activeProfile?.name || "";

  // Track client-side mounting to prevent hydration mismatches
  useEffect(() => {
    setIsClient(true);
  }, []);

  const renderIcon = () => {
    if (!isClient || !profileIcon) {
      // Server-side or loading: render placeholder with opacity 0
      return (
        <div
          className="rounded-full bg-gray-200 flex items-center justify-center opacity-0"
          style={{ width: size, height: size }}
        >
          <User className="text-gray-400" size={size * 0.6} />
        </div>
      );
    }

    // Client-side: render actual profile icon
    const iconData = getProfileIcon(profileIcon);
    if (iconData) {
      const IconComponent = iconData.component;
      return (
        <div
          className="rounded-full overflow-hidden bg-white shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
          style={{ width: size, height: size }}
        >
          <IconComponent size={size} />
        </div>
      );
    }

    // Fallback if icon not found
    return (
      <div
        className="rounded-full bg-gray-200 flex items-center justify-center border border-gray-300"
        style={{ width: size, height: size }}
      >
        <User className="text-gray-600" size={size * 0.6} />
      </div>
    );
  };

  return (
    <Link
      href="/profiles"
      className={`block hover:scale-110 transition-transform duration-200 ${className}`}
      title={
        isClient && profileName
          ? `${profileName}: Manage Profiles`
          : "Manage Profiles"
      }
    >
      {renderIcon()}
    </Link>
  );
}
