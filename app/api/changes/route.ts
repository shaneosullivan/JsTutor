import { NextRequest, NextResponse } from "next/server";
import {
  getChangesForAccount,
  getObjectsFromChanges,
  getAccountById
} from "@/lib/firebase-admin";
import { extractClientId } from "@/lib/api-utils";

// GET: Check for changes made by other clients in the same account
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get("accountId");
    const types = searchParams.get("types");
    const courseId = searchParams.get("courseId");

    if (!accountId) {
      return NextResponse.json(
        { error: "Account ID is required" },
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

    // Verify the account exists
    const account = await getAccountById(accountId);
    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    // Parse filters
    const filters: {
      types?: ("account" | "profile" | "course")[];
      courseId?: string;
    } = {};

    if (types) {
      const typeArray = types.split(",").map((t) => t.trim()) as (
        | "account"
        | "profile"
        | "course"
      )[];
      const validTypes = typeArray.filter((t) =>
        ["account", "profile", "course"].includes(t)
      );
      if (validTypes.length > 0) {
        filters.types = validTypes;
      }
    }

    if (courseId) {
      filters.courseId = courseId;
    }

    // Get changes made by other clients
    const changes = await getChangesForAccount(accountId, clientId, filters);

    // Get the actual objects based on the changes
    const objects = await getObjectsFromChanges(accountId, changes);

    return NextResponse.json({
      success: true,
      data: {
        account: objects.account,
        profile: objects.profile,
        course: objects.course
      },
      meta: {
        totalChanges: changes.length,
        filters: filters
      }
    });
  } catch (error) {
    console.error("Error retrieving changes:", error);
    return NextResponse.json(
      { error: "Failed to retrieve changes" },
      { status: 500 }
    );
  }
}
