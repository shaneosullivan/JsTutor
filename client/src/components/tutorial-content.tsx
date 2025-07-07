import { useState, useEffect } from "react";
import { RotateCcw, ArrowRight, Eraser, Lightbulb, ChevronDown, ChevronUp, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import CodeEditor from "@/components/code-editor";
import DrawingCanvas from "@/components/drawing-canvas";
import AiChat from "@/components/ai-chat";
import type { Tutorial } from "@shared/schema";

interface TutorialContentProps {
  tutorial: Tutorial;
  onComplete: (tutorialId: number) => void;
  isCompleted: boolean;
  onNext?: () => void;
  hasNext: boolean;
}

export default function TutorialContent({ 
  tutorial, 
  onComplete, 
  isCompleted,
  onNext,
  hasNext
}: TutorialContentProps) {
  const [code, setCode] = useState(tutorial.starterCode);
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isExplanationOpen, setIsExplanationOpen] = useState(true); // Start expanded for first-time reading
  const [hasBeenOpened, setHasBeenOpened] = useState(false);
  const [showAiChat, setShowAiChat] = useState(false);

  // Reset code when tutorial changes and auto-expand explanation for new tutorials
  useEffect(() => {
    setCode(tutorial.starterCode);
    setOutput([]);
    setIsExplanationOpen(true); // Auto-expand for each new tutorial
    setHasBeenOpened(false);
    setShowAiChat(false); // Close AI chat when switching tutorials
  }, [tutorial.id, tutorial.starterCode]);

  // Handle explanation section open/close
  const handleExplanationToggle = (open: boolean) => {
    setIsExplanationOpen(open);
    if (open) {
      setHasBeenOpened(true);
    }
  };

  // Auto-execute code when it changes (but not on initial load)
  useEffect(() => {
    if (code === tutorial.starterCode) return; // Don't auto-run starter code
    
    const timeoutId = setTimeout(() => {
      handleRunCode();
    }, 1000); // Wait 1 second after user stops typing

    return () => clearTimeout(timeoutId);
  }, [code, tutorial.starterCode]);

  const handleReset = () => {
    setCode(tutorial.starterCode);
    setOutput([]);
  };

  const handleRunCode = async () => {
    if (isRunning) return; // Prevent multiple simultaneous executions
    
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
        // Don't auto-complete tutorials - let user decide when to advance
      } else {
        setOutput(["Error: " + result.error]);
      }
    } catch (error) {
      setOutput(["Error: Failed to execute code"]);
    } finally {
      setIsRunning(false);
    }
  };

  const handleCompleteTutorial = () => {
    onComplete(tutorial.id);
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
            {!isCompleted && (
              <Button 
                onClick={handleCompleteTutorial}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Mark Complete & Continue
                <ArrowRight size={16} className="ml-2" />
              </Button>
            )}
            {isCompleted && hasNext && (
              <Button 
                onClick={onNext}
                className="gradient-success text-white"
              >
                Next Lesson
                <ArrowRight size={16} className="ml-2" />
              </Button>
            )}
            {isCompleted && !hasNext && (
              <Button className="gradient-success text-white">
                Course Complete!
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Tutorial Content Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Tutorial Text and Code Editor */}
        <div className="w-1/2 flex flex-col">
          {/* Tutorial Explanation - Collapsible */}
          <div className="bg-white border-b border-slate-200">
            <Collapsible open={isExplanationOpen} onOpenChange={handleExplanationToggle}>
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between p-4 hover:bg-slate-50 cursor-pointer transition-colors">
                  <div className="flex items-center text-lg font-medium">
                    <Lightbulb className="text-yellow-500 mr-2" size={20} />
                    What You'll Learn
                  </div>
                  {isExplanationOpen ? (
                    <ChevronUp className="text-slate-500" size={20} />
                  ) : (
                    <ChevronDown className="text-slate-500" size={20} />
                  )}
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-6 pb-6">
                  <div className="text-slate-700 leading-relaxed mb-4 whitespace-pre-line">
                    {tutorial.content}
                  </div>
                  {tutorial.expectedOutput && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-800 mb-2">Expected Output:</h4>
                      <p className="text-blue-700 text-sm">{tutorial.expectedOutput}</p>
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
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
                    onClick={handleClearCanvas}
                    variant="outline"
                    size="sm"
                    className="text-slate-300 border-slate-600"
                  >
                    <Eraser size={14} className="mr-1" />
                    Clear Canvas
                  </Button>
                  {isRunning && (
                    <span className="text-green-400 text-sm">Running...</span>
                  )}
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
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">
                  <span className="text-pink-500">🎨</span> {showAiChat ? "AI Assistant" : "Your Drawing Canvas"}
                </h3>
                <p className="text-sm text-slate-600">
                  {showAiChat ? "Get help with your code!" : "Watch your code come to life!"}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowAiChat(!showAiChat)}
                  variant={showAiChat ? "default" : "outline"}
                  size="sm"
                >
                  <Bot size={16} className="mr-2" />
                  {showAiChat ? "Show Canvas" : "Help Me"}
                </Button>
                {!showAiChat && (
                  <Button
                    onClick={handleClearCanvas}
                    variant="outline"
                    size="sm"
                  >
                    <Eraser size={16} className="mr-2" />
                    Clear Canvas
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Canvas Area or AI Chat */}
          <div className="flex-1 p-6 bg-slate-50">
            {showAiChat ? (
              <AiChat
                tutorialId={tutorial.id}
                code={code}
                onClose={() => setShowAiChat(false)}
              />
            ) : (
              <DrawingCanvas code={code} onOutput={setOutput} />
            )}
          </div>

          {/* Output Console - Only show when not using AI chat */}
          {!showAiChat && (
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
                    <span className="text-blue-400">&gt;</span> Code output will appear here...
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
