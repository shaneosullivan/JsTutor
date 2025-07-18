import { NextRequest, NextResponse } from "next/server";
import {
  getAccountById,
  createAccount,
  updateAccount,
  storeChange
} from "@/lib/firebase-admin";
import { AccountData } from "@/lib/types";
import { extractClientId } from "@/lib/api-utils";

// GET: Retrieve account by ID
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

    const account = await getAccountById(accountId);

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: account
    });
  } catch (error) {
    console.error("Error retrieving account:", error);
    return NextResponse.json(
      { error: "Failed to retrieve account" },
      { status: 500 }
    );
  }
}

// POST: Create or update account
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const account: AccountData = body;

    if (!account.id || !account.email) {
      return NextResponse.json(
        { error: "Account ID and email are required" },
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

    const savedAccount = await createAccount(account);

    // Log the change to Firebase
    try {
      await storeChange(account.id, "account", clientId);
    } catch (error) {
      console.warn("Failed to log account creation change:", error);
    }

    return NextResponse.json({
      success: true,
      data: savedAccount,
      message: "Account saved successfully"
    });
  } catch (error) {
    console.error("Error saving account:", error);
    return NextResponse.json(
      { error: "Failed to save account" },
      { status: 500 }
    );
  }
}

// PUT: Update account
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const account: AccountData = body;

    if (!account.id || !account.email) {
      return NextResponse.json(
        { error: "Account ID and email are required" },
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

    const updatedAccount = await updateAccount(account);

    // Log the change to Firebase
    try {
      await storeChange(account.id, "account", clientId);
    } catch (error) {
      console.warn("Failed to log account update change:", error);
    }

    return NextResponse.json({
      success: true,
      data: updatedAccount,
      message: "Account updated successfully"
    });
  } catch (error) {
    console.error("Error updating account:", error);
    return NextResponse.json(
      { error: "Failed to update account" },
      { status: 500 }
    );
  }
}
