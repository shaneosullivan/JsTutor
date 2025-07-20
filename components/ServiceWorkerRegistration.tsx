"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      const registerSW = async () => {
        try {
          const registration = await navigator.serviceWorker.register("/sw.js");

          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              console.log("New service worker version available");
              newWorker.addEventListener("statechange", () => {
                if (
                  newWorker.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {
                  console.log(
                    "New service worker installed, reload recommended"
                  );
                  // Optionally show a toast or notification here
                }
              });
            }
          });
        } catch (error) {
          console.error("Service Worker registration failed:", error);
        }
      };

      // Register service worker after the page loads
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", registerSW);
      } else {
        registerSW();
      }
    }
  }, []);

  return null;
}
