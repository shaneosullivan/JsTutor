"use client";

import { useState, useEffect } from "react";

export interface KeyboardState {
  isVisible: boolean;
  height: number;
  visibleHeight: number;
}

export function useKeyboardDetection(): KeyboardState {
  const [keyboardState, setKeyboardState] = useState<KeyboardState>({
    isVisible: false,
    height: 0,
    visibleHeight: typeof window !== "undefined" ? window.innerHeight : 0
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    let initialViewportHeight = window.innerHeight;
    let currentViewportHeight = window.innerHeight;

    // On mobile Safari, we need to use visual viewport if available
    const viewport = window.visualViewport;

    const updateKeyboardState = () => {
      const newHeight = viewport ? viewport.height : window.innerHeight;
      const screenHeight = window.screen.height;

      // Calculate if keyboard is likely visible
      // We consider keyboard visible if the viewport height is significantly smaller
      const heightDifference = initialViewportHeight - newHeight;
      const isKeyboardVisible = heightDifference > 150; // 150px threshold for keyboard detection

      const keyboardHeight = isKeyboardVisible ? heightDifference : 0;

      setKeyboardState({
        isVisible: isKeyboardVisible,
        height: keyboardHeight,
        visibleHeight: newHeight
      });

      currentViewportHeight = newHeight;
    };

    // Handle viewport changes (keyboard show/hide)
    const handleResize = () => {
      // Use requestAnimationFrame to debounce rapid resize events
      requestAnimationFrame(updateKeyboardState);
    };

    const handleVisualViewportChange = () => {
      requestAnimationFrame(updateKeyboardState);
    };

    // Set initial state
    updateKeyboardState();

    // Listen for viewport changes
    window.addEventListener("resize", handleResize);

    // Visual Viewport API is more reliable for keyboard detection on iOS
    if (viewport) {
      viewport.addEventListener("resize", handleVisualViewportChange);
      viewport.addEventListener("scroll", handleVisualViewportChange);
    }

    // iOS Safari specific: listen for focusin/focusout on input elements
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.contentEditable === "true")
      ) {
        // Delay to allow keyboard animation to complete
        setTimeout(updateKeyboardState, 300);
      }
    };

    const handleFocusOut = () => {
      // Delay to allow keyboard animation to complete
      setTimeout(updateKeyboardState, 300);
    };

    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);

      if (viewport) {
        viewport.removeEventListener("resize", handleVisualViewportChange);
        viewport.removeEventListener("scroll", handleVisualViewportChange);
      }
    };
  }, []);

  return keyboardState;
}
