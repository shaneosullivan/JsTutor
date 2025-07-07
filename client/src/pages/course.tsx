import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Book, CheckCircle, Lock } from "lucide-react";
import TutorialContent from "@/components/tutorial-content";
import TutorialSidebar from "@/components/tutorial-sidebar";
import { useTutorial } from "@/hooks/use-course-tutorial";

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

export default function CoursePage() {
  const [match, params] = useRoute("/course/:id");
  const courseId = parseInt(params?.id || "0");

  // Local storage hooks for course-specific progress
  const getCompletedTutorials = (): number[] => {
    const saved = localStorage.getItem(`completedTutorials_course_${courseId}`);
    return saved ? JSON.parse(saved) : [];
  };

  const getCurrentTutorial = (): number => {
    const saved = localStorage.getItem(`currentTutorial_course_${courseId}`);
    return saved ? parseInt(saved) : 1;
  };

  const [completedTutorials, setCompletedTutorials] = useState<number[]>(getCompletedTutorials);
  const [currentTutorialOrder, setCurrentTutorialOrder] = useState<number>(getCurrentTutorial);

  // Fetch course and tutorials
  const { data: course, isLoading: courseLoading } = useQuery<Course>({
    queryKey: [`/api/courses/${courseId}`],
    enabled: !!courseId,
  });

  const { data: tutorials = [], isLoading: tutorialsLoading } = useQuery<Tutorial[]>({
    queryKey: [`/api/courses/${courseId}/tutorials`],
    enabled: !!courseId,
  });

  const {
    userCode,
    setUserCode,
    sidebarCollapsed,
    setSidebarCollapsed,
  } = useTutorial();

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem(`completedTutorials_course_${courseId}`, JSON.stringify(completedTutorials));
  }, [completedTutorials, courseId]);

  useEffect(() => {
    localStorage.setItem(`currentTutorial_course_${courseId}`, currentTutorialOrder.toString());
  }, [currentTutorialOrder, courseId]);

  // Tutorial completion logic
  const markTutorialComplete = (tutorialOrder: number) => {
    const tutorial = tutorials.find(t => t.order === tutorialOrder);
    if (!tutorial) return;

    if (!completedTutorials.includes(tutorial.id)) {
      setCompletedTutorials(prev => [...prev, tutorial.id]);
    }

    // Check if this is the last tutorial in the course
    const isLastTutorial = tutorialOrder === Math.max(...tutorials.map(t => t.order));
    if (isLastTutorial) {
      // Mark course as completed
      const completedCourses = JSON.parse(localStorage.getItem('completedCourses') || '[]');
      if (!completedCourses.includes(courseId)) {
        localStorage.setItem('completedCourses', JSON.stringify([...completedCourses, courseId]));
      }
    }
  };

  const goToNextTutorial = () => {
    const nextOrder = currentTutorialOrder + 1;
    const nextTutorial = tutorials.find(t => t.order === nextOrder);
    if (nextTutorial) {
      setCurrentTutorialOrder(nextOrder);
    }
  };

  const selectTutorial = (tutorial: Tutorial) => {
    setCurrentTutorialOrder(tutorial.order);
  };

  // Check if tutorial is unlocked
  const isTutorialUnlocked = (tutorial: Tutorial): boolean => {
    if (tutorial.order === 1) return true;
    const prevTutorial = tutorials.find(t => t.order === tutorial.order - 1);
    return prevTutorial ? completedTutorials.includes(prevTutorial.id) : false;
  };

  const currentTutorialData = tutorials.find(t => t.order === currentTutorialOrder);
  const isCurrentCompleted = currentTutorialData ? completedTutorials.includes(currentTutorialData.id) : false;
  const hasNext = currentTutorialOrder < Math.max(...tutorials.map(t => t.order));

  // Load starter code when tutorial changes
  useEffect(() => {
    if (currentTutorialData && currentTutorialData.starterCode) {
      // Check if we have saved user code for this tutorial
      const savedCode = localStorage.getItem(`userCode_tutorial_${currentTutorialData.id}`);
      if (savedCode) {
        setUserCode(savedCode);
      } else {
        // Load the starter code
        setUserCode(currentTutorialData.starterCode);
      }
    }
  }, [currentTutorialData]);

  // Save user code when it changes
  useEffect(() => {
    if (currentTutorialData && userCode) {
      localStorage.setItem(`userCode_tutorial_${currentTutorialData.id}`, userCode);
    }
  }, [currentTutorialData, userCode]);

  if (courseLoading || tutorialsLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course || !currentTutorialData) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Course Not Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              The course you're looking for doesn't exist.
            </p>
            <Link href="/">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Courses
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const sortedTutorials = tutorials.sort((a, b) => a.order - b.order);

  return (
    <div className="h-screen flex">
      <TutorialSidebar
        tutorials={sortedTutorials.map(t => ({
          id: t.id,
          title: t.title,
          description: t.description,
          content: t.content,
          starterCode: t.starterCode,
          expectedOutput: t.expectedOutput || "",
          order: t.order,
          isLocked: !isTutorialUnlocked(t)
        }))}
        currentTutorial={currentTutorialData ? {
          id: currentTutorialData.id,
          title: currentTutorialData.title,
          description: currentTutorialData.description,
          content: currentTutorialData.content,
          starterCode: currentTutorialData.starterCode,
          expectedOutput: currentTutorialData.expectedOutput || "",
          order: currentTutorialData.order,
          isLocked: false
        } : null}
        completedTutorials={completedTutorials}
        onTutorialSelect={selectTutorial}
        collapsed={sidebarCollapsed}
        onToggleCollapsed={() => setSidebarCollapsed(!sidebarCollapsed)}
        course={course}
      />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                All Courses
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold">{course.title}</h1>
              <p className="text-sm text-gray-600">{course.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Book className="h-5 w-5 text-blue-600" />
            <span className="text-sm text-gray-600">
              {completedTutorials.length} of {tutorials.length} completed
            </span>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <TutorialContent
            tutorial={{
              id: currentTutorialData.id,
              title: currentTutorialData.title,
              description: currentTutorialData.description,
              content: currentTutorialData.content,
              starterCode: currentTutorialData.starterCode,
              expectedOutput: currentTutorialData.expectedOutput || "",
              order: currentTutorialData.order,
              isLocked: false
            }}
            onComplete={() => markTutorialComplete(currentTutorialOrder)}
            isCompleted={isCurrentCompleted}
            onNext={hasNext ? goToNextTutorial : undefined}
            hasNext={hasNext}
            userCode={userCode}
            onCodeChange={setUserCode}
            courseType={course.type}
          />
        </div>
      </div>
    </div>
  );
}