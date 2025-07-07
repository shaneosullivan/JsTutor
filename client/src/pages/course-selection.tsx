import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Lock, Play, BookOpen, Code, Globe, Layers, Database } from "lucide-react";

interface Course {
  id: number;
  title: string;
  description: string;
  type: string;
  order: number;
  requiredCourse: number | null;
}

export default function CourseSelection() {
  const { data: courses = [], isLoading } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
  });

  // Get completion status from localStorage
  const getCompletedCourses = (): number[] => {
    const saved = localStorage.getItem('completedCourses');
    return saved ? JSON.parse(saved) : [];
  };

  const completedCourses = getCompletedCourses();

  const isCourseUnlocked = (course: Course): boolean => {
    if (course.requiredCourse === null) return true; // Basics course is always unlocked
    return completedCourses.includes(course.requiredCourse);
  };

  const isCourseCompleted = (courseId: number): boolean => {
    return completedCourses.includes(courseId);
  };

  const getCourseIcon = (type: string) => {
    switch (type) {
      case 'canvas':
        return <BookOpen className="h-8 w-8" />;
      case 'printData':
        return <Code className="h-8 w-8" />;
      case 'iframe':
        return <Globe className="h-8 w-8" />;
      default:
        return <Layers className="h-8 w-8" />;
    }
  };

  const getCourseTypeDescription = (type: string) => {
    switch (type) {
      case 'canvas':
        return 'Visual programming with drawing canvas';
      case 'printData':
        return 'Data manipulation and console output';
      case 'iframe':
        return 'Web development with HTML preview';
      default:
        return 'Interactive coding exercises';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  const sortedCourses = courses.sort((a, b) => a.order - b.order);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            JavaScript Adventure Courses
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose your learning path! Start with the Basics course, then explore specialized topics
            in any order you prefer.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedCourses.map((course) => {
            const isUnlocked = isCourseUnlocked(course);
            const isCompleted = isCourseCompleted(course.id);
            const isBasics = course.requiredCourse === null;

            return (
              <Card
                key={course.id}
                className={`transition-all duration-200 ${
                  isUnlocked
                    ? 'hover:shadow-lg hover:scale-105 cursor-pointer'
                    : 'opacity-60 cursor-not-allowed'
                } ${isCompleted ? 'ring-2 ring-green-500' : ''}`}
              >
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-3">
                    <div
                      className={`p-3 rounded-full ${
                        isCompleted
                          ? 'bg-green-100 text-green-600'
                          : isUnlocked
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-8 w-8" />
                      ) : isUnlocked ? (
                        getCourseIcon(course.type)
                      ) : (
                        <Lock className="h-8 w-8" />
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-xl mb-2">
                    {course.title}
                    {isBasics && (
                      <Badge className="ml-2 bg-purple-100 text-purple-700">
                        Required First
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-500">
                    {getCourseTypeDescription(course.type)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {course.description}
                  </p>
                  
                  <div className="space-y-3">
                    {isCompleted && (
                      <div className="flex items-center text-green-600 text-sm">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Course Completed!
                      </div>
                    )}
                    
                    {!isUnlocked && !isBasics && (
                      <div className="flex items-center text-gray-500 text-sm">
                        <Lock className="h-4 w-4 mr-2" />
                        Complete Basics course first
                      </div>
                    )}
                    
                    {isUnlocked ? (
                      <Link href={course.id === 1 ? "/" : `/course/${course.id}`}>
                        <Button 
                          className="w-full" 
                          variant={isCompleted ? "outline" : "default"}
                          onClick={() => localStorage.setItem('lastCourseId', course.id.toString())}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          {isCompleted ? 'Review Course' : isBasics ? 'Start Learning' : 'Start Course'}
                        </Button>
                      </Link>
                    ) : (
                      <Button className="w-full" disabled>
                        <Lock className="h-4 w-4 mr-2" />
                        Locked
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-blue-50 rounded-lg p-6 max-w-2xl mx-auto">
            <Database className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Your Progress is Saved Locally
            </h3>
            <p className="text-gray-600 text-sm">
              All your progress is automatically saved in your browser. You can come back anytime
              and continue where you left off!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}