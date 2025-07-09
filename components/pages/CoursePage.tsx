"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Book, CheckCircle, Lock, Code, Star } from "lucide-react";
import TutorialContent from "@/components/tutorial-content";
import TutorialSidebar from "@/components/tutorial-sidebar";
import ApiDocumentation from "@/components/api-documentation";
import { useTutorial } from "@/hooks/use-course-tutorial";
import Analytics from "@/components/Analytics";

interface Course {
  id: number;
  title: string;
  description: string;
  type: string;
  order: number;
  requiredCourse: number | null;
}

interface Tutorial {
  id: number;
  courseId: number;
  title: string;
  description: string;
  content: string;
  starterCode: string;
  expectedOutput?: string;
  order: number;
  isLocked: boolean;
}

interface CoursePageProps {
  courseId: string;
}

export default function CoursePage({ courseId }: CoursePageProps) {
  const courseIdNum = parseInt(courseId);
  const router = useRouter();

  // Local storage hooks for course-specific progress
  const getCompletedTutorials = (): number[] => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem(
      `completedTutorials_course_${courseIdNum}`,
    );
    return saved ? JSON.parse(saved) : [];
  };

  const getCurrentTutorial = (): number => {
    if (typeof window === "undefined") return 1;
    const saved = localStorage.getItem(`currentTutorial_course_${courseIdNum}`);
    return saved ? parseInt(saved) : 1;
  };

  const getHighestTutorialReached = (): number => {
    if (typeof window === "undefined") return 1;
    const saved = localStorage.getItem(`highestTutorial_course_${courseIdNum}`);
    return saved ? parseInt(saved) : 1;
  };

  const [completedTutorials, setCompletedTutorials] = useState<number[]>([]);
  const [currentTutorialOrder, setCurrentTutorialOrder] = useState<number>(1);
  const [highestTutorialReached, setHighestTutorialReached] =
    useState<number>(1);
  const [hasRestoredFromStorage, setHasRestoredFromStorage] = useState(false);

  // Query for course data
  const { data: course, isLoading: courseLoading } = useQuery<Course>({
    queryKey: [`/api/courses/${courseIdNum}`],
    enabled: !!courseIdNum,
  });

  // Query for course tutorials
  const { data: tutorials = [], isLoading: tutorialsLoading } = useQuery<
    Tutorial[]
  >({
    queryKey: [`/api/courses/${courseIdNum}/tutorials`],
    enabled: !!courseIdNum,
  });

  // Initialize state from localStorage after component mounts
  useEffect(() => {
    if (tutorials.length > 0 && !hasRestoredFromStorage) {
      const restoredCompleted = getCompletedTutorials();
      const restoredCurrent = getCurrentTutorial();
      const restoredHighest = getHighestTutorialReached();

      // Mark all tutorials below the highest reached as completed
      const tutorialsToComplete = tutorials
        .filter((t) => t.order < restoredHighest)
        .map((t) => t.id);

      const allCompleted = Array.from(
        new Set([...restoredCompleted, ...tutorialsToComplete]),
      );

      setCompletedTutorials(allCompleted);
      setCurrentTutorialOrder(restoredCurrent);
      setHighestTutorialReached(restoredHighest);
      setHasRestoredFromStorage(true);
    }
  }, [tutorials.length, hasRestoredFromStorage, courseIdNum]);

  const { userCode, setUserCode, sidebarCollapsed, setSidebarCollapsed } =
    useTutorial();

  const isLoading = courseLoading || tutorialsLoading;

  // Save progress to localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && hasRestoredFromStorage) {
      localStorage.setItem(
        `completedTutorials_course_${courseIdNum}`,
        JSON.stringify(completedTutorials),
      );
    }
  }, [completedTutorials, courseIdNum, hasRestoredFromStorage]);

  useEffect(() => {
    if (typeof window !== "undefined" && hasRestoredFromStorage) {
      localStorage.setItem(
        `currentTutorial_course_${courseIdNum}`,
        currentTutorialOrder.toString(),
      );
      // Update highest tutorial reached if current is higher
      if (currentTutorialOrder > highestTutorialReached) {
        setHighestTutorialReached(currentTutorialOrder);
      }
    }
  }, [
    currentTutorialOrder,
    courseIdNum,
    hasRestoredFromStorage,
    highestTutorialReached,
  ]);

  // Save highest tutorial reached to localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && hasRestoredFromStorage) {
      localStorage.setItem(
        `highestTutorial_course_${courseIdNum}`,
        highestTutorialReached.toString(),
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
      const completedCourses = JSON.parse(
        localStorage.getItem("completedCourses") || "[]",
      );
      if (!completedCourses.includes(courseIdNum)) {
        localStorage.setItem(
          "completedCourses",
          JSON.stringify([...completedCourses, courseIdNum]),
        );
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

  const selectTutorial = (tutorial: Tutorial) => {
    setCurrentTutorialOrder(tutorial.order);
  };

  // Check if tutorial is unlocked
  const isTutorialUnlocked = (tutorial: Tutorial): boolean => {
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

  const currentTutorial = tutorials.find(
    (t) => t.order === currentTutorialOrder,
  );
  const isCurrentCompleted = currentTutorial
    ? completedTutorials.includes(currentTutorial.id)
    : false;
  const hasNextTutorial =
    tutorials.length > 0
      ? currentTutorialOrder < Math.max(...tutorials.map((t) => t.order))
      : false;

  // Load starter code when tutorial changes
  useEffect(() => {
    if (currentTutorial && currentTutorial.starterCode) {
      if (typeof window !== "undefined") {
        // Check if we have saved user code for this tutorial
        const savedCode = localStorage.getItem(
          `userCode_tutorial_${currentTutorial.id}`,
        );
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
      localStorage.setItem(`userCode_tutorial_${currentTutorial.id}`, userCode);
    }
  }, [currentTutorial, userCode]);

  const progressPercentage =
    tutorials.length > 0
      ? (completedTutorials.length / tutorials.length) * 100
      : 0;

  if (isLoading || !hasRestoredFromStorage) {
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
    <div className="h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <TutorialSidebar
          tutorials={tutorials
            .sort((a, b) => a.order - b.order)
            .map((t) => ({
              ...t,
              isLocked: !isTutorialUnlocked(t),
            }))}
          currentTutorial={currentTutorial || null}
          completedTutorials={completedTutorials}
          onTutorialSelect={selectTutorial}
          collapsed={sidebarCollapsed}
          onToggleCollapsed={() => setSidebarCollapsed(!sidebarCollapsed)}
          course={course}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          <Tabs defaultValue="tutorial" className="h-full flex flex-col">
            <div className="border-b border-slate-200 bg-white px-6 py-3">
              <TabsList className="grid w-full grid-cols-2 max-w-md bg-slate-100 border border-slate-200">
                <TabsTrigger
                  value="tutorial"
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-slate-600 hover:text-slate-900"
                >
                  <Code className="w-4 h-4" />
                  Tutorial
                </TabsTrigger>
                <TabsTrigger
                  value="reference"
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-slate-600 hover:text-slate-900"
                >
                  <Book className="w-4 h-4" />
                  Reference
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent
              value="tutorial"
              className="flex-1 overflow-hidden mt-0"
            >
              {currentTutorial ? (
                <TutorialContent
                  tutorial={currentTutorial}
                  onComplete={() => markTutorialComplete(currentTutorialOrder)}
                  isCompleted={isCurrentCompleted}
                  onNext={hasNextTutorial ? goToNextTutorial : undefined}
                  hasNext={hasNextTutorial}
                  userCode={userCode}
                  onCodeChange={setUserCode}
                  courseType={course.type}
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
            </TabsContent>

            <TabsContent
              value="reference"
              className="flex-1 overflow-hidden mt-0"
            >
              <ApiDocumentation />
            </TabsContent>
          </Tabs>
        </main>
      </div>
      <Analytics />
    </div>
  );
}
