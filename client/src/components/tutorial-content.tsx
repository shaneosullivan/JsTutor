import { useState, useEffect } from "react";
import { RotateCcw, ArrowRight, Eraser, Lightbulb, ChevronLeft, Bot, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import CodeEditor from "@/components/code-editor";
import DrawingCanvas from "@/components/drawing-canvas";
import PrintDataDisplay from "@/components/print-data-display";
import IframeDisplay from "@/components/iframe-display";
import AiChat from "@/components/ai-chat";
import HelpModal from "@/components/help-modal";
import type { Tutorial } from "@shared/schema";

interface TutorialContentProps {
  tutorial: Tutorial;
  onComplete: () => void;
  isCompleted: boolean;
  onNext?: () => void;
  hasNext: boolean;
  userCode: string;
  onCodeChange: (code: string) => void;
  courseType?: string;
}

export default function TutorialContent({ 
  tutorial, 
  onComplete, 
  isCompleted,
  onNext,
  hasNext,
  userCode,
  onCodeChange,
  courseType = 'canvas'
}: TutorialContentProps) {
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isExplanationOpen, setIsExplanationOpen] = useState(true);
  const [showAiChat, setShowAiChat] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [canvasError, setCanvasError] = useState<{message: string; line?: number} | null>(null);

  // Auto-expand "What You'll Learn" when tutorial changes
  useEffect(() => {
    setOutput([]);
    setIsRunning(false);
    setCanvasError(null);
    setIsExplanationOpen(true); // Always expand when moving to a new tutorial
    // Don't reset showAiChat here - let it persist but the AI chat will reset its own state
  }, [tutorial.id]);

  // Handle explanation toggle
  const handleExplanationToggle = () => {
    setIsExplanationOpen(!isExplanationOpen);
  };

  const handleComplete = () => {
    onComplete();
  };

  const handleReset = () => {
    onCodeChange(tutorial.starterCode || '');
    setOutput([]);
    setCanvasError(null);
  };

  const handleClearCanvas = () => {
    setOutput([]);
    setCanvasError(null);
  };

  const handleCanvasError = (error: {message: string; line?: number} | null) => {
    setCanvasError(error);
  };

  const handleShowAiChat = () => {
    setShowAiChat(true);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Tutorial Header */}
      <div className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{tutorial.title}</h1>
            <p className="text-slate-600 mt-1">{tutorial.description}</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleShowAiChat}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transition-all duration-200 hover:scale-105 shadow-lg"
              size="sm"
            >
              <Bot className="h-4 w-4 mr-2" />
              🤖 Help Me!
            </Button>
            
            {isCompleted ? (
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-green-600 font-medium">Completed!</span>
                {hasNext && onNext && (
                  <Button onClick={onNext} className="ml-4">
                    Next Lesson <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            ) : (
              <Button onClick={handleComplete} className="gradient-primary">
                Mark Complete & Continue
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Tutorial Instructions (Collapsible) */}
        <div className={cn(
          "border-r border-slate-200 bg-white flex flex-col transition-all duration-300",
          isExplanationOpen ? "w-96" : "w-12"
        )}>
          {/* Collapse Toggle */}
          <div className="p-3 border-b border-slate-200">
            {isExplanationOpen ? (
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleExplanationToggle}
                  className="p-1 h-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHelp(true)}
                  className="p-1 h-8 gradient-primary text-white hover:opacity-80"
                  title="Get Help"
                >
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleExplanationToggle}
                  className="w-full justify-center p-1 h-8"
                >
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHelp(true)}
                  className="w-full justify-center p-1 h-8 gradient-primary text-white hover:opacity-80"
                  title="Get Help"
                >
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Collapsible Content */}
          {isExplanationOpen && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="p-6 flex-1 overflow-y-auto">
                {/* What You'll Learn Header */}
                <div className="flex items-center space-x-2 mb-4">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  <span className="font-semibold text-slate-800">What You'll Learn</span>
                </div>

                {/* Tutorial Content */}
                <Card className="mb-6 border-yellow-200 bg-yellow-50">
                  <CardContent className="p-4">
                    <div className="prose prose-sm max-w-none">
                      {tutorial.content.split('\n').map((paragraph, index) => (
                        <p key={index} className="mb-3 last:mb-0 text-slate-700 leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Expected Output */}
                {tutorial.expectedOutput && (
                  <Card className="mb-4 border-blue-200 bg-blue-50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-blue-800 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8z" clipRule="evenodd" />
                        </svg>
                        What You'll Create
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-blue-700 text-sm">{tutorial.expectedOutput}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Output Console */}
                <Card className="mb-4">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-slate-700">Output</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearCanvas}
                        className="h-6 px-2 text-xs"
                      >
                        <Eraser className="h-3 w-3 mr-1" />
                        Clear
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="bg-slate-900 rounded-md p-3 min-h-[100px] max-h-[200px] overflow-y-auto">
                      {output.length > 0 ? (
                        output.map((line, index) => (
                          <div key={index} className="text-green-400 text-sm font-mono mb-1">
                            {line}
                          </div>
                        ))
                      ) : (
                        <div className="text-slate-500 text-sm">Run your code to see output here...</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Controls */}
              <div className="border-t border-slate-200 p-4">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    className="flex items-center w-full justify-center"
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Reset Code
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Code Editor and Canvas (Side by Side) */}
        <div className="flex-1 flex overflow-hidden">
          {/* Code Editor */}
          <div className="w-1/2 border-r border-slate-200 bg-white">
            <div className="h-full p-4">
              <div className="h-full border border-slate-200 rounded-lg overflow-hidden">
                <CodeEditor
                  value={userCode}
                  onChange={onCodeChange}
                  language="javascript"
                  className="h-full"
                  errorLine={canvasError?.line}
                />
              </div>
            </div>
          </div>

          {/* Canvas/Output Area */}
          <div className="w-1/2 bg-slate-50 relative">
            <div className="h-full p-4">
              <div className={cn(
                "h-full border border-slate-200 rounded-lg bg-white overflow-hidden",
                courseType === 'printData' ? "flex" : "flex items-center justify-center"
              )}>
                {showAiChat ? (
                  <AiChat
                    tutorialId={tutorial.id}
                    courseId={tutorial.courseId}
                    code={userCode}
                    onClose={() => setShowAiChat(false)}
                    isVisible={showAiChat}
                    canvasError={canvasError}
                  />
                ) : (
                  <>
                    {courseType === 'canvas' && (
                      <DrawingCanvas 
                        code={userCode} 
                        onOutput={setOutput}
                        onError={handleCanvasError}
                      />
                    )}
                    {courseType === 'printData' && (
                      <div className="w-full h-full">
                        <PrintDataDisplay 
                          code={userCode} 
                          onOutput={setOutput}
                          onError={handleCanvasError}
                        />
                      </div>
                    )}
                    {courseType === 'iframe' && (
                      <IframeDisplay 
                        code={userCode} 
                        onOutput={setOutput}
                        onError={handleCanvasError}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Help Modal */}
      <HelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        currentTutorial={tutorial}
      />
    </div>
  );
}