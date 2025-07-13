"use client";

import React, { Component, ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

interface BrowserFeature {
  name: string;
  isSupported: boolean;
  description: string;
}

export class BrowserCompatibilityErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Application startup error:", error, errorInfo);
  }

  checkBrowserCompatibility(): BrowserFeature[] {
    const features: BrowserFeature[] = [
      {
        name: "ES6 Modules",
        isSupported: typeof window !== "undefined" && "noModule" in HTMLScriptElement.prototype,
        description: "Support for modern JavaScript modules"
      },
      {
        name: "Fetch API",
        isSupported: typeof window !== "undefined" && "fetch" in window,
        description: "Modern network request API"
      },
      {
        name: "Web Workers",
        isSupported: typeof window !== "undefined" && "Worker" in window,
        description: "Background script execution"
      },
      {
        name: "Local Storage",
        isSupported: typeof window !== "undefined" && "localStorage" in window,
        description: "Client-side data storage"
      },
      {
        name: "Service Workers",
        isSupported: typeof window !== "undefined" && "serviceWorker" in navigator,
        description: "Offline functionality and caching"
      },
      {
        name: "WebAssembly",
        isSupported: typeof window !== "undefined" && "WebAssembly" in window,
        description: "High-performance code execution"
      },
      {
        name: "CSS Grid",
        isSupported: typeof window !== "undefined" && CSS.supports("display", "grid"),
        description: "Modern layout system"
      },
      {
        name: "CSS Custom Properties",
        isSupported: typeof window !== "undefined" && CSS.supports("--custom", "value"),
        description: "Dynamic styling variables"
      }
    ];

    return features;
  }

  render() {
    if (this.state.hasError) {
      const browserFeatures = this.checkBrowserCompatibility();
      const unsupportedFeatures = browserFeatures.filter(feature => !feature.isSupported);

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-red-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <CardTitle className="text-2xl text-red-800">
                Browser Compatibility Issue
              </CardTitle>
              <CardDescription className="text-red-600">
                Your browser doesn't support all the features required to run this application
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {unsupportedFeatures.length > 0 && (
                <div>
                  <h3 className="font-semibold text-red-800 mb-3">
                    Unsupported Features:
                  </h3>
                  <div className="space-y-2">
                    {unsupportedFeatures.map((feature, index) => (
                      <div
                        key={index}
                        className="bg-red-50 border border-red-200 rounded-md p-3"
                      >
                        <div className="flex items-start">
                          <svg
                            className="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <div>
                            <div className="font-medium text-red-800">
                              {feature.name}
                            </div>
                            <div className="text-sm text-red-600">
                              {feature.description}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-semibold text-gray-800 mb-4">
                  Recommended Browsers:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <a
                    href="https://www.mozilla.org/firefox/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-12 h-12 mr-4 flex-shrink-0">
                      <svg viewBox="0 0 24 24" className="w-full h-full">
                        <path
                          fill="#FF7139"
                          d="M23.05 11.01c-.111-.706-.365-1.368-.737-1.934a12.05 12.05 0 0 0-1.171-1.744 7.39 7.39 0 0 0-.739-.834 3.07 3.07 0 0 1-.365-.431 1.9 1.9 0 0 1-.189-.27l-.023-.038a1.67 1.67 0 0 1-.121-.232 3.94 3.94 0 0 1-.189-.586A5.26 5.26 0 0 1 19.436 4c0-.035-.003-.07-.006-.105a7.46 7.46 0 0 0-1.858.111 9.54 9.54 0 0 0-2.508.875 10.98 10.98 0 0 0-2.409 1.554 12.38 12.38 0 0 0-2.124 2.124 13.11 13.11 0 0 0-1.554 2.409 9.54 9.54 0 0 0-.875 2.508 7.46 7.46 0 0 0-.111 1.858c.035 0 .07.003.105.006a5.26 5.26 0 0 1 1.902.084c.205.063.402.134.586.189.08.027.158.076.232.121l.038.023c.09.064.18.129.27.189.144.122.287.247.431.365.278.247.553.495.834.739a7.39 7.39 0 0 1 1.744 1.171c.566.372 1.228.626 1.934.737.35.055.704.084 1.06.084.355 0 .71-.029 1.06-.084z"
                        />
                        <path
                          fill="#FFAD2E"
                          d="M22.313 12.07c-.055-.35-.084-.704-.084-1.06 0-.355.029-.71.084-1.06-.111-.706-.365-1.368-.737-1.934a12.05 12.05 0 0 0-1.171-1.744 7.39 7.39 0 0 0-.739-.834 3.07 3.07 0 0 1-.365-.431 1.9 1.9 0 0 1-.189-.27l-.023-.038a1.67 1.67 0 0 1-.121-.232 3.94 3.94 0 0 1-.189-.586A5.26 5.26 0 0 1 19.352 4.91a7.46 7.46 0 0 0-1.858-.801 9.54 9.54 0 0 0-2.508-.364 10.98 10.98 0 0 0-2.409.245 12.38 12.38 0 0 0-2.124 1.072 13.11 13.11 0 0 0-1.554 1.656 9.54 9.54 0 0 0-.875 2.178 7.46 7.46 0 0 0-.111 1.621c.035-.035.07-.067.105-.097a5.26 5.26 0 0 1 1.902-.716c.205-.036.402-.067.586-.068.08-.003.158.017.232.062l.038.011c.09.032.18.065.27.094.144.061.287.124.431.183.278.123.553.247.834.367a7.39 7.39 0 0 1 1.744.587c.566.186 1.228.313 1.934.369z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Firefox</div>
                      <div className="text-sm text-gray-600">
                        Fast, private and secure
                      </div>
                    </div>
                  </a>
                  
                  <a
                    href="https://www.google.com/chrome/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-12 h-12 mr-4 flex-shrink-0">
                      <svg viewBox="0 0 24 24" className="w-full h-full">
                        <circle cx="12" cy="12" r="10" fill="#4285F4"/>
                        <circle cx="12" cy="12" r="6" fill="#34A853"/>
                        <circle cx="12" cy="12" r="3" fill="#EA4335"/>
                        <path fill="#FBBC05" d="M12 2a10 10 0 0 1 8.66 15H12V2z"/>
                        <path fill="#EA4335" d="M2 12a10 10 0 0 1 10-10v10H2z"/>
                        <path fill="#34A853" d="M12 22a10 10 0 0 1-8.66-15H12v15z"/>
                        <circle cx="12" cy="12" r="3" fill="#FFF"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Chrome</div>
                      <div className="text-sm text-gray-600">
                        Fast and secure web browser
                      </div>
                    </div>
                  </a>
                </div>
              </div>

              {this.state.error && (
                <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                  <h4 className="font-medium text-gray-800 mb-2">Technical Details:</h4>
                  <div className="text-sm text-gray-600 font-mono bg-gray-100 p-2 rounded">
                    {this.state.error.message}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}