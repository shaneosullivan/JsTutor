"use client";

import { useEffect, useRef, useState } from "react";
import { createCanvasAPI } from "@/lib/canvas-api";

interface ErrorInfo {
  message: string;
  line?: number;
  column?: number;
}

interface DrawingCanvasProps {
  code: string;
  maxHeight: number;
  onOutput: (output: string[]) => void;
  onError?: (error: ErrorInfo | null) => void;
}

export default function DrawingCanvas({
  code,
  maxHeight,
  onOutput,
  onError
}: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const intervalsRef = useRef<number[]>([]);
  const timeoutsRef = useRef<number[]>([]);
  const cleanupRef = useRef<{
    eventListeners: Array<{ element: any; event: string; handler: any }>;
  }>({ eventListeners: [] });

  // Cleanup function to clear all intervals, timeouts, and event listeners
  const cleanupAll = () => {
    // Clear intervals and timeouts
    intervalsRef.current.forEach((id) => clearInterval(id));
    timeoutsRef.current.forEach((id) => clearTimeout(id));
    intervalsRef.current = [];
    timeoutsRef.current = [];

    // Clear event listeners
    cleanupRef.current.eventListeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
    cleanupRef.current.eventListeners = [];
  };

  useEffect(() => {
    // Debounce code execution to prevent errors while typing
    const timer = setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) {
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }

      // Cleanup previous timers and event listeners
      cleanupAll();

      // Set canvas size
      canvas.width = 400;
      canvas.height = 400;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      try {
        // Create canvas API with cleanup tracking
        const canvasAPI = createCanvasAPI(ctx, cleanupRef.current);

        // Create wrapped timer functions that track their IDs
        const wrappedSetInterval = (callback: () => void, delay: number) => {
          const id = setInterval(callback, delay);
          intervalsRef.current.push(id as unknown as number);
          return id;
        };

        const wrappedSetTimeout = (callback: () => void, delay: number) => {
          const id = setTimeout(callback, delay);
          timeoutsRef.current.push(id as unknown as number);
          return id;
        };

        // Add printData utility function
        const outputBuffer: string[] = [];
        const printData = (data: any) => {
          const outputLine =
            typeof data === "string" ? data : JSON.stringify(data);
          outputBuffer.push(outputLine);
        };

        // Create a safe execution environment
        const safeCode = `
        ${Object.keys(canvasAPI)
          .map((key) => `const ${key} = canvasAPI.${key};`)
          .join("\n")}
        
        const setInterval = wrappedSetInterval;
        const setTimeout = wrappedSetTimeout;
        const printData = providedPrintData;
        
        ${code}
      `;

        // Execute the code
        const executeCode = new Function(
          "canvasAPI",
          "wrappedSetInterval",
          "wrappedSetTimeout",
          "providedPrintData",
          safeCode
        );
        executeCode(
          canvasAPI,
          wrappedSetInterval,
          wrappedSetTimeout,
          printData
        );

        setError(null);
        onError?.(null);

        // Send output buffer plus success messages
        const allOutput = [...outputBuffer];
        if (allOutput.length === 0) {
          allOutput.push(
            "✨ Code executed successfully!",
            "🎨 Your drawing is looking great!"
          );
        }
        onOutput(allOutput);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";

        // Parse line number from error stack if available
        let lineNumber: number | undefined;
        if (err instanceof Error && err.stack) {
          // Look for line numbers in the stack trace
          const stackMatch = err.stack.match(/<anonymous>:(\d+):\d+/);
          if (stackMatch) {
            // Subtract the number of lines we added before the user code
            const executedLine = parseInt(stackMatch[1]);
            const prefixLines = 7; // Number of lines added before user code
            lineNumber = Math.max(1, executedLine - prefixLines);
          }
        }

        const errorInfo: ErrorInfo = {
          message: errorMessage,
          line: lineNumber
        };

        setError(errorMessage);
        onError?.(errorInfo);

        const errorOutput = lineNumber
          ? `❌ Error on line ${lineNumber}: ${errorMessage}`
          : `❌ Error: ${errorMessage}`;
        onOutput([errorOutput]);

        // Draw error message on canvas
        ctx.fillStyle = "#ef4444";
        ctx.font = "16px Arial";
        ctx.fillText("Error in code!", 10, 30);
        ctx.font = "12px Arial";
        const displayMessage = lineNumber
          ? `Line ${lineNumber}: ${errorMessage}`
          : errorMessage;
        ctx.fillText(displayMessage, 10, 50);
      }
    }, 500); // 500ms debounce delay

    // Cleanup on unmount or code change
    return () => {
      clearTimeout(timer);
      cleanupAll();
    };
  }, [code, onOutput]);

  maxHeight = maxHeight || 400; // Default to 400 if not provided

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 h-full keyboard-transition">
      <canvas
        ref={canvasRef}
        className={`tutorial-canvas w-full h-full mx-auto rounded shadow-lg keyboard-stable`}
        style={{
          imageRendering: "pixelated",
          maxHeight: `${maxHeight}px`,
          maxWidth: `${maxHeight}px`
        }}
      />
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
}
