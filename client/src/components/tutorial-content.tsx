import { useState } from "react";
import { RotateCcw, ArrowRight, Play, Eraser, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CodeEditor from "@/components/code-editor";
import DrawingCanvas from "@/components/drawing-canvas";
import type { Tutorial } from "@shared/schema";

interface TutorialContentProps {
  tutorial: Tutorial;
  onComplete: (tutorialId: number) => void;
  isCompleted: boolean;
}

export default function TutorialContent({ 
  tutorial, 
  onComplete, 
  isCompleted 
}: TutorialContentProps) {
  const [code, setCode] = useState(tutorial.starterCode);
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const handleReset = () => {
    setCode(tutorial.starterCode);
    setOutput([]);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      const response = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code })
      });
      
      const result = await response.json();
      if (result.success) {
        setOutput(result.logs || ["Code executed successfully!"]);
        // Mark as completed if not already
        if (!isCompleted) {
          onComplete(tutorial.id);
        }
      } else {
        setOutput(["Error: " + result.error]);
      }
    } catch (error) {
      setOutput(["Error: Failed to execute code"]);
    } finally {
      setIsRunning(false);
    }
  };

  const handleClearCanvas = () => {
    // This will be handled by the canvas component
    setOutput(["Canvas cleared!"]);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Tutorial Header */}
      <div className="bg-white border-b border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{tutorial.title}</h2>
            <p className="text-slate-600 mt-1">{tutorial.description}</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleReset}
              variant="outline"
              className="text-slate-700"
            >
              <RotateCcw size={16} className="mr-2" />
              Reset
            </Button>
            {isCompleted && (
              <Button className="gradient-success text-white">
                <ArrowRight size={16} className="ml-2" />
                Completed!
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Tutorial Content Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Tutorial Text and Code Editor */}
        <div className="w-1/2 flex flex-col">
          {/* Tutorial Explanation */}
          <div className="bg-white p-6 border-b border-slate-200">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Lightbulb className="text-yellow-500 mr-2" size={20} />
                  What You'll Learn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 leading-relaxed mb-4">
                  {tutorial.content}
                </p>
                {tutorial.expectedOutput && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">Expected Output:</h4>
                    <p className="text-blue-700 text-sm">{tutorial.expectedOutput}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Code Editor */}
          <div className="flex-1 bg-slate-900 overflow-hidden">
            <div className="p-4 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-medium">
                  <span className="text-purple-400">💻</span> Code Editor
                </h3>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={handleRunCode}
                    disabled={isRunning}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Play size={14} className="mr-1" />
                    {isRunning ? "Running..." : "Run Code"}
                  </Button>
                  <Button
                    onClick={handleClearCanvas}
                    variant="outline"
                    size="sm"
                    className="text-slate-300 border-slate-600"
                  >
                    <Eraser size={14} className="mr-1" />
                    Clear
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="h-full overflow-hidden">
              <CodeEditor
                value={code}
                onChange={setCode}
                language="javascript"
                className="h-full"
              />
            </div>
          </div>
        </div>

        {/* Canvas and Output */}
        <div className="w-1/2 flex flex-col bg-white border-l border-slate-200">
          {/* Canvas Header */}
          <div className="p-4 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800">
              <span className="text-pink-500">🎨</span> Your Drawing Canvas
            </h3>
            <p className="text-sm text-slate-600">Watch your code come to life!</p>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 p-6 bg-slate-50">
            <DrawingCanvas code={code} onOutput={setOutput} />
          </div>

          {/* Output Console */}
          <div className="bg-slate-800 p-4 border-t border-slate-700">
            <h4 className="text-white font-medium mb-2">
              <span className="text-green-400">📟</span> Console Output
            </h4>
            <div className="bg-slate-900 rounded p-3 text-sm font-mono text-green-400 h-20 overflow-y-auto">
              {output.length > 0 ? (
                output.map((line, i) => (
                  <div key={i} className="mb-1">
                    <span className="text-blue-400">&gt;</span> {line}
                  </div>
                ))
              ) : (
                <div className="text-slate-500">
                  <span className="text-blue-400">&gt;</span> Click "Run Code" to see output here!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
