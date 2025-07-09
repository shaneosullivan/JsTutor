"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useTutorial } from "@/hooks/use-course-tutorial";
import TutorialSidebar from "@/components/tutorial-sidebar";
import TutorialContent from "@/components/tutorial-content";
import ApiDocumentation from "@/components/api-documentation";
import GithubIcon from "@/components/GithubIcon";
import { Code, Star, Book } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Analytics from "@/components/Analytics";

interface Course {
  id: number;
  title: string;
  description: string;
  type: string;
  order: number;
  requiredCourse: number | null;
}

export default function Home() {
  const router = useRouter();
  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
  });

  // Check for last visited course on component mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const lastCourseId = localStorage.getItem("lastCourseId");

    if (!lastCourseId && courses.length > 0) {
      // No course selected, redirect to course selection
      router.push("/courses");
      return;
    }

    if (lastCourseId && courses.length > 0) {
      // Verify the course still exists
      const courseExists = courses.some(
        (course) => course.id === parseInt(lastCourseId),
      );
      if (courseExists && parseInt(lastCourseId) !== 1) {
        // Redirect to the last course if it's not the Basics course (which is already on home)
        router.push(`/course/${lastCourseId}`);
        return;
      }
    }

    // If the Basics course (id=1) is selected, stay on home page
  }, [courses, router]);

  // Get tutorials for the Basics course (course ID 1)
  const { data: tutorials = [], isLoading: tutorialsLoading } = useQuery<any[]>(
    {
      queryKey: [`/api/courses/1/tutorials`],
    },
  );

  const { userCode, setUserCode, sidebarCollapsed, setSidebarCollapsed } =
    useTutorial();

  // Local state for course-specific progress (similar to course.tsx)
  const getCompletedTutorials = (): number[] => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem(`completedTutorials_course_1`);
    return saved ? JSON.parse(saved) : [];
  };

  const getCurrentTutorial = (): number => {
    if (typeof window === "undefined") return 1;
    const saved = localStorage.getItem(`currentTutorial_course_1`);
    return saved ? parseInt(saved) : 1;
  };

  const getHighestTutorialReached = (): number => {
    if (typeof window === "undefined") return 1;
    const saved = localStorage.getItem(`highestTutorial_course_1`);
    return saved ? parseInt(saved) : 1;
  };

  const [completedTutorials, setCompletedTutorials] = useState<number[]>([]);
  const [currentTutorialOrder, setCurrentTutorialOrder] = useState<number>(1);
  const [highestTutorialReached, setHighestTutorialReached] =
    useState<number>(1);
  const [hasRestoredFromStorage, setHasRestoredFromStorage] = useState(false);

  // Initialize state from localStorage after component mounts
  useEffect(() => {
    if (tutorials.length > 0 && !hasRestoredFromStorage) {
      const restoredCompleted = getCompletedTutorials();
      const restoredCurrent = getCurrentTutorial();
      const restoredHighest = getHighestTutorialReached();

      // Mark all tutorials below the highest reached as completed
      const tutorialsToComplete = tutorials
        .filter((t: any) => t.order < restoredHighest)
        .map((t: any) => t.id);

      const allCompleted = Array.from(
        new Set([...restoredCompleted, ...tutorialsToComplete]),
      );

      setCompletedTutorials(allCompleted);
      setCurrentTutorialOrder(restoredCurrent);
      setHighestTutorialReached(restoredHighest);
      setHasRestoredFromStorage(true);
    }
  }, [tutorials.length, hasRestoredFromStorage]);

  const isLoading = tutorialsLoading;

  // Save progress to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        `completedTutorials_course_1`,
        JSON.stringify(completedTutorials),
      );
    }
  }, [completedTutorials]);

  useEffect(() => {
    if (typeof window !== "undefined" && hasRestoredFromStorage) {
      localStorage.setItem(
        `currentTutorial_course_1`,
        currentTutorialOrder.toString(),
      );
      // Update highest tutorial reached if current is higher
      if (currentTutorialOrder > highestTutorialReached) {
        setHighestTutorialReached(currentTutorialOrder);
      }
    }
  }, [currentTutorialOrder, hasRestoredFromStorage, highestTutorialReached]);

  // Save highest tutorial reached to localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && hasRestoredFromStorage) {
      localStorage.setItem(
        `highestTutorial_course_1`,
        highestTutorialReached.toString(),
      );
    }
  }, [highestTutorialReached, hasRestoredFromStorage]);

  // Tutorial completion logic
  const markTutorialComplete = (tutorialOrder: number) => {
    const tutorial = tutorials.find((t: any) => t.order === tutorialOrder);
    if (!tutorial) return;

    if (!completedTutorials.includes(tutorial.id)) {
      setCompletedTutorials((prev) => [...prev, tutorial.id]);
    }

    // Check if this is the last tutorial in the course
    const isLastTutorial =
      tutorials.length > 0
        ? tutorialOrder === Math.max(...tutorials.map((t: any) => t.order))
        : false;
    if (isLastTutorial && typeof window !== "undefined") {
      // Mark course as completed
      const completedCourses = JSON.parse(
        localStorage.getItem("completedCourses") || "[]",
      );
      if (!completedCourses.includes(1)) {
        localStorage.setItem(
          "completedCourses",
          JSON.stringify([...completedCourses, 1]),
        );
      }
    }
  };

  const goToNextTutorial = () => {
    const nextOrder = currentTutorialOrder + 1;
    const nextTutorial = tutorials.find((t: any) => t.order === nextOrder);
    if (nextTutorial) {
      setCurrentTutorialOrder(nextOrder);
    }
  };

  const selectTutorial = (tutorial: any) => {
    setCurrentTutorialOrder(tutorial.order);
  };

  // Check if tutorial is unlocked
  const isTutorialUnlocked = (tutorial: any): boolean => {
    if (tutorial.order === 1) return true;
    // Allow access to any tutorial up to the highest ever reached
    if (tutorial.order <= highestTutorialReached) {
      return true;
    }
    const prevTutorial = tutorials.find(
      (t: any) => t.order === tutorial.order - 1,
    );
    return prevTutorial ? completedTutorials.includes(prevTutorial.id) : false;
  };

  const currentTutorial = tutorials.find(
    (t: any) => t.order === currentTutorialOrder,
  );
  const isCurrentCompleted = currentTutorial
    ? completedTutorials.includes(currentTutorial.id)
    : false;
  const hasNextTutorial =
    tutorials.length > 0
      ? currentTutorialOrder < Math.max(...tutorials.map((t: any) => t.order))
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

              <a
                href="https://github.com/shaneosullivan/JsTutor"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 text-slate-600 hover:text-slate-800 transition-colors"
                title="View on GitHub"
              >
                <GithubIcon size={20} />
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <TutorialSidebar
          tutorials={tutorials
            .sort((a: any, b: any) => a.order - b.order)
            .map((t: any) => ({
              id: t.id,
              courseId: t.courseId,
              title: t.title,
              description: t.description,
              content: t.content,
              starterCode: t.starterCode,
              expectedOutput: t.expectedOutput || "",
              order: t.order,
              isLocked: !isTutorialUnlocked(t),
            }))}
          currentTutorial={
            currentTutorial
              ? {
                  id: currentTutorial.id,
                  courseId: currentTutorial.courseId,
                  title: currentTutorial.title,
                  description: currentTutorial.description,
                  content: currentTutorial.content,
                  starterCode: currentTutorial.starterCode,
                  expectedOutput: currentTutorial.expectedOutput || "",
                  order: currentTutorial.order,
                  isLocked: false,
                }
              : null
          }
          completedTutorials={completedTutorials}
          onTutorialSelect={selectTutorial}
          collapsed={sidebarCollapsed}
          onToggleCollapsed={() => setSidebarCollapsed(!sidebarCollapsed)}
          course={{
            id: 1,
            title: "JavaScript Basics",
            description: "Learn the fundamentals",
            type: "printData",
          }}
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
                  tutorial={{
                    id: currentTutorial.id,
                    courseId: currentTutorial.courseId,
                    title: currentTutorial.title,
                    description: currentTutorial.description,
                    content: currentTutorial.content,
                    starterCode: currentTutorial.starterCode,
                    expectedOutput: currentTutorial.expectedOutput || "",
                    order: currentTutorial.order,
                    isLocked: false,
                  }}
                  onComplete={() => markTutorialComplete(currentTutorialOrder)}
                  isCompleted={isCurrentCompleted}
                  onNext={hasNextTutorial ? goToNextTutorial : undefined}
                  hasNext={hasNextTutorial}
                  userCode={userCode}
                  onCodeChange={setUserCode}
                  courseType="canvas"
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Code className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                    <h3 className="text-lg font-medium text-slate-800 mb-2">
                      Select a tutorial to get started!
                    </h3>
                    <p className="text-slate-600">
                      Choose a tutorial from the sidebar to begin your
                      JavaScript adventure.
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent
              value="reference"
              className="flex-1 overflow-hidden mt-0"
            >
              <ApiDocumentation courseType="canvas" />
            </TabsContent>
          </Tabs>
        </main>
      </div>
      <Analytics />
    </div>
  );
}
