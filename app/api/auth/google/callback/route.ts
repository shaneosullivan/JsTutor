import { NextRequest, NextResponse } from "next/server";
import { createOrGetAccountByEmail } from "@/lib/firebase-admin";

// Handle Google OAuth callback
export async function POST(request: NextRequest) {
  try {
    console.log("===> Processing Google OAuth callback <===");

    const body = await request.json();
    const { credential, redirectUrl } = body;

    if (!credential) {
      return NextResponse.json(
        { error: "Google credential is required" },
        { status: 400 }
      );
    }

    // Decode the JWT token to get user info
    const payload = JSON.parse(atob(credential.split(".")[1]));
    const email = payload.email;

    if (!email) {
      return NextResponse.json(
        { error: "Email not found in Google credential" },
        { status: 400 }
      );
    }

    // Atomically create or get existing account by email
    let accountId: string;
    let isNewAccount = false;

    try {
      const result = await createOrGetAccountByEmail(email);
      accountId = result.accountId;
      isNewAccount = result.isNewAccount;

      console.log(
        isNewAccount
          ? "Created new account for email:"
          : "Found existing account for email:",
        email,
        "ID:",
        accountId
      );
    } catch (error) {
      console.error("Failed to create or get account:", error);
      return NextResponse.json(
        { error: "Failed to create or retrieve account" },
        { status: 500 }
      );
    }

    // Return account information to be stored in localStorage
    const accountData = {
      id: accountId,
      email: email,
      provider: "google",
      createdAt: isNewAccount ? new Date().toISOString() : undefined,
      lastSignIn: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      account: accountData,
      isNewAccount,
      redirectUrl: redirectUrl || "/"
    });
  } catch (error) {
    console.error("Error in Google OAuth callback:", error);
    return NextResponse.json(
      { error: "Failed to process Google authentication" },
      { status: 500 }
    );
  }
}
