"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  useKeyboardDetection,
  KeyboardState,
} from "@/hooks/use-keyboard-detection";

interface KeyboardContextType extends KeyboardState {
  // Additional methods can be added here if needed
}

const KeyboardContext = createContext<KeyboardContextType>({
  isVisible: false,
  height: 0,
  visibleHeight: 0,
});

export function useKeyboard() {
  const context = useContext(KeyboardContext);
  if (!context) {
    throw new Error("useKeyboard must be used within a KeyboardProvider");
  }
  return context;
}

interface KeyboardProviderProps {
  children: React.ReactNode;
}

export function KeyboardProvider({ children }: KeyboardProviderProps) {
  const [isClientMounted, setIsClientMounted] = useState(false);
  const keyboardState = useKeyboardDetection();

  // Only apply dynamic heights after client-side hydration
  useEffect(() => {
    setIsClientMounted(true);
  }, []);

  // Track touch events to prevent scrolling on iOS
  useEffect(() => {
    if (!keyboardState.isVisible) {
      return;
    }

    let startY = 0;
    let startX = 0;

    const htmlElement = document.body.parentElement;

    if (htmlElement) {
      htmlElement.scrollTop = 0; // Reset scroll position to top
    }

    const preventWheelScroll = (e: WheelEvent) => {
      // Allow scrolling within the code editor and other scrollable elements
      const target = e.target as HTMLElement;
      const scrollableParent = target.closest(
        '.cm-scroller, .overflow-y-auto, .overflow-auto, [data-allow-scroll="true"]',
      );

      if (scrollableParent) {
        // Allow scrolling within these elements
        return;
      }

      // Prevent all other scrolling
      e.preventDefault();
    };

    const preventGestureScroll = (e: Event) => {
      // Allow scrolling within the code editor and other scrollable elements
      const target = e.target as HTMLElement;
      const scrollableParent = target.closest(
        '.cm-scroller, .overflow-y-auto, .overflow-auto, [data-allow-scroll="true"]',
      );

      if (scrollableParent) {
        // Allow scrolling within these elements
        return;
      }

      // Prevent all other scrolling
      e.preventDefault();
    };

    const preventTouchMove = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      const scrollableParent = target.closest(
        '.cm-scroller, .overflow-y-auto, .overflow-auto, [data-allow-scroll="true"]',
      );

      if (scrollableParent) {
        // For scrollable elements, check if they can actually scroll
        const canScrollY =
          scrollableParent.scrollHeight > scrollableParent.clientHeight;
        const canScrollX =
          scrollableParent.scrollWidth > scrollableParent.clientWidth;

        if (canScrollY || canScrollX) {
          // Allow scrolling within the element bounds
          return;
        }
      }

      // Prevent document-level scrolling
      e.preventDefault();
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        startY = e.touches[0].clientY;
        startX = e.touches[0].clientX;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;

      const touch = e.touches[0];
      const deltaY = touch.clientY - startY;
      const deltaX = touch.clientX - startX;

      const target = e.target as HTMLElement;
      const scrollableParent = target.closest(
        '.cm-scroller, .overflow-y-auto, .overflow-auto, [data-allow-scroll="true"]',
      );

      if (scrollableParent) {
        const element = scrollableParent as HTMLElement;
        const canScrollY = element.scrollHeight > element.clientHeight;
        const canScrollX = element.scrollWidth > element.clientWidth;

        // Check if the scroll is at the boundaries
        const atTop = element.scrollTop <= 0;
        const atBottom =
          element.scrollTop >= element.scrollHeight - element.clientHeight;
        const atLeft = element.scrollLeft <= 0;
        const atRight =
          element.scrollLeft >= element.scrollWidth - element.clientWidth;

        // Prevent scrolling beyond boundaries
        if (
          (deltaY > 0 && atTop && canScrollY) ||
          (deltaY < 0 && atBottom && canScrollY) ||
          (deltaX > 0 && atLeft && canScrollX) ||
          (deltaX < 0 && atRight && canScrollX)
        ) {
          e.preventDefault();
          return;
        }

        // Allow scrolling within bounds
        if (canScrollY || canScrollX) {
          return;
        }
      }

      // Prevent all document-level scrolling
      e.preventDefault();
    };

    // Add event listeners with passive: false to ensure preventDefault works
    document.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchmove", preventTouchMove, {
      passive: false,
    });
    document.addEventListener("wheel", preventWheelScroll, { passive: false });

    // Additional iOS Safari specific prevention
    document.addEventListener("gesturestart", preventGestureScroll, {
      passive: false,
    });
    document.addEventListener("gesturechange", preventGestureScroll, {
      passive: false,
    });
    document.addEventListener("gestureend", preventGestureScroll, {
      passive: false,
    });

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchmove", preventTouchMove);
      document.removeEventListener("wheel", preventWheelScroll);
      document.removeEventListener("gesturestart", preventGestureScroll);
      document.removeEventListener("gesturechange", preventGestureScroll);
      document.removeEventListener("gestureend", preventGestureScroll);
    };
  }, [keyboardState.isVisible]);

  // Set CSS custom properties and control document height
  useEffect(() => {
    if (typeof document !== "undefined") {
      const html = document.documentElement;
      const body = document.body;

      // Set CSS custom properties
      html.style.setProperty(
        "--visible-height",
        `${keyboardState.visibleHeight}px`,
      );
      html.style.setProperty("--keyboard-height", `${keyboardState.height}px`);
      html.style.setProperty(
        "--keyboard-visible",
        keyboardState.isVisible ? "1" : "0",
      );

      // Control document height and scrolling
      if (keyboardState.isVisible) {
        // When keyboard is visible, constrain html and body to visible height
        html.style.height = `${keyboardState.visibleHeight}px`;
        html.style.maxHeight = `${keyboardState.visibleHeight}px`;

        body.style.height = `${keyboardState.visibleHeight}px`;
        body.style.maxHeight = `${keyboardState.visibleHeight}px`;

        // Add CSS class for document-level constraints
        html.classList.add("keyboard-constrained");
        body.classList.add("keyboard-no-scroll");

        // Also prevent scrolling on the main content containers
        const mainContainers = document.querySelectorAll(
          '[data-main-container="true"], .min-h-screen, .h-screen',
        );
        mainContainers.forEach((container) => {
          (container as HTMLElement).style.overflow = "hidden";
          (container as HTMLElement).style.height =
            `${keyboardState.visibleHeight}px`;
          (container as HTMLElement).style.maxHeight =
            `${keyboardState.visibleHeight}px`;
        });
      } else {
        // When keyboard is hidden, restore normal document behavior
        html.style.height = "";
        html.style.maxHeight = "";

        body.style.height = "";
        body.style.maxHeight = "";

        // Remove CSS classes
        html.classList.remove("keyboard-constrained");
        body.classList.remove("keyboard-no-scroll");

        // Restore main container styles
        const mainContainers = document.querySelectorAll(
          '[data-main-container="true"], .min-h-screen, .h-screen',
        );
        mainContainers.forEach((container) => {
          (container as HTMLElement).style.overflow = "";
          (container as HTMLElement).style.height = "";
          (container as HTMLElement).style.maxHeight = "";
        });
      }
    }

    // Cleanup function to restore styles on unmount
    return () => {
      if (typeof document !== "undefined") {
        const html = document.documentElement;
        const body = document.body;

        // Restore all styles to default
        html.style.height = "";
        html.style.maxHeight = "";

        body.style.height = "";
        body.style.maxHeight = "";

        // Remove CSS classes
        html.classList.remove("keyboard-constrained");
        body.classList.remove("keyboard-no-scroll");

        // Restore main container styles
        const mainContainers = document.querySelectorAll(
          '[data-main-container="true"], .min-h-screen, .h-screen',
        );
        mainContainers.forEach((container) => {
          (container as HTMLElement).style.overflow = "";
          (container as HTMLElement).style.height = "";
          (container as HTMLElement).style.maxHeight = "";
        });
      }
    };
  }, [keyboardState]);

  // Use default values during SSR, actual values after hydration
  const effectiveHeight = isClientMounted ? keyboardState.visibleHeight : 0;
  const effectiveMinHeight = isClientMounted ? keyboardState.visibleHeight : 0;

  return (
    <KeyboardContext.Provider value={keyboardState}>
      <div
        className={`keyboard-responsive-container keyboard-transition ${
          keyboardState.isVisible ? "ios-keyboard-adjust" : ""
        }`}
        style={{
          height: effectiveHeight || undefined,
          minHeight: effectiveMinHeight || undefined,
        }}
      >
        {children}
      </div>
    </KeyboardContext.Provider>
  );
}
