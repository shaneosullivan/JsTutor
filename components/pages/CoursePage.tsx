"use client";

import Link from "next/link";
import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { ArrowLeft, Book, Code, Star } from "lucide-react";
import TutorialContent from "@/components/tutorial-content";
import TutorialSidebar from "@/components/tutorial-sidebar";
import ApiDocumentation from "@/components/api-documentation";
import {
  setTutorialCompleted,
  setProfileItem,
  getUserCode,
  setUserCode as setUserCodeInStorage,
  getCurrentTutorial,
  setCurrentTutorial
} from "@/lib/profile-storage";
import { useActiveProfile } from "@/hooks/useActiveProfile";
import {
  getCoursesForLocale,
  getTutorialsForCourse,
  LocalizedTutorial,
  transformTutorial,
  transformTutorials
} from "@/lib/dataUtils";
import GithubIcon from "@/components/GithubIcon";
import ProfileAvatar from "@/components/ProfileAvatar";
import { useKeyboard } from "@/components/KeyboardProvider";
import { useTutorial } from "@/hooks/use-course-tutorial";
import Analytics from "@/components/Analytics";
import { useTable, useValues } from "tinybase/ui-react";
import { Inspector } from "tinybase/ui-react-inspector";
import type { TutorialCode } from "@/lib/types";

// Using LocalizedTutorial from dataUtils instead of local interface

interface CoursePageProps {
  courseId: string;
}

