import { NextRequest, NextResponse } from "next/server";
import {
  getProfilesByAccountId,
  getProfileById,
  createProfile,
  updateProfile,
  deleteProfile,
  storeChange
} from "@/lib/firebase-admin";
import { UserProfile } from "@/lib/types";
import { extractClientId } from "@/lib/api-utils";

// GET: Retrieve profiles by account ID or specific profile by ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get("accountId");
    const profileId = searchParams.get("profileId");

    if (profileId) {
      // Get specific profile
      const profile = await getProfileById(profileId);
      if (!profile) {
        return NextResponse.json(
          { error: "Profile not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        data: profile
      });
    } else if (accountId) {
      // Get all profiles for account
      const profiles = await getProfilesByAccountId(accountId);
      return NextResponse.json({
        success: true,
        data: profiles
      });
    } else {
      return NextResponse.json(
        { error: "Either accountId or profileId is required" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error retrieving profiles:", error);
    return NextResponse.json(
      { error: "Failed to retrieve profiles" },
      { status: 500 }
    );
  }
}

// POST: Create profile
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const profile: UserProfile = body;

    if (!profile.id || !profile.accountId || !profile.name) {
      return NextResponse.json(
        { error: "Profile ID, account ID, and name are required" },
        { status: 400 }
      );
    }

    // Extract clientId and fail if not found
    const clientId = extractClientId(request);
    if (!clientId) {
      return NextResponse.json(
        { error: "Client ID is required" },
        { status: 400 }
      );
    }

    const savedProfile = await createProfile(profile);

    // Log the change to Firebase
    try {
      await storeChange(profile.accountId, "profile", clientId, { 
        profileId: parseInt(profile.id.replace(/\D/g, '')) || 0 
      });
    } catch (error) {
      console.warn("Failed to log profile creation change:", error);
    }

    return NextResponse.json({
      success: true,
      data: savedProfile,
      message: "Profile created successfully"
    });
  } catch (error) {
    console.error("Error creating profile:", error);
    return NextResponse.json(
      { error: "Failed to create profile" },
      { status: 500 }
    );
  }
}

// PUT: Update profile
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const profile: UserProfile = body;

    if (!profile.id || !profile.accountId || !profile.name) {
      return NextResponse.json(
        { error: "Profile ID, account ID, and name are required" },
        { status: 400 }
      );
    }

    // Extract clientId and fail if not found
    const clientId = extractClientId(request);
    if (!clientId) {
      return NextResponse.json(
        { error: "Client ID is required" },
        { status: 400 }
      );
    }

    const updatedProfile = await updateProfile(profile);

    // Log the change to Firebase
    try {
      await storeChange(profile.accountId, "profile", clientId, { 
        profileId: parseInt(profile.id.replace(/\D/g, '')) || 0 
      });
    } catch (error) {
      console.warn("Failed to log profile update change:", error);
    }

    return NextResponse.json({
      success: true,
      data: updatedProfile,
      message: "Profile updated successfully"
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

// DELETE: Delete profile
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get("profileId");

    if (!profileId) {
      return NextResponse.json(
        { error: "Profile ID is required" },
        { status: 400 }
      );
    }

    // Extract clientId and fail if not found
    const clientId = extractClientId(request);
    if (!clientId) {
      return NextResponse.json(
        { error: "Client ID is required" },
        { status: 400 }
      );
    }

    // Get profile info before deletion for logging
    const profileToDelete = await getProfileById(profileId);
    
    await deleteProfile(profileId);

    // Log the change to Firebase
    if (profileToDelete) {
      try {
        await storeChange(profileToDelete.accountId, "profile", clientId, { 
          profileId: parseInt(profileToDelete.id.replace(/\D/g, '')) || 0 
        });
      } catch (error) {
        console.warn("Failed to log profile deletion change:", error);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Profile deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting profile:", error);
    return NextResponse.json(
      { error: "Failed to delete profile" },
      { status: 500 }
    );
  }
}
