"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Copy } from "lucide-react";

interface PrintDataDisplayProps {
  code: string;
  onOutput: (output: string[]) => void;
  onError?: (error: { message: string; line?: number } | null) => void;
}

interface OutputItem {
  id: number;
  data: any;
  timestamp: Date;
  type: "log" | "error";
  line?: number;
}

export default function PrintDataDisplay({
  code,
  onOutput,
  onError
}: PrintDataDisplayProps) {
  const [outputItems, setOutputItems] = useState<OutputItem[]>([]);
  const outputRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);
  const intervalsRef = useRef<number[]>([]);
  const timeoutsRef = useRef<number[]>([]);
  const savedScrollPositionRef = useRef<number>(0);

  // Cleanup function to clear all intervals and timeouts
  const cleanupAll = () => {
    intervalsRef.current.forEach((id) => clearInterval(id));
    timeoutsRef.current.forEach((id) => clearTimeout(id));
    intervalsRef.current = [];
    timeoutsRef.current = [];
  };

  const printData = (data: any) => {
    // Capture line number from stack trace
    const error = new Error();
    let line: number | undefined;

    if (error.stack) {
      // Look for the line number in the stack trace
      const stackLines = error.stack.split("\n");
      for (const stackLine of stackLines) {
        // Look for <anonymous>:line:column pattern
        const match = stackLine.match(/<anonymous>:(\d+):\d+/);
        if (match) {
          // Convert to user code line number (subtract function wrapper lines)
          const stackLineNum = parseInt(match[1]);
          // Adjust for the function wrapper - subtract 2 to account for function declaration and other wrapper lines
          line = Math.max(1, stackLineNum - 2);
          break;
        }
      }
    }

    const newItem: OutputItem = {
      id: nextId.current++,
      data,
      timestamp: new Date(),
      type: "log",
      line
    };
    setOutputItems((prev) => [...prev, newItem]);
  };

  const addError = (message: string, line?: number) => {
    const newItem: OutputItem = {
      id: nextId.current++,
      data: { message, line },
      timestamp: new Date(),
      type: "error",
      line
    };
    setOutputItems((prev) => [...prev, newItem]);
  };

  useEffect(() => {
    // Debounce code execution to prevent errors while typing
    const timer = setTimeout(() => {
      if (!code.trim()) {
        setOutputItems([]);
        onOutput([]);
        onError?.(null);
        return;
      }

      // Cleanup previous timers
      cleanupAll();

      // Save current scroll position before clearing output
      if (outputRef.current) {
        savedScrollPositionRef.current = outputRef.current.scrollTop;
      }

      // Clear previous output
      setOutputItems([]);

      try {
        // Create wrapped timer functions that track their IDs
        const wrappedSetTimeout = (fn: Function, delay: number) => {
          const id = window.setTimeout(fn, delay);
          timeoutsRef.current.push(id);
          return id;
        };

        const wrappedSetInterval = (fn: Function, delay: number) => {
          const id = window.setInterval(fn, delay);
          intervalsRef.current.push(id);
          return id;
        };

        // Create a custom console that captures output
        const customGlobal = {
          printData,
          console: {
            log: printData,
            error: (msg: any) => addError(String(msg)),
            warn: (msg: any) => printData(`⚠️ ${msg}`),
            info: printData
          },
          Math,
          Date,
          JSON,
          Array,
          Object,
          String,
          Number,
          Boolean,
          parseInt,
          parseFloat,
          isNaN,
          setTimeout: wrappedSetTimeout,
          setInterval: wrappedSetInterval,
          clearTimeout: window.clearTimeout.bind(window),
          clearInterval: window.clearInterval.bind(window)
        };

        // Execute the code in a controlled environment
        const func = new Function(...Object.keys(customGlobal), code);
        func(...Object.values(customGlobal));

        onError?.(null);

        // Restore scroll position after code execution is complete
        setTimeout(() => {
          if (outputRef.current) {
            outputRef.current.scrollTop = savedScrollPositionRef.current;
          }
        }, 50);
      } catch (error: any) {
        console.error("PrintData execution error:", error);

        // Try to extract line number from error
        let line: number | undefined;
        const lineMatch = error.stack?.match(/<anonymous>:(\d+):/);
        if (lineMatch) {
          line = parseInt(lineMatch[1]) - 1; // Adjust for function wrapper
        }

        const errorInfo = {
          message: error.message || "Unknown error occurred",
          line
        };

        addError(errorInfo.message, errorInfo.line);
        onError?.(errorInfo);

        // Restore scroll position even after error
        setTimeout(() => {
          if (outputRef.current) {
            outputRef.current.scrollTop = savedScrollPositionRef.current;
          }
        }, 50);
      }
    }, 500); // 500ms debounce delay

    // Cleanup on unmount or code change
    return () => {
      clearTimeout(timer);
      cleanupAll();
    };
  }, [code]);

  // Update parent with output strings
  useEffect(() => {
    const outputStrings = outputItems.map((item) => {
      if (item.type === "error") {
        return `Error: ${item.data.message}${item.data.line ? ` (line ${item.data.line})` : ""}`;
      }
      const linePrefix = item.line ? `[Line ${item.line}] ` : "";
      return `${linePrefix}${formatData(item.data)}`;
    });
    onOutput(outputStrings);
  }, [outputItems]);

  const formatData = (data: any): string => {
    if (data === null) {
      return "null";
    }
    if (data === undefined) {
      return "undefined";
    }
    if (typeof data === "string") {
      return data;
    }
    if (typeof data === "number" || typeof data === "boolean") {
      return String(data);
    }
    if (Array.isArray(data)) {
      return `Array(${data.length}) [${data.map(formatData).join(", ")}]`;
    }
    if (typeof data === "object") {
      try {
        return JSON.stringify(data, null, 2);
      } catch {
        return "[Object]";
      }
    }
    return String(data);
  };

  const renderDataValue = (data: any) => {
    if (data === null) {
      return <span className="text-gray-500 italic">null</span>;
    }
    if (data === undefined) {
      return <span className="text-gray-500 italic">undefined</span>;
    }
    if (typeof data === "string") {
      return <span className="text-green-700">"{data}"</span>;
    }
    if (typeof data === "number") {
      return <span className="text-blue-600">{data}</span>;
    }
    if (typeof data === "boolean") {
      return <span className="text-purple-600">{String(data)}</span>;
    }
    if (Array.isArray(data)) {
      return (
        <div className="ml-4">
          <span className="text-gray-600">Array({data.length}) [</span>
          <div className="ml-4 border-l-2 border-gray-200 pl-4">
            {data.map((item, index) => (
              <div key={index} className="py-1">
                <span className="text-gray-500">{index}:</span>{" "}
                {renderDataValue(item)}
              </div>
            ))}
          </div>
          <span className="text-gray-600">]</span>
        </div>
      );
    }
    if (typeof data === "object") {
      return (
        <div className="ml-4">
          <span className="text-gray-600">Object {"{"}</span>
          <div className="ml-4 border-l-2 border-gray-200 pl-4">
            {Object.entries(data).map(([key, value]) => (
              <div key={key} className="py-1">
                <span className="text-blue-800 font-medium">{key}:</span>{" "}
                {renderDataValue(value)}
              </div>
            ))}
          </div>
          <span className="text-gray-600">{"}"}</span>
        </div>
      );
    }
    return <span>{String(data)}</span>;
  };

  const clearOutput = () => {
    setOutputItems([]);
  };

  const copyOutput = () => {
    const text = outputItems
      .map((item) => {
        const timestamp = item.timestamp.toLocaleTimeString();
        const linePrefix = item.line ? `[Line ${item.line}] ` : "";
        if (item.type === "error") {
          return `[${timestamp}] ${linePrefix}Error: ${item.data.message}`;
        }
        return `[${timestamp}] ${linePrefix}${formatData(item.data)}`;
      })
      .join("\n");

    navigator.clipboard.writeText(text);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 pl-12">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Console Output</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={copyOutput}
              disabled={outputItems.length === 0}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearOutput}
              disabled={outputItems.length === 0}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        <div
          ref={outputRef}
          className="h-full overflow-y-auto p-4 bg-gray-50 font-mono text-sm space-y-3"
        >
          {outputItems.length === 0 ? (
            <div className="text-gray-500 italic text-center py-8">
              Use printData() to display values here
            </div>
          ) : (
            outputItems.map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded-lg border ${
                  item.type === "error"
                    ? "bg-red-50 border-red-200 text-red-800"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {item.line && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-mono">
                        Line {item.line}
                      </span>
                    )}
                    <span className="text-xs text-gray-500">
                      {item.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  {item.type === "error" && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                      Error
                    </span>
                  )}
                </div>
                <div>
                  {item.type === "error" ? (
                    <div>
                      <div className="font-medium">{item.data.message}</div>
                      {item.data.line && (
                        <div className="text-sm text-red-600 mt-1">
                          at line {item.data.line}
                        </div>
                      )}
                    </div>
                  ) : (
                    renderDataValue(item.data)
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