export default function CoursePage({ courseId }: CoursePageProps) {
  const router = useRouter();
  const keyboard = useKeyboard();
  const [showReferenceDialog, setShowReferenceDialog] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Get reactive data from TinyBase using hooks
  const tutorialCodeTable = useTable("tutorialCode");
  const values = useValues();

  // Get current profile reactively
  const activeProfile = useActiveProfile();

  // Track client-side mounting to prevent hydration mismatches
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Memoized course data from local utils
  const courses = useMemo(() => getCoursesForLocale("en"), []);
  const course = useMemo(
    () => courses.find((c) => c.id === courseId) || null,
    [courses, courseId]
  );
  const tutorials = useMemo(() => getTutorialsForCourse(courseId), [courseId]);

  const currentTutorialId = getCurrentTutorial(courseId);
  const currentTutorialOrder = useMemo(() => {
    if (!currentTutorialId) return 1;
    const tutorial = tutorials.find((t) => t.id === currentTutorialId);
    return tutorial ? tutorial.order : 1;
  }, [currentTutorialId, tutorials]);

  // Highest tutorial reached from profile settings using useValues
  const highestTutorialValue = values[
    `highestTutorial_course_${courseId}`
  ] as string;
  const highestTutorialReached =
    isClient && highestTutorialValue ? parseInt(highestTutorialValue) : 1;

  // Compute completed tutorials from TinyBase tutorial code data
  const completedTutorials = useMemo(() => {
    if (!isClient) {
      return [];
    } // Return empty array on server to prevent hydration mismatch

    const tutorialCodes = Object.values(
      tutorialCodeTable
    ) as unknown as TutorialCode[];
    return tutorialCodes
      .filter(
        (tc) =>
          tc &&
          tc.profileId === activeProfile.id &&
          tc.courseId === courseId &&
          tc.completed
      )
      .map((tc) => tc.tutorialId);
  }, [tutorialCodeTable, activeProfile.id, courseId, isClient]);

  const { userCode, setUserCode, sidebarCollapsed, setSidebarCollapsed } =
    useTutorial();

  // Tutorial completion logic using TinyBase
  const markTutorialComplete = useCallback(
    (tutorialOrder: number) => {
      const tutorial = tutorials.find((t) => t.order === tutorialOrder);
      if (!tutorial) {
        return;
      }

      // Mark tutorial as completed in TinyBase
      setTutorialCompleted(tutorial.id, true, courseId);

      // Update highest tutorial reached if current is higher
      if (tutorialOrder > highestTutorialReached) {
        setProfileItem(
          `highestTutorial_course_${courseId}`,
          tutorialOrder.toString()
        );
      }
    },
    [tutorials, courseId, highestTutorialReached, activeProfile.id]
  );

  const goToNextTutorial = useCallback(() => {
    const nextOrder = currentTutorialOrder + 1;
    const nextTutorial = tutorials.find((t) => t.order === nextOrder);
    if (nextTutorial) {
      setCurrentTutorial(courseId, nextTutorial.id);
      // The listener will update the state automatically
    }
  }, [currentTutorialOrder, tutorials, courseId]);

  const selectTutorial = useCallback(
    (tutorial: LocalizedTutorial) => {
      setProfileItem(
        `currentTutorial_course_${courseId}`,
        tutorial.order.toString()
      );
      // The listener will update the state automatically
    },
    [courseId]
  );

  // Check if tutorial is unlocked
  const isTutorialUnlocked = (tutorial: LocalizedTutorial): boolean => {
    // First tutorial in the course is always unlocked
    if (tutorial.order === 1) {
      return true;
    }

    // Allow access to any tutorial up to the highest ever reached
    if (tutorial.order <= highestTutorialReached) {
      return true;
    }

    // Check if previous tutorial is completed
    const prevTutorial = tutorials.find((t) => t.order === tutorial.order - 1);
    return prevTutorial ? completedTutorials.includes(prevTutorial.id) : false;
  };

  const currentTutorial = useMemo(() => {
    if (!isClient) {
      return tutorials[0];
    } // Return first tutorial on server to prevent hydration mismatch
    return tutorials.find((t) => t.order === currentTutorialOrder);
  }, [tutorials, currentTutorialOrder, isClient]);

  const isCurrentCompleted = useMemo(() => {
    if (!isClient || !currentTutorial) {
      return false;
    } // Return false on server to prevent hydration mismatch
    return completedTutorials.includes(currentTutorial.id);
  }, [currentTutorial, completedTutorials, isClient]);

  const hasNextTutorial = useMemo(() => {
    if (!isClient || tutorials.length === 0) {
      return false;
    } // Return false on server to prevent hydration mismatch
    return currentTutorialOrder < Math.max(...tutorials.map((t) => t.order));
  }, [tutorials, currentTutorialOrder, isClient]);

  // Load starter code when tutorial changes
  useEffect(() => {
    if (currentTutorial && currentTutorial.starterCode) {
      if (typeof window !== "undefined") {
        // Check if we have saved user code for this tutorial
        const savedCode = getUserCode(currentTutorial.id);
        if (savedCode) {
          setUserCode(savedCode);
        } else {
          // Load the starter code
          setUserCode(currentTutorial.starterCode);
        }
      } else {
        // Load the starter code on server
        setUserCode(currentTutorial.starterCode);
      }
    }
  }, [currentTutorial, setUserCode]);

  // Save user code when it changes
  useEffect(() => {
    if (currentTutorial && userCode && typeof window !== "undefined") {
      setUserCodeInStorage(currentTutorial.id, userCode, courseId);
    }
  }, [currentTutorial, userCode, courseId]);

  const progressPercentage = useMemo(() => {
    if (!isClient || tutorials.length === 0) {
      return 0;
    } // Return 0 on server to prevent hydration mismatch
    return (completedTutorials.length / tutorials.length) * 100;
  }, [tutorials.length, completedTutorials.length, isClient]);

  const sidebarTutorials = useMemo(() => {
    if (!isClient) {
      // Return tutorials with all locked on server to prevent hydration mismatch
      return transformTutorials(
        tutorials.sort((a, b) => a.order - b.order),
        () => ({ isLocked: true })
      );
    }
    return transformTutorials(
      tutorials.sort((a, b) => a.order - b.order),
      (t) => ({ isLocked: !isTutorialUnlocked(t) })
    );
  }, [tutorials, completedTutorials, highestTutorialReached, isClient]);

  const sidebarCurrentTutorial = useMemo(
    () =>
      currentTutorial
        ? transformTutorial(currentTutorial, { isLocked: false })
        : null,
    [currentTutorial]
  );

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-center text-red-600">
              Course Not Found
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              The course you're looking for doesn't exist.
            </p>
            <Link href="/">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Courses
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div
      className="bg-slate-50 flex flex-col keyboard-stable"
      style={{ height: isClient ? keyboard.visibleHeight : "100vh" }}
    >
      {/* Header */}
      <header
        className={`bg-white shadow-sm border-b border-slate-200 flex-shrink-0 keyboard-responsive-header keyboard-transition ${isClient && keyboard.isVisible ? "keyboard-hidden" : ""}`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <img
                  src="/logo.svg"
                  alt="JavaScript Adventure Logo"
                  className="w-8 h-8 rounded-lg"
                />
                <h1 className="text-xl font-bold text-slate-800">
                  JavaScript Adventure
                </h1>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/")}
                className="text-slate-600 hover:text-slate-800"
              >
                All Courses
              </Button>
            </div>

            <div className="flex items-center space-x-3">
              {process.env.NODE_ENV === "development" && <Inspector />}

              <div className="flex items-center space-x-1">
                <span className="text-sm text-slate-600">Progress:</span>
                <Progress
                  value={progressPercentage}
                  className="w-24 bg-slate-200 [&>div]:bg-purple-600"
                />
                <span className="text-sm font-medium text-slate-700">
                  {completedTutorials.length}/{tutorials.length}
                </span>
              </div>

              <div className="flex items-center space-x-1">
                <Star className="text-yellow-500 fill-current" size={16} />
                <span className="text-sm font-medium text-slate-700">
                  {completedTutorials.length * 10}
                </span>
              </div>

              <a
                href="https://github.com/shaneosullivan/JsTutor"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 text-slate-600 hover:text-slate-800 transition-colors"
                title="View on GitHub"
              >
                <GithubIcon size={20} />
              </a>

              <ProfileAvatar size={32} />
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <TutorialSidebar
          tutorials={sidebarTutorials}
          currentTutorial={sidebarCurrentTutorial}
          completedTutorials={completedTutorials}
          onTutorialSelect={selectTutorial}
          collapsed={sidebarCollapsed}
          onToggleCollapsed={() => setSidebarCollapsed(!sidebarCollapsed)}
          course={course}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col">
            {currentTutorial ? (
              <TutorialContent
                tutorial={transformTutorial(currentTutorial, {
                  isLocked: false
                })}
                onComplete={() => markTutorialComplete(currentTutorialOrder)}
                isCompleted={isCurrentCompleted}
                onNext={hasNextTutorial ? goToNextTutorial : undefined}
                hasNext={hasNextTutorial}
                userCode={userCode}
                onCodeChange={setUserCode}
                courseType={course?.type || "canvas"}
                onShowReference={() => setShowReferenceDialog(true)}
                sidebarCollapsed={sidebarCollapsed}
              />
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <Code className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                  <h3 className="text-lg font-medium text-slate-800 mb-2">
                    Select a tutorial to get started!
                  </h3>
                  <p className="text-slate-600">
                    Choose a tutorial from the sidebar to begin this course.
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Reference Dialog */}
        <Dialog
          open={showReferenceDialog}
          onOpenChange={setShowReferenceDialog}
        >
          <DialogContent className="max-w-6xl h-[90vh] bg-white flex flex-col">
            <DialogHeader className="bg-white border-b pb-4 flex-shrink-0">
              <DialogTitle className="flex items-center gap-2">
                <Book className="w-5 h-5" />
                Reference Documentation
              </DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-hidden bg-white">
              <ApiDocumentation courseType={course?.type || "canvas"} />
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Analytics />
    </div>
  );
}
