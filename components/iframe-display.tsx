"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, ExternalLink, AlertTriangle } from "lucide-react";

interface IframeDisplayProps {
  code: string;
  onOutput: (output: string[]) => void;
  onError?: (error: { message: string; line?: number } | null) => void;
}

export default function IframeDisplay({
  code,
  onOutput,
  onError,
}: IframeDisplayProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [consoleMessages, setConsoleMessages] = useState<string[]>([]);

  const updateIframe = () => {
    if (!iframeRef.current || !code.trim()) {
      onOutput([]);
      onError?.(null);
      return;
    }

    setIsLoading(true);
    setLastError(null);
    setConsoleMessages([]);

    try {
      // Validate that the code contains basic HTML structure
      if (!code.includes("<html") && !code.includes("<!DOCTYPE")) {
        const error =
          "Code should contain a complete HTML document starting with <!DOCTYPE html> or <html>";
        setLastError(error);
        onError?.({ message: error });
        onOutput([`Error: ${error}`]);
        setIsLoading(false);
        return;
      }

      // Inject console shimming script into the HTML
      const consoleShimScript = `
        <script>
          (function() {
            const originalConsole = window.console;

            // Function to safely serialize arguments for console output
            function serializeArg(arg) {
              if (arg === null) return 'null';
              if (arg === undefined) return 'undefined';

              const type = typeof arg;

              if (type === 'string' || type === 'number' || type === 'boolean') {
                return String(arg);
              }

              if (type === 'function') {
                return \`<function: \${arg.name || 'anonymous'}>\`;
              }

              if (type === 'object') {
                // Handle special DOM objects
                if (arg === document) return '<document>';
                if (arg === window) return '<window>';
                if (arg instanceof HTMLElement) {
                  return \`<\${arg.tagName.toLowerCase()}\${arg.id ? '#' + arg.id : ''}\${arg.className ? '.' + arg.className.split(' ').join('.') : ''}>\`;
                }
                if (arg instanceof NodeList) return \`<NodeList: \${arg.length} items>\`;
                if (arg instanceof HTMLCollection) return \`<HTMLCollection: \${arg.length} items>\`;
                if (arg instanceof Event) return \`<Event: \${arg.type}>\`;
                if (arg instanceof Error) return \`<Error: \${arg.message}>\`;
                if (Array.isArray(arg)) {
                  try {
                    return JSON.stringify(arg);
                  } catch (e) {
                    return \`<Array: \${arg.length} items>\`;
                  }
                }

                // Try to serialize regular objects
                try {
                  return JSON.stringify(arg);
                } catch (e) {
                  // If serialization fails, provide a description
                  if (arg.constructor && arg.constructor.name) {
                    return \`<\${arg.constructor.name} object>\`;
                  }
                  return '<object>';
                }
              }

              return String(arg);
            }

            window.console = {
              ...originalConsole,
              log: function(...args) {
                originalConsole.log(...args);
                window.parent.postMessage({
                  type: 'console',
                  level: 'log',
                  message: args.map(serializeArg).join(' ')
                }, '*');
              },
              warn: function(...args) {
                originalConsole.warn(...args);
                window.parent.postMessage({
                  type: 'console',
                  level: 'warn',
                  message: args.map(serializeArg).join(' ')
                }, '*');
              },
              error: function(...args) {
                originalConsole.error(...args);
                window.parent.postMessage({
                  type: 'console',
                  level: 'error',
                  message: args.map(serializeArg).join(' ')
                }, '*');
              },
              debug: function(...args) {
                originalConsole.debug(...args);
                window.parent.postMessage({
                  type: 'console',
                  level: 'debug',
                  message: args.map(serializeArg).join(' ')
                }, '*');
              }
            };
          })();
        </script>
      `;

      // Inject the console shim into the HTML
      let modifiedCode = code;
      if (code.includes("</head>")) {
        modifiedCode = code.replace("</head>", consoleShimScript + "</head>");
      } else if (code.includes("<body")) {
        modifiedCode = code.replace("<body", consoleShimScript + "<body");
      } else {
        modifiedCode = consoleShimScript + code;
      }

      // Create blob URL for the modified HTML content
      const blob = new Blob([modifiedCode], { type: "text/html" });
      const url = URL.createObjectURL(blob);

      // Set up iframe load handler
      const iframe = iframeRef.current;
      const handleLoad = () => {
        setIsLoading(false);
        onOutput(["HTML page loaded successfully"]);
        onError?.(null);
      };

      const handleError = () => {
        setIsLoading(false);
        const error = "Failed to load HTML content";
        setLastError(error);
        onError?.({ message: error });
        onOutput([`Error: ${error}`]);
      };

      iframe.addEventListener("load", handleLoad);
      iframe.addEventListener("error", handleError);

      iframe.src = url;

      // Cleanup
      return () => {
        iframe.removeEventListener("load", handleLoad);
        iframe.removeEventListener("error", handleError);
        URL.revokeObjectURL(url);
      };
    } catch (error: any) {
      setIsLoading(false);
      const errorMsg = error.message || "Failed to create HTML preview";
      setLastError(errorMsg);
      onError?.({ message: errorMsg });
      onOutput([`Error: ${errorMsg}`]);
    }
  };

  useEffect(() => {
    const cleanup = updateIframe();
    return cleanup;
  }, [code]);

  // Listen for console messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "console") {
        const { level, message } = event.data;
        const formattedMessage = `[${level.toUpperCase()}] ${message}`;

        setConsoleMessages((prev) => [...prev, formattedMessage]);

        if (level === "error") {
          onError?.({ message });
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onError]);

  // Update parent with console messages whenever they change
  useEffect(() => {
    if (consoleMessages.length > 0) {
      onOutput(["HTML page loaded successfully", ...consoleMessages]);
    }
  }, [consoleMessages, onOutput]);

  const refreshIframe = () => {
    updateIframe();
  };

  const openInNewTab = () => {
    if (!code.trim()) return;

    const blob = new Blob([code], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");

    // Clean up the URL after a delay
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Website Preview */}
      <Card className="flex-1 flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Website Preview</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={openInNewTab}
                disabled={!code.trim() || isLoading}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={refreshIframe}
                disabled={isLoading}
              >
                <RefreshCw
                  className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-4">
          <div className="h-full border rounded-lg overflow-hidden bg-white relative">
            {lastError ? (
              <div className="h-full flex items-center justify-center p-8">
                <div className="text-center">
                  <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Preview Error
                  </h3>
                  <p className="text-gray-600 max-w-md">{lastError}</p>
                  <Button
                    className="mt-4"
                    variant="outline"
                    onClick={refreshIframe}
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            ) : !code.trim() ? (
              <div className="h-full flex items-center justify-center p-8">
                <div className="text-center text-gray-500">
                  <div className="text-6xl mb-4">🌐</div>
                  <h3 className="text-lg font-medium mb-2">HTML Preview</h3>
                  <p className="text-sm">
                    Write HTML code to see your webpage here
                  </p>
                </div>
              </div>
            ) : (
              <>
                {isLoading && (
                  <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                    <div className="text-center">
                      <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        Loading preview...
                      </p>
                    </div>
                  </div>
                )}
                <iframe
                  ref={iframeRef}
                  className="w-full h-full border-none"
                  sandbox="allow-scripts allow-same-origin allow-forms"
                  title="HTML Preview"
                />
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Console Output */}
      <Card className="flex flex-col mt-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Console Output</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-2">
          <div className="h-full bg-slate-900 rounded text-green-400 font-mono text-xs overflow-y-auto p-2">
            {consoleMessages.length > 0 ? (
              consoleMessages.map((message, index) => (
                <div key={index} className="mb-1">
                  {message}
                </div>
              ))
            ) : (
              <div className="text-slate-500 italic">
                Console output will appear here...
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
