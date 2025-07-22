"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Loader2, LogIn, LogOut, Smartphone, Cloud } from "lucide-react";
import {
  createAccount,
  getActiveAccount,
  removeAccount,
  initializeFirebaseSync,
  type Account
} from "@/lib/profile-storage";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: () => void;
          renderButton: (element: HTMLElement, config: any) => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}

interface GoogleSignInProps {
  clientId: string;
  onSignInSuccess?: (account: Account) => void;
  onSignOut?: () => void;
  onReady?: () => void;
}

export default function GoogleSignIn({
  clientId,
  onSignInSuccess,
  onSignOut,
  onReady
}: GoogleSignInProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [account, setAccount] = useState<Account | null>(null);

  useEffect(() => {
    // Check if user is already signed in
    const activeAccount = getActiveAccount();
    setAccount(activeAccount);

    // Load Google Identity Services script
    const loadGoogleScript = () => {
      if (window.google?.accounts) {
        setIsGoogleLoaded(true);
        initializeGoogle();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setIsGoogleLoaded(true);
        initializeGoogle();
      };
      document.head.appendChild(script);
    };

    loadGoogleScript();
  }, []);

  const initializeGoogle = () => {
    if (!window.google?.accounts) {
      return;
    }

    // const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId || clientId === "YOUR_GOOGLE_CLIENT_ID") {
      console.warn(
        "Google Client ID not configured. Please set GOOGLE_CLIENT_ID environment variable."
      );
      setIsConfigured(false);
      return;
    }

    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        auto_select: false,
        // Add callback for when user dismisses or cancels the prompt
        cancel_on_tap_outside: true
      });
      setIsConfigured(true);
      // Notify parent that Google is ready
      onReady?.();
    } catch (error) {
      console.error("Failed to initialize Google Sign-In:", error);
      setIsConfigured(false);
      // Still notify ready even if configuration failed
      onReady?.();
    }
  };

  const handleCredentialResponse = async (response: any) => {
    // Clear the timeout since sign-in is proceeding
    if ((window as any).googleSignInTimeout) {
      clearTimeout((window as any).googleSignInTimeout);
      (window as any).googleSignInTimeout = null;
    }

    setIsLoading(true);
    try {
      // Send credential to our OAuth callback API
      const callbackResponse = await fetch("/api/auth/google/callback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          credential: response.credential,
          redirectUrl: window.location.pathname
        })
      });

      if (!callbackResponse.ok) {
        throw new Error(
          `OAuth callback failed: ${callbackResponse.statusText}`
        );
      }

      const result = await callbackResponse.json();

      if (!result.success) {
        throw new Error(result.error || "OAuth callback failed");
      }

      // Use the account data directly from the server (which properly handles existing accounts)
      const accountData = {
        ...result.account,
        createdAt: result.account.createdAt || new Date().toISOString()
      };

      // Store the account directly in TinyBase with the server-provided ID
      const { getStore } = await import("@/lib/profile-storage");
      const store = getStore();
      store.setRow("accounts", accountData.id, accountData);
      store.setValue("activeAccountId", accountData.id);

      setAccount(accountData);

      // Initialize Firebase sync for the account
      try {
        await initializeFirebaseSync(result.isNewAccount);
        // Call success callback after sync is complete
        onSignInSuccess?.(accountData);
      } catch (error) {
        console.warn(
          "Failed to initialize Firebase sync after sign-in:",
          error
        );
        // Still call success callback even if sync fails
        onSignInSuccess?.(accountData);
      }
    } catch (error) {
      console.error("Failed to process Google sign-in:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = () => {
    if (!window.google?.accounts || !isConfigured) {
      return;
    }

    setIsLoading(true);

    // Store timeout reference to clear it if needed
    let timeoutRef: NodeJS.Timeout | null = null;

    try {
      window.google.accounts.id.prompt();

      // Set a timeout to reset loading state if user dismisses the prompt
      // This handles the case where the user dismisses the modal without completing sign-in
      timeoutRef = setTimeout(() => {
        // Only reset loading if we're still in loading state and no account was created
        if (isLoading && !getActiveAccount()) {
          console.log(
            "Sign-in prompt timeout - assuming user dismissed or cancelled"
          );
          setIsLoading(false);
        }
      }, 10000); // 10 second timeout - reasonable time for user to interact with prompt

      // Store the timeout reference so we can clear it if sign-in succeeds
      (window as any).googleSignInTimeout = timeoutRef;
    } catch (error) {
      console.error("Failed to show Google sign-in prompt:", error);
      setIsLoading(false);
      if (timeoutRef) {
        clearTimeout(timeoutRef);
      }
    }
  };

  const handleSignOut = () => {
    // Get the currently active account from the store
    const activeAccount = getActiveAccount();
    if (activeAccount && activeAccount.id) {
      removeAccount(activeAccount.id);
    } else {
      // Fallback: clear activeAccountId directly if no account found
      const { getStore } = require("@/lib/profile-storage");
      const store = getStore();
      store.delValue("activeAccountId");

      // Force save to localStorage
      const { getPersister } = require("@/lib/profile-storage");
      const persister = getPersister();
      if (persister) {
        persister.save().catch((error: any) => {
          console.warn(
            "Failed to save sign-out changes to localStorage:",
            error
          );
        });
      }
    }

    setAccount(null);
    onSignOut?.();

    // Also disable Google auto-select
    if (window.google?.accounts) {
      window.google.accounts.id.disableAutoSelect();
    }
  };

  if (!isConfigured) {
    return (
      <Card className="w-full bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full">
              <Cloud className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-xl bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
            Cross-Device Sync
          </CardTitle>
          <CardDescription className="text-center max-w-md mx-auto text-yellow-700">
            Setup required to enable cross-device sync with Google
          </CardDescription>
        </CardHeader>

        <CardContent className="text-center space-y-4">
          <div className="bg-white/70 rounded-lg p-4 border border-yellow-200">
            <p className="text-sm text-yellow-800 font-medium mb-2">
              🔧 Configuration Required
            </p>
            <p className="text-xs text-yellow-700 leading-relaxed">
              To enable Google sign-in, please set up your Google OAuth Client
              ID:
            </p>
            <ol className="text-xs text-yellow-700 mt-2 space-y-1 text-left max-w-xs mx-auto">
              <li>1. Get a Google OAuth Client ID</li>
              <li>2. Add GOOGLE_CLIENT_ID to .env.local</li>
              <li>3. Restart the development server</li>
            </ol>
          </div>

          <Button
            disabled
            className="w-full bg-gray-300 text-gray-500 cursor-not-allowed"
          >
            <LogIn className="h-4 w-4 mr-2" />
            Sign In with Google (Setup Required)
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
            <Cloud className="h-6 w-6 text-white" />
          </div>
          <Smartphone className="h-6 w-6 text-blue-600" />
        </div>
        <CardTitle className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Cross-Device Sync
        </CardTitle>
        <CardDescription className="text-center max-w-md mx-auto">
          {account ? (
            <span className="text-green-700 font-medium">
              ✓ Signed in as {account.email}
            </span>
          ) : (
            "Sign in with Google to sync your progress across all your devices. Your learning data will be securely stored and accessible anywhere you sign in."
          )}
        </CardDescription>
      </CardHeader>

      <CardContent className="text-center space-y-4">
        {account ? (
          <div className="space-y-3">
            <div className="bg-white/70 rounded-lg p-3 border border-green-200">
              <p className="text-sm text-gray-700">
                <strong>Account:</strong> {account.email}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Connected on {new Date(account.createdAt).toLocaleDateString()}
              </p>
              <div className="text-xs text-green-600 mt-2">
                ✓ Automatic sync enabled
              </div>
            </div>

            <Button
              onClick={handleSignOut}
              variant="outline"
              className="w-full bg-white/80 hover:bg-red-50 border-red-200 text-red-700 hover:text-red-800"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="bg-white/70 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-center space-x-2 text-blue-700 mb-2">
                <Cloud className="h-4 w-4" />
                <span className="font-medium text-sm">
                  Benefits of signing in:
                </span>
              </div>
              <ul className="text-xs text-gray-600 space-y-1 text-left max-w-xs mx-auto">
                <li>• Access your progress on any device</li>
                <li>• Never lose your completed tutorials</li>
                <li>• Seamless switching between devices</li>
                <li>• Secure cloud backup</li>
              </ul>
            </div>

            <Button
              onClick={handleSignIn}
              disabled={isLoading || !isConfigured || !isGoogleLoaded}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Signing In...
                </>
              ) : !isGoogleLoaded ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : !isConfigured ? (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In with Google (Setup Required)
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In with Google
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
