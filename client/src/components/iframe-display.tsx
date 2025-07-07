import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, ExternalLink, AlertTriangle } from "lucide-react";

interface IframeDisplayProps {
  code: string;
  onOutput: (output: string[]) => void;
  onError?: (error: { message: string; line?: number } | null) => void;
}

export default function IframeDisplay({ code, onOutput, onError }: IframeDisplayProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  const updateIframe = () => {
    if (!iframeRef.current || !code.trim()) {
      onOutput([]);
      onError?.(null);
      return;
    }

    setIsLoading(true);
    setLastError(null);

    try {
      // Validate that the code contains basic HTML structure
      if (!code.includes('<html') && !code.includes('<!DOCTYPE')) {
        const error = "Code should contain a complete HTML document starting with <!DOCTYPE html> or <html>";
        setLastError(error);
        onError?.({ message: error });
        onOutput([`Error: ${error}`]);
        setIsLoading(false);
        return;
      }

      // Create blob URL for the HTML content
      const blob = new Blob([code], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      // Set up iframe load handler
      const iframe = iframeRef.current;
      const handleLoad = () => {
        setIsLoading(false);
        onOutput(['HTML page loaded successfully']);
        onError?.(null);
        
        // Try to capture console messages from iframe
        try {
          const iframeWindow = iframe.contentWindow;
          if (iframeWindow) {
            // Override console methods to capture output
            const originalConsole = (iframeWindow as any).console;
            const capturedLogs: string[] = [];
            
            (iframeWindow as any).console = {
              ...originalConsole,
              log: (...args: any[]) => {
                capturedLogs.push(`Console: ${args.join(' ')}`);
                originalConsole.log(...args);
                onOutput([...['HTML page loaded successfully'], ...capturedLogs]);
              },
              error: (...args: any[]) => {
                const errorMsg = args.join(' ');
                capturedLogs.push(`Error: ${errorMsg}`);
                originalConsole.error(...args);
                onError?.({ message: errorMsg });
                onOutput([...['HTML page loaded successfully'], ...capturedLogs]);
              },
              warn: (...args: any[]) => {
                capturedLogs.push(`Warning: ${args.join(' ')}`);
                originalConsole.warn(...args);
                onOutput([...['HTML page loaded successfully'], ...capturedLogs]);
              }
            };
          }
        } catch (e) {
          // Cross-origin restrictions might prevent console access
          console.log('Cannot access iframe console due to security restrictions');
        }
      };

      const handleError = () => {
        setIsLoading(false);
        const error = 'Failed to load HTML content';
        setLastError(error);
        onError?.({ message: error });
        onOutput([`Error: ${error}`]);
      };

      iframe.addEventListener('load', handleLoad);
      iframe.addEventListener('error', handleError);
      
      iframe.src = url;

      // Cleanup
      return () => {
        iframe.removeEventListener('load', handleLoad);
        iframe.removeEventListener('error', handleError);
        URL.revokeObjectURL(url);
      };
    } catch (error: any) {
      setIsLoading(false);
      const errorMsg = error.message || 'Failed to create HTML preview';
      setLastError(errorMsg);
      onError?.({ message: errorMsg });
      onOutput([`Error: ${errorMsg}`]);
    }
  };

  useEffect(() => {
    const cleanup = updateIframe();
    return cleanup;
  }, [code]);

  const refreshIframe = () => {
    updateIframe();
  };

  const openInNewTab = () => {
    if (!code.trim()) return;
    
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    
    // Clean up the URL after a delay
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <Card className="h-full flex flex-col">
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
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
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
                <p className="text-gray-600 max-w-md">
                  {lastError}
                </p>
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
                <h3 className="text-lg font-medium mb-2">
                  HTML Preview
                </h3>
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
                    <p className="text-sm text-gray-600">Loading preview...</p>
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
  );
}