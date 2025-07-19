import { NextRequest, NextResponse } from "next/server";
import {
  getCourseProgressByAccountAndProfile,
  getCourseProgressById,
  createCourseProgress,
  updateCourseProgress,
  deleteCourseProgress,
  storeChange
} from "@/lib/firebase-admin";
import { CourseProgress } from "@/lib/types";
import { extractClientId } from "@/lib/api-utils";

// GET: Retrieve course progress by account/profile or specific course progress
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get("accountId");
    const profileId = searchParams.get("profileId");
    const courseId = searchParams.get("courseId");

    if (courseId && accountId && profileId) {
      // Get specific course progress
      const progress = await getCourseProgressById(
        accountId,
        profileId,
        courseId
      );
      if (!progress) {
        return NextResponse.json(
          { error: "Course progress not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        data: progress
      });
    } else if (accountId && profileId) {
      // Get all course progress for account/profile
      const progressList = await getCourseProgressByAccountAndProfile(
        accountId,
        profileId
      );
      return NextResponse.json({
        success: true,
        data: progressList
      });
    } else {
      return NextResponse.json(
        { error: "Account ID and profile ID are required" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error retrieving course progress:", error);
    return NextResponse.json(
      { error: "Failed to retrieve course progress" },
      { status: 500 }
    );
  }
}

// POST: Create or update course progress
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const progress: CourseProgress = body;

    if (!progress.accountId || !progress.profileId || !progress.courseId) {
      return NextResponse.json(
        { error: "Account ID, profile ID, and course ID are required" },
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

    const savedProgress = await updateCourseProgress(progress);

    // Log the change to Firebase
    try {
      await storeChange(progress.accountId, "course", clientId, {
        courseId: parseInt(progress.courseId),
        profileId: progress.profileId
      });
    } catch (error) {
      console.warn("Failed to log course progress change:", error);
    }

    return NextResponse.json({
      success: true,
      data: savedProgress,
      message: "Course progress saved successfully"
    });
  } catch (error) {
    console.error("Error saving course progress:", error);
    return NextResponse.json(
      { error: "Failed to save course progress" },
      { status: 500 }
    );
  }
}

// PUT: Update course progress
// export async function PUT(request: NextRequest) {
//   try {
//     const body = await request.json();
//     const progress: CourseProgress = body;

//     if (!progress.accountId || !progress.profileId || !progress.courseId) {
//       return NextResponse.json(
//         { error: "Account ID, profile ID, and course ID are required" },
//         { status: 400 }
//       );
//     }

//     // Extract clientId and fail if not found
//     const clientId = extractClientId(request);
//     if (!clientId) {
//       return NextResponse.json(
//         { error: "Client ID is required" },
//         { status: 400 }
//       );
//     }

//     const updatedProgress = await updateCourseProgress(progress);

//     // Log the change to Firebase
//     try {
//       await storeChange(progress.accountId, "course", clientId, {
//         courseId: parseInt(progress.courseId),
//         profileId: parseInt(progress.profileId.replace(/\D/g, "")) || 0
//       });
//     } catch (error) {
//       console.warn("Failed to log course progress update change:", error);
//     }

//     return NextResponse.json({
//       success: true,
//       data: updatedProgress,
//       message: "Course progress updated successfully"
//     });
//   } catch (error) {
//     console.error("Error updating course progress:", error);
//     return NextResponse.json(
//       { error: "Failed to update course progress" },
//       { status: 500 }
//     );
//   }
// }

// DELETE: Delete course progress
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get("accountId");
    const profileId = searchParams.get("profileId");
    const courseId = searchParams.get("courseId");

    if (!accountId || !profileId || !courseId) {
      return NextResponse.json(
        { error: "Account ID, profile ID, and course ID are required" },
        { status: 400 }
      );
    }

    await deleteCourseProgress(accountId, profileId, courseId);

    return NextResponse.json({
      success: true,
      message: "Course progress deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting course progress:", error);
    return NextResponse.json(
      { error: "Failed to delete course progress" },
      { status: 500 }
    );
  }
}
