"use client";

import { useEffect, useState } from "react";
import { BUILD_ID } from "@/config/buildId";
import { syncIfNewer } from "@/lib/profile-storage";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RefreshCw, Sparkles } from "lucide-react";

export default function VersionChecker() {
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const checkForDataUpdates = async () => {
    try {
      const wasSynced = await syncIfNewer();
      if (wasSynced) {
        console.log("✅ Synced newer remote data on app focus");
      }
    } catch (error) {
      console.log("Failed to check for data updates:", error);
    }
  };

  const checkForUpdates = async () => {
    try {
      const response = await fetch(`/buildId.json?bustCache=${Date.now()}`);
      const data = await response.json();

      console.log("Current BUILD_ID:", BUILD_ID);
      console.log("Latest BUILD_ID from server:", data.BUILD_ID);

      if (data.BUILD_ID !== BUILD_ID) {
        console.log(
          "New version available:",
          data.BUILD_ID,
          " current:",
          BUILD_ID,
        );
        setShowUpdateDialog(true);
      } else {
        // No app update, check for data updates
        await checkForDataUpdates();
      }
    } catch (error) {
      console.log("Failed to check for app updates:", error);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Give a small delay to show the loading state
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  useEffect(() => {
    const handleFocus = () => {
      // Check for updates when the app comes back into focus
      checkForUpdates();
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Page became visible again
        checkForUpdates();
      }
    };

    // Listen for focus events
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
      <DialogContent className="max-w-md bg-white border border-slate-200 shadow-2xl">
        <DialogHeader className="text-center">
          <DialogTitle className="flex items-center justify-center text-slate-800 text-xl">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full p-2 mr-3">
              <Sparkles className="h-5 w-5" />
            </div>
            New Version Available!
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            A new version of the app is ready with improvements and new
            features.
          </DialogDescription>
        </DialogHeader>

        <div className="text-center space-y-4 p-4">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
            <p className="text-slate-700 leading-relaxed">
              We've updated the app with new features and improvements!
              <br />
              <span className="font-medium text-green-700">
                Click below to load the latest version.
              </span>
            </p>
          </div>

          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 py-3"
          >
            {isRefreshing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Loading New Version...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Update Now
              </>
            )}
          </Button>

          <p className="text-xs text-slate-500">
            Your progress will be preserved during the update
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
