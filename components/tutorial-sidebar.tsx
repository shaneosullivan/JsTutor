"use client";

import { Check, Lock, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Tutorial } from "@shared/schema";

interface TutorialSidebarProps {
  tutorials: Tutorial[];
  currentTutorial: Tutorial | null;
  completedTutorials: number[];
  onTutorialSelect: (tutorial: Tutorial) => void;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
  course?: {
    id: string;
    title: string;
    description: string;
    type: string;
  };
}

export default function TutorialSidebar({
  tutorials,
  currentTutorial,
  completedTutorials,
  onTutorialSelect,
  collapsed = false,
  onToggleCollapsed,
  course
}: TutorialSidebarProps) {
  const isUnlocked = (tutorial: Tutorial) => {
    // Use the isLocked property passed from parent if available
    if ("isLocked" in tutorial && typeof tutorial.isLocked === "boolean") {
      return !tutorial.isLocked;
    }
    // Fallback to original logic for backward compatibility
    if (tutorial.order === 1) {
      return true;
    }
    const previousTutorial = tutorials.find(
      (t) => t.order === tutorial.order - 1
    );
    return previousTutorial
      ? completedTutorials.includes(previousTutorial.id)
      : false;
  };

  const getStatusIcon = (tutorial: Tutorial) => {
    if (completedTutorials.includes(tutorial.id)) {
      return (
        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
          <Check className="text-white" size={16} />
        </div>
      );
    }

    if (currentTutorial?.id === tutorial.id) {
      return (
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
          <span className="text-purple-600 font-bold text-sm">
            {tutorial.order}
          </span>
        </div>
      );
    }

    if (!isUnlocked(tutorial)) {
      return (
        <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center">
          <Lock className="text-slate-500" size={16} />
        </div>
      );
    }

    return (
      <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
        <span className="text-slate-600 font-bold text-sm">
          {tutorial.order}
        </span>
      </div>
    );
  };

  const getTutorialClassName = (tutorial: Tutorial) => {
    const baseClasses =
      "flex items-center w-full text-left transition-all duration-200 relative group";

    if (!isUnlocked(tutorial)) {
      return cn(baseClasses, "opacity-50 cursor-not-allowed");
    }

    if (currentTutorial?.id === tutorial.id) {
      return cn(
        baseClasses,
        "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
      );
    }

    if (completedTutorials.includes(tutorial.id)) {
      return cn(baseClasses, "hover:bg-green-50 text-green-700");
    }

    return cn(baseClasses, "hover:bg-purple-50 text-slate-700");
  };

  return (
    <div
      className={cn(
        "bg-white border-r border-slate-200 flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-80"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        {!collapsed && (
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              {course?.title || "Course"}
            </h2>
            {course?.description && (
              <p className="text-sm text-slate-600 mt-1">
                {course.description}
              </p>
            )}
          </div>
        )}
        {onToggleCollapsed && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapsed}
            className="p-1 h-8 w-8"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      {/* Tutorial List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {tutorials.map((tutorial) => (
            <button
              key={tutorial.id}
              onClick={() => isUnlocked(tutorial) && onTutorialSelect(tutorial)}
              className={cn(
                getTutorialClassName(tutorial),
                collapsed ? "p-3 justify-center" : "p-4 space-x-3"
              )}
              disabled={!isUnlocked(tutorial)}
            >
              {getStatusIcon(tutorial)}

              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm leading-tight">
                    {tutorial.title}
                  </h3>
                  <p className="text-xs opacity-75 mt-1 line-clamp-2">
                    {tutorial.description}
                  </p>
                </div>
              )}

              {/* Progress indicator for collapsed state */}
              {collapsed && completedTutorials.includes(tutorial.id) && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              )}

              {/* Current tutorial indicator for collapsed state */}
              {collapsed && currentTutorial?.id === tutorial.id && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full border-2 border-white" />
              )}
            </button>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-slate-200">
          <div className="text-center">
            <div className="text-sm text-slate-600 mb-1">Progress</div>
            <div className="text-2xl font-bold text-purple-600">
              {completedTutorials.length}/{tutorials.length}
            </div>
            <div className="text-xs text-slate-500">tutorials completed</div>
          </div>
        </div>
      )}
    </div>
  );
}
