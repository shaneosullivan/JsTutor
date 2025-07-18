import { NextRequest, NextResponse } from "next/server";
import {
  getProfilesByAccountId,
  getProfileById,
  createProfile,
  updateProfile,
  deleteProfile
} from "@/lib/firebase-admin";
import { UserProfile } from "@/lib/types";

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

    const savedProfile = await createProfile(profile);

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

    const updatedProfile = await updateProfile(profile);

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

    await deleteProfile(profileId);

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
