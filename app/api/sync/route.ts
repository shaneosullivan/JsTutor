import { NextRequest, NextResponse } from "next/server";
import { getAccountData, saveAccountData } from "@/lib/firebase-admin";

// GET: Retrieve account data from Firestore
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

    return NextResponse.json({
      success: true,
      data: accountData,
    });
  } catch (error) {
    console.error("Error retrieving account data:", error);
    return NextResponse.json(
      { error: "Failed to retrieve account data" },
      { status: 500 }
    );
  }
}

// POST: Save account data to Firestore
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accountId, email, data } = body;

    if (!accountId || !email || !data) {
      return NextResponse.json(
        { error: "Account ID, email, and data are required" },
        { status: 400 }
      );
    }

    await saveAccountData(accountId, email, data);

    return NextResponse.json({
      success: true,
      message: "Account data saved successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error saving account data:", error);
    return NextResponse.json(
      { error: "Failed to save account data" },
      { status: 500 }
    );
  }
}
