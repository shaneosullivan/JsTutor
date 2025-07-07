import { X, HelpCircle, Code, Palette, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Tutorial } from "@shared/schema";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTutorial?: Tutorial | null;
}

export default function HelpModal({ isOpen, onClose, currentTutorial }: HelpModalProps) {
  const drawingCommands = [
    {
      command: "drawPixel(x, y, color)",
      description: "Draw a single pixel at position (x, y)"
    },
    {
      command: "drawCircle(x, y, radius, color)",
      description: "Draw a circle centered at (x, y) with given radius"
    },
    {
      command: "drawLine(x1, y1, x2, y2, color)",
      description: "Draw a line from (x1, y1) to (x2, y2)"
    },
    {
      command: "drawRect(x, y, width, height, color)",
      description: "Draw a rectangle starting at (x, y)"
    },
    {
      command: "drawText(x, y, text, color)",
      description: "Draw text at position (x, y)"
    },
    {
      command: "clearCanvas()",
      description: "Clear the entire canvas"
    }
  ];

  const troubleshootingTips = [
    "Check your spelling carefully - JavaScript is case-sensitive!",
    "Make sure you have all the parentheses () and brackets {}",
    "Don't forget semicolons ; at the end of statements",
    "Try the example code first to see how it works",
    "Colors can be words like 'red', 'blue' or hex codes like '#FF0000'",
    "Canvas coordinates start at (0, 0) in the top-left corner"
  ];

  const commonErrors = [
    {
      error: "ReferenceError: xyz is not defined",
      solution: "Make sure you've spelled the variable or function name correctly"
    },
    {
      error: "SyntaxError: Unexpected token",
      solution: "Check for missing or extra parentheses, brackets, or semicolons"
    },
    {
      error: "TypeError: Cannot read property",
      solution: "Make sure your variable has been created before using it"
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <HelpCircle className="text-blue-500 mr-2" size={24} />
            Need Help?
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Current Tutorial Help */}
          {currentTutorial && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Help for: {currentTutorial.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 mb-4">{currentTutorial.content}</p>
                {currentTutorial.expectedOutput && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h4 className="font-medium text-blue-800 mb-2">What you should see:</h4>
                    <p className="text-blue-700 text-sm">{currentTutorial.expectedOutput}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Drawing Commands */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="text-pink-500 mr-2" size={20} />
                Drawing Commands
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {drawingCommands.map((cmd, i) => (
                  <div key={i} className="border-l-4 border-green-400 pl-4">
                    <code className="text-sm font-mono bg-slate-100 px-2 py-1 rounded">
                      {cmd.command}
                    </code>
                    <p className="text-sm text-slate-600 mt-1">{cmd.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Troubleshooting Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Code className="text-blue-500 mr-2" size={20} />
                Troubleshooting Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {troubleshootingTips.map((tip, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span className="text-slate-700 text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Common Errors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="text-red-500 mr-2" size={20} />
                Common Errors & Solutions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {commonErrors.map((item, i) => (
                  <div key={i} className="border border-red-200 rounded-lg p-3 bg-red-50">
                    <h4 className="font-medium text-red-800 mb-2">
                      Error: {item.error}
                    </h4>
                    <p className="text-red-700 text-sm">
                      <strong>Solution:</strong> {item.solution}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Close Button */}
          <div className="flex justify-end">
            <Button onClick={onClose} className="gradient-primary text-white">
              Got it! Let's code! 🚀
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
