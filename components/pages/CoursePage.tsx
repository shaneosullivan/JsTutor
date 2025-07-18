"use client";

// Removed useQuery import - now using local utility functions
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
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
  getCompletedTutorials,
  setCompletedTutorials as setCompletedTutorialsInStorage,
  getCurrentTutorial,
  setCurrentTutorial as setCurrentTutorialInStorage,
  getUserCode,
  setUserCode as setUserCodeInStorage,
  getCompletedCourses,
  setCompletedCourses as setCompletedCoursesInStorage,
  getProfileItem,
  setProfileItem
} from "@/lib/profile-storage";
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

// Using LocalizedTutorial from dataUtils instead of local interface

interface CoursePageProps {
  courseId: string;
}

export default function CoursePage({ courseId }: CoursePageProps) {
  const courseIdNum = parseInt(courseId);
  const router = useRouter();
  const keyboard = useKeyboard();

  // Local storage hooks for course-specific progress
  const getCompletedTutorialsFromStorage = (): number[] => {
    if (typeof window === "undefined") return [];
    return getCompletedTutorials(courseIdNum);
  };

  const getCurrentTutorialFromStorage = (): number => {
    if (typeof window === "undefined") return 1;
    return getCurrentTutorial(courseIdNum) || 1;
  };

  const getHighestTutorialReached = (): number => {
    if (typeof window === "undefined") return 1;
    const saved = getProfileItem(`highestTutorial_course_${courseIdNum}`);
    return saved ? parseInt(saved) : 1;
  };

  const [completedTutorials, setCompletedTutorials] = useState<number[]>([]);
  const [currentTutorialOrder, setCurrentTutorialOrder] = useState<number>(1);
  const [highestTutorialReached, setHighestTutorialReached] =
    useState<number>(1);
  const [hasRestoredFromStorage, setHasRestoredFromStorage] = useState(false);
  const [showReferenceDialog, setShowReferenceDialog] = useState(false);

  // Memoized course data from local utils
  const courses = useMemo(() => getCoursesForLocale("en"), []);
  const course = useMemo(
    () => courses.find((c) => c.id === courseIdNum) || null,
    [courses, courseIdNum]
  );
  const tutorials = useMemo(
    () => getTutorialsForCourse(courseIdNum || 0),
    [courseIdNum]
  );

  // Loading states no longer needed since we use local utils

  // Course progress is computed from tutorial data, no sync needed

  // Initialize state from profile storage after component mounts
  useEffect(() => {
    if (tutorials.length > 0 && !hasRestoredFromStorage) {
      const restoredCompleted = getCompletedTutorialsFromStorage();
      const restoredCurrent = getCurrentTutorialFromStorage();
      const restoredHighest = getHighestTutorialReached();

      // Mark all tutorials below the highest reached as completed
      const tutorialsToComplete = tutorials
        .filter((t) => t.order < restoredHighest)
        .map((t) => t.id);

      const allCompleted = Array.from(
        new Set([...restoredCompleted, ...tutorialsToComplete])
      );

      setCompletedTutorials(allCompleted);
      setCurrentTutorialOrder(restoredCurrent);
      setHighestTutorialReached(restoredHighest);
      setHasRestoredFromStorage(true);
    }
  }, [tutorials.length, hasRestoredFromStorage, courseIdNum]);

  const { userCode, setUserCode, sidebarCollapsed, setSidebarCollapsed } =
    useTutorial();

  // Save progress to profile storage
  useEffect(() => {
    if (typeof window !== "undefined" && hasRestoredFromStorage) {
      setCompletedTutorialsInStorage(courseIdNum, completedTutorials);
    }
  }, [completedTutorials, courseIdNum, hasRestoredFromStorage]);

  useEffect(() => {
    if (typeof window !== "undefined" && hasRestoredFromStorage) {
      setCurrentTutorialInStorage(courseIdNum, currentTutorialOrder);
      // Update highest tutorial reached if current is higher
      if (currentTutorialOrder > highestTutorialReached) {
        setHighestTutorialReached(currentTutorialOrder);
      }
    }
  }, [
    currentTutorialOrder,
    courseIdNum,
    hasRestoredFromStorage,
    highestTutorialReached
  ]);

  // Save highest tutorial reached to profile storage
  useEffect(() => {
    if (typeof window !== "undefined" && hasRestoredFromStorage) {
      setProfileItem(
        `highestTutorial_course_${courseIdNum}`,
        highestTutorialReached.toString()
      );
    }
  }, [highestTutorialReached, courseIdNum, hasRestoredFromStorage]);

  // Tutorial completion logic
  const markTutorialComplete = (tutorialOrder: number) => {
    const tutorial = tutorials.find((t) => t.order === tutorialOrder);
    if (!tutorial) return;

    if (!completedTutorials.includes(tutorial.id)) {
      setCompletedTutorials((prev) => [...prev, tutorial.id]);
    }

    // Check if this is the last tutorial in the course
    const isLastTutorial =
      tutorials.length > 0
        ? tutorialOrder === Math.max(...tutorials.map((t) => t.order))
        : false;
    if (isLastTutorial && typeof window !== "undefined") {
      // Mark course as completed
      const completedCourses = getCompletedCourses();
      if (!completedCourses.includes(courseIdNum)) {
        setCompletedCoursesInStorage([...completedCourses, courseIdNum]);
      }
    }
  };

  const goToNextTutorial = () => {
    const nextOrder = currentTutorialOrder + 1;
    const nextTutorial = tutorials.find((t) => t.order === nextOrder);
    if (nextTutorial) {
      setCurrentTutorialOrder(nextOrder);
    }
  };

  const selectTutorial = (tutorial: LocalizedTutorial) => {
    setCurrentTutorialOrder(tutorial.order);
  };

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

  const currentTutorial = useMemo(
    () => tutorials.find((t) => t.order === currentTutorialOrder),
    [tutorials, currentTutorialOrder]
  );

  const isCurrentCompleted = useMemo(
    () =>
      currentTutorial ? completedTutorials.includes(currentTutorial.id) : false,
    [currentTutorial, completedTutorials]
  );

  const hasNextTutorial = useMemo(
    () =>
      tutorials.length > 0
        ? currentTutorialOrder < Math.max(...tutorials.map((t) => t.order))
        : false,
    [tutorials, currentTutorialOrder]
  );

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
      setUserCodeInStorage(currentTutorial.id, userCode);
    }
  }, [currentTutorial, userCode]);

  const progressPercentage = useMemo(
    () =>
      tutorials.length > 0
        ? (completedTutorials.length / tutorials.length) * 100
        : 0,
    [tutorials.length, completedTutorials.length]
  );

  const sidebarTutorials = useMemo(
    () =>
      transformTutorials(
        tutorials.sort((a, b) => a.order - b.order),
        (t) => ({ isLocked: !isTutorialUnlocked(t) })
      ),
    [tutorials, completedTutorials, highestTutorialReached]
  );

  const sidebarCurrentTutorial = useMemo(
    () =>
      currentTutorial
        ? transformTutorial(currentTutorial, { isLocked: false })
        : null,
    [currentTutorial]
  );

  if (!hasRestoredFromStorage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

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
            <Link href="/courses">
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
      style={{ height: keyboard.visibleHeight }}
    >
      {/* Header */}
      <header
        className={`bg-white shadow-sm border-b border-slate-200 flex-shrink-0 keyboard-responsive-header keyboard-transition ${keyboard.isVisible ? "keyboard-hidden" : ""}`}
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
                onClick={() => router.push("/courses")}
                className="text-slate-600 hover:text-slate-800"
              >
                All Courses
              </Button>
            </div>

            <div className="flex items-center space-x-3">
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
