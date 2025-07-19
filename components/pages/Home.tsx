"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTutorial } from "@/hooks/use-course-tutorial";
import TutorialSidebar from "@/components/tutorial-sidebar";
import TutorialContent from "@/components/tutorial-content";
import ApiDocumentation from "@/components/api-documentation";
import GithubIcon from "@/components/GithubIcon";
import ProfileAvatar from "@/components/ProfileAvatar";
import { useKeyboard } from "@/components/KeyboardProvider";
import { Code, Star, Book } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import Analytics from "@/components/Analytics";
import {
  getUserCode,
  setUserCode as setUserCodeInStorage,
  getCompletedCourses,
  setCompletedCourses as setCompletedCoursesInStorage,
  getProfileItem,
  setTutorialCompleted,
  getTutorialCodesForCourse
} from "@/lib/profile-storage";
import {
  getCoursesForLocale,
  getTutorialsForCourse,
  transformTutorial,
  transformTutorials,
  LocalizedTutorial
} from "@/lib/dataUtils";

interface Course {
  id: string;
  title: string;
  description: string;
  type: string;
  order: number;
  requiredCourse: string | null;
}

export default function Home() {
  const router = useRouter();
  const keyboard = useKeyboard();

  const courses = useMemo(() => getCoursesForLocale("en"), []);

  // Determine which course to display - defaults to JavaScript Basics (course ID "basics")
  const [currentCourseId, setCurrentCourseId] = useState<string>("basics");
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);

  // Check for last visited course on component mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const lastCourseId = getProfileItem("lastCourseId");

    if (!lastCourseId && courses.length > 0) {
      // No course selected, redirect to course selection
      router.push("/courses");
      return;
    }

    if (lastCourseId && courses.length > 0) {
      // Verify the course still exists
      const courseExists = courses.some((course) => course.id === lastCourseId);
      if (courseExists && lastCourseId !== "basics") {
        // Redirect to the last course if it's not the Basics course (which is already on home)
        router.push(`/course/${lastCourseId}`);
        return;
      }
      // Set current course if it's the Basics course
      setCurrentCourseId(lastCourseId);
    }

    // If the Basics course (id="basics") is selected, stay on home page
  }, [courses, router]);

  // Update current course when courses are loaded
  useEffect(() => {
    if (courses.length > 0) {
      const course = courses.find((c) => c.id === currentCourseId);
      setCurrentCourse(course || null);
    }
  }, [courses, currentCourseId]);

  const tutorials = useMemo(
    () => getTutorialsForCourse(currentCourseId),
    [currentCourseId]
  );

  // Get tutorials for the current course

  const { userCode, setUserCode, sidebarCollapsed, setSidebarCollapsed } =
    useTutorial();

  // Local state for course-specific progress (similar to course.tsx)
  const getCompletedTutorialsFromStorage = (): number[] => {
    if (typeof window === "undefined") {
      return [];
    }

    const courseTutorials = getTutorialCodesForCourse(currentCourseId);

    return courseTutorials
      .filter((tutorial) => !!tutorial.completed)
      .map((tutorial) => tutorial.tutorialId);
  };

  const getCurrentTutorialFromStorage = (): number => {
    if (typeof window === "undefined") {
      return 1;
    }

    const tutorials = getTutorialCodesForCourse(currentCourseId);
    let mostRecentTutorialIdx = 0;

    tutorials.forEach((tutorial, idx) => {
      if (
        tutorial.lastAccessed > tutorials[mostRecentTutorialIdx].lastAccessed
      ) {
        mostRecentTutorialIdx = idx;
      }
    });

    return mostRecentTutorialIdx + 1;
  };

  const getHighestTutorialReached = (): number => {
    if (typeof window === "undefined") {
      return 1;
    }

    const courseTutorials = getTutorialCodesForCourse(currentCourseId);

    return courseTutorials.length || 1;
  };

  const [completedTutorials, setCompletedTutorials] = useState<number[]>([]);
  const [currentTutorialOrder, setCurrentTutorialOrder] = useState<number>(1);
  const [highestTutorialReached, setHighestTutorialReached] =
    useState<number>(1);
  const [hasRestoredFromStorage, setHasRestoredFromStorage] = useState(false);
  const [showReferenceDialog, setShowReferenceDialog] = useState(false);

  // Reset state when course changes
  useEffect(() => {
    setHasRestoredFromStorage(false);
    setCompletedTutorials([]);
    setCurrentTutorialOrder(1);
    setHighestTutorialReached(1);
  }, [currentCourseId]);

  // Initialize state from profile storage after component mounts
  useEffect(() => {
    if (tutorials.length > 0 && !hasRestoredFromStorage) {
      const restoredCompleted = getCompletedTutorialsFromStorage();
      const restoredCurrent = getCurrentTutorialFromStorage();
      const restoredHighest = getHighestTutorialReached();

      console.log("restoredCompleted", structuredClone(restoredCompleted));
      console.log("tutorials", structuredClone(tutorials));
      console.log("restoredHighest", restoredHighest);

      // Only use the actual completed tutorials, don't auto-complete based on highest reached
      setCompletedTutorials(restoredCompleted);
      setCurrentTutorialOrder(restoredCurrent);
      setHighestTutorialReached(restoredHighest);
      setHasRestoredFromStorage(true);
    }
  }, [tutorials.length, hasRestoredFromStorage, currentCourseId]);

  // Progress is now automatically saved through the course progress system
  // when tutorials are completed or accessed via setTutorialCompleted and setUserCode

  // Tutorial completion logic
  const markTutorialComplete = (tutorialOrder: number) => {
    const tutorial = tutorials.find((t) => t.order === tutorialOrder);
    if (!tutorial) return;

    // Mark tutorial as completed in the course progress system
    setTutorialCompleted(tutorial.id, true, currentCourseId);

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
      if (!completedCourses.includes(currentCourseId)) {
        setCompletedCoursesInStorage([...completedCourses, currentCourseId]);
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

    // Make sure to persist the completed status
    const tutorialCode = getTutorialCodesForCourse(currentCourseId).filter(
      (tutorialCode) => tutorialCode.tutorialId === tutorial.id
    )[0];

    // Track that this tutorial was accessed
    setTutorialCompleted(
      tutorial.id,
      tutorialCode ? tutorialCode.completed : false,
      currentCourseId
    );
  };

  // Check if tutorial is unlocked
  const isTutorialUnlocked = (tutorial: LocalizedTutorial): boolean => {
    if (tutorial.order === 1) return true;
    // Allow access to any tutorial up to the highest ever reached
    if (tutorial.order <= highestTutorialReached) {
      return true;
    }
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
      setUserCodeInStorage(currentTutorial.id, userCode, "basics");
    }
  }, [currentTutorial, userCode]);

  const progressPercentage = useMemo(
    () =>
      tutorials.length > 0
        ? (completedTutorials.length / tutorials.length) * 100
        : 0,
    [tutorials.length, completedTutorials.length]
  );

  if (!hasRestoredFromStorage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
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
          tutorials={transformTutorials(
            tutorials.sort((a, b) => a.order - b.order),
            (t) => ({ isLocked: !isTutorialUnlocked(t) })
          )}
          currentTutorial={
            currentTutorial
              ? transformTutorial(currentTutorial, { isLocked: false })
              : null
          }
          completedTutorials={completedTutorials}
          onTutorialSelect={selectTutorial}
          collapsed={sidebarCollapsed}
          onToggleCollapsed={() => setSidebarCollapsed(!sidebarCollapsed)}
          course={
            currentCourse
              ? {
                  id: currentCourse.id,
                  title: currentCourse.title,
                  description: currentCourse.description,
                  type: currentCourse.type
                }
              : {
                  id: "basics",
                  title: "JavaScript Basics",
                  description: "Learn the fundamentals",
                  type: "printData"
                }
          }
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
                courseType={currentCourse?.type || "canvas"}
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
                    Choose a tutorial from the sidebar to begin your JavaScript
                    adventure.
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
              <ApiDocumentation courseType={currentCourse?.type || "canvas"} />
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Analytics />
    </div>
  );
}
