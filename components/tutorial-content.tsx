"use client";

import { useState, useEffect } from "react";
import { ArrowRight, CircleHelp, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import CodeEditor from "@/components/code-editor";
import DrawingCanvas from "@/components/drawing-canvas";
import PrintDataDisplay from "@/components/print-data-display";
import IframeDisplay from "@/components/iframe-display";
import AiChat from "@/components/ai-chat";
import HelpModal from "@/components/help-modal";
import { useKeyboard } from "@/components/KeyboardProvider";
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
  onShowReference?: () => void;
}

export default function TutorialContent({
  tutorial,
  onComplete,
  isCompleted,
  onNext,
  hasNext,
  userCode,
  onCodeChange,
  courseType = "canvas",
  onShowReference,
}: TutorialContentProps) {
  const keyboard = useKeyboard();
  const [, setOutput] = useState<string[]>([]);
  const [showAiChat, setShowAiChat] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [canvasError, setCanvasError] = useState<{
    message: string;
    line?: number;
  } | null>(null);

  // Auto-show help dialog when tutorial changes
  useEffect(() => {
    setOutput([]);
    setCanvasError(null);
    setShowHelp(true); // Show help dialog when moving to a new tutorial
    setShowAiChat(false); // Reset AI chat visibility when tutorial changes
  }, [tutorial.id]);

  const handleComplete = () => {
    onComplete();
  };

  const handleCanvasError = (
    error: { message: string; line?: number } | null,
  ) => {
    setCanvasError(error);
  };

  const handleShowAiChat = () => {
    setShowAiChat(!showAiChat);
  };

  const handleReset = () => {
    onCodeChange(tutorial.starterCode || "");
    setOutput([]);
    setCanvasError(null);
  };

  let maxHeight = 0;
  if (keyboard.isVisible && typeof document !== "undefined") {
    maxHeight = document.querySelector("main")?.offsetHeight || 0;
  }

  return (
    <div className="h-full flex flex-col content-area">
      {/* Tutorial Header */}
      <div
        className={`border-b border-slate-200 bg-white px-6 py-4 keyboard-responsive-header keyboard-transition ${keyboard.isVisible ? "keyboard-hidden" : ""}`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {tutorial.title}
            </h1>
            <p className="text-slate-600 mt-1">{tutorial.description}</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleShowAiChat}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transition-all duration-200 hover:scale-105 shadow-lg"
              size="sm"
            >
              🤖 Help Me!
            </Button>

            {onShowReference && (
              <Button
                onClick={onShowReference}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white transition-all duration-200 hover:scale-105 shadow-lg"
                size="sm"
              >
                📚 Reference
              </Button>
            )}

            {isCompleted ? (
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-green-600 font-medium">Completed!</span>
                {hasNext && onNext && (
                  <Button
                    onClick={onNext}
                    className="ml-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                  >
                    Next Lesson <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            ) : (
              <Button
                onClick={handleComplete}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                Mark Complete
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Code Editor and Canvas (Side by Side) */}
        <div className="flex-1 flex overflow-hidden">
          {/* Code Editor */}
          <div className="w-1/2 border-r border-slate-200 bg-white editor-container relative">
            <div
              className={
                "h-full keyboard-transition " +
                (keyboard.isVisible ? "" : " p-4")
              }
            >
              <div className="h-full border border-slate-200 rounded-lg overflow-hidden keyboard-stable">
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
          <div className="w-1/2 bg-slate-50 relative editor-container">
            {/* Floating Action Buttons */}
            {!showAiChat && (
              <div
                className={
                  (keyboard.isVisible ? "top-2 left-2" : "top-6 left-6") +
                  " absolute z-20 flex flex-col gap-2"
                }
              >
                <Button
                  onClick={() => setShowHelp(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 border-0 p-2 h-8 w-8"
                  size="sm"
                  title="Get Help"
                >
                  <CircleHelp className="h-4 w-4" />
                </Button>

                <Button
                  onClick={handleReset}
                  className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 border-0 p-2 h-8 w-8"
                  size="sm"
                  title="Reset Code"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            )}

            <div
              className={
                "h-full keyboard-transition " +
                (keyboard.isVisible ? "" : " p-4")
              }
            >
              <div
                className={cn(
                  "h-full border border-slate-200 rounded-lg bg-white relative keyboard-stable",
                  courseType === "printData"
                    ? "flex flex-col"
                    : courseType === "iframe"
                      ? "flex flex-col"
                      : "flex items-center justify-center overflow-hidden",
                )}
              >
                {/* AI Chat - Always mounted but positioned absolutely */}
                <div
                  className={cn(
                    "absolute inset-0 z-10",
                    showAiChat ? "block" : "hidden",
                  )}
                  style={{ display: showAiChat ? "block" : "none" }}
                >
                  <AiChat
                    tutorialId={tutorial.id}
                    courseId={tutorial.courseId}
                    code={userCode}
                    onClose={() => setShowAiChat(false)}
                    isVisible={showAiChat}
                    canvasError={canvasError}
                  />
                </div>

                {/* Canvas/Tutorial Content - Always visible unless AI chat is shown */}
                <div
                  className={cn(
                    courseType === "iframe" ? "h-full" : "",
                    "relative z-0",
                  )}
                >
                  {courseType === "canvas" && (
                    <DrawingCanvas
                      code={userCode}
                      maxHeight={maxHeight}
                      onOutput={setOutput}
                      onError={handleCanvasError}
                    />
                  )}
                  {courseType === "printData" && (
                    <PrintDataDisplay
                      code={userCode}
                      onOutput={setOutput}
                      onError={handleCanvasError}
                    />
                  )}
                  {courseType === "iframe" && (
                    <IframeDisplay
                      code={userCode}
                      onOutput={setOutput}
                      onError={handleCanvasError}
                    />
                  )}
                </div>
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
