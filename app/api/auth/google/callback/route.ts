import { NextRequest, NextResponse } from "next/server";
import { saveAccountData, findAccountByEmail } from "@/lib/firebase-admin";

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

    // Look for existing account in Firebase by email
    let accountId: string;
    let isNewAccount = false;

    try {
      // Search for existing account by email in Firebase
      const existingAccountId = await findAccountByEmail(email);

      if (existingAccountId) {
        accountId = existingAccountId;
        console.log(
          "Found existing account for email:",
          email,
          "ID:",
          accountId
        );
      } else {
        // Create new account ID
        accountId = `account_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
        isNewAccount = true;
        console.log("Creating new account for email:", email, "ID:", accountId);

        // Create minimal account data in Firebase to establish the account
        const initialAccountData = {
          tables: {
            profiles: {},
            accounts: {
              [accountId]: {
                id: accountId,
                email: email,
                provider: "google",
                createdAt: new Date().toISOString(),
                lastSignIn: new Date().toISOString(),
              },
            },
          },
          values: {
            activeAccountId: accountId,
          },
        };

        await saveAccountData(accountId, email, initialAccountData);
      }
    } catch (error) {
      console.warn(
        "Failed to check Firebase for existing account, creating new one:",
        error
      );
      // If Firebase check fails, create new account ID
      accountId = `account_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
      isNewAccount = true;
    }

    // Return account information to be stored in localStorage
    const accountData = {
      id: accountId,
      email: email,
      provider: "google",
      createdAt: isNewAccount ? new Date().toISOString() : undefined,
      lastSignIn: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      account: accountData,
      isNewAccount,
      redirectUrl: redirectUrl || "/",
    });
  } catch (error) {
    console.error("Error in Google OAuth callback:", error);
    return NextResponse.json(
      { error: "Failed to process Google authentication" },
      { status: 500 }
    );
  }
}
