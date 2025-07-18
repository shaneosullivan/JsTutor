import { NextRequest, NextResponse } from "next/server";
import { getAccountData } from "@/lib/firebase-admin";

// GET: Retrieve only the timestamp of account data from Firestore
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get("accountId");

    if (!accountId) {
      return NextResponse.json(
        { error: "Account ID is required" },
        { status: 400 }
      );
    }

    const accountData = await getAccountData(accountId);

    if (!accountData) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    // Return only the timestamp, not the full data
    return NextResponse.json({
      success: true,
      lastUpdated: accountData.lastUpdated,
      version: accountData.version
    });
  } catch (error) {
    console.error("Error retrieving account timestamp:", error);
    return NextResponse.json(
      { error: "Failed to retrieve account timestamp" },
      { status: 500 }
    );
  }
}
