"use client";

import { useState, useEffect, useMemo } from "react";
// Removed useQuery import - now using local utility functions
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Lock,
  Play,
  BookOpen,
  Code,
  Globe,
  Layers,
  Database,
  User,
} from "lucide-react";
import GithubIcon from "@/components/GithubIcon";
import ProfileAvatar from "@/components/ProfileAvatar";
import Analytics from "@/components/Analytics";
import {
  getCompletedCourses as getCompletedCoursesFromStorage,
  setProfileItem,
} from "@/lib/profile-storage";
import { getCoursesForLocale } from "@/lib/dataUtils";

interface Course {
  id: number;
  title: string;
  description: string;
  type: string;
  order: number;
  requiredCourse: number | null;
}

export default function CourseSelection() {
  const courses = useMemo(() => getCoursesForLocale("en"), []);
  const isLoading = false;

  // Get completion status from profile storage
  const getCompletedCourses = (): number[] => {
    if (typeof window === "undefined") return [];
    return getCompletedCoursesFromStorage();
  };

  const [completedCourses, setCompletedCourses] = useState<number[]>([]);

  // Initialize state from profile storage after component mounts
  useEffect(() => {
    setCompletedCourses(getCompletedCourses());
    // Course progress is computed from tutorial data, no sync needed
  }, []);

  const isCourseUnlocked = useMemo(
    () =>
      (course: Course): boolean => {
        if (course.requiredCourse === null) {
          // Basics course is always unlocked
          return true;
        }
        return completedCourses.includes(course.requiredCourse);
      },
    [completedCourses]
  );

  const isCourseCompleted = useMemo(
    () =>
      (courseId: number): boolean => {
        return completedCourses.includes(courseId);
      },
    [completedCourses]
  );

  const getCourseIcon = (type: string) => {
    switch (type) {
      case "canvas":
        return <BookOpen className="h-8 w-8" />;
      case "printData":
        return <Code className="h-8 w-8" />;
      case "iframe":
        return <Globe className="h-8 w-8" />;
      default:
        return <Layers className="h-8 w-8" />;
    }
  };

  const getCourseTypeDescription = (type: string) => {
    switch (type) {
      case "canvas":
        return "Visual programming with drawing canvas";
      case "printData":
        return "Data manipulation and console output";
      case "iframe":
        return "Web development with HTML preview";
      default:
        return "Interactive coding exercises";
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <Link href="/profiles">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-200"
              >
                <User className="h-4 w-4" />
                Manage Profiles
              </Button>
            </Link>

            <div className="flex items-center space-x-3">
              <a
                href="https://github.com/shaneosullivan/JsTutor"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 text-slate-600 hover:text-slate-800 transition-colors hover:scale-110"
                title="View on GitHub"
              >
                <GithubIcon size={20} />
              </a>

              <ProfileAvatar size={32} />
            </div>
          </div>

          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="relative">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent mb-6">
                JavaScript Adventure Courses
              </h1>
              <div className="flex justify-center mb-4">
                <div className="bg-white rounded-full px-6 py-2 shadow-lg border-2 border-purple-200">
                  <span className="ml-2 font-semibold text-gray-700">
                    Choose Your Learning Path
                  </span>
                </div>
              </div>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Start with the{" "}
                <strong className="text-purple-600">Basics course</strong>, then
                explore specialized topics in any order you prefer!
              </p>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {sortedCourses.map((course, index) => {
              const isUnlocked = isCourseUnlocked(course);
              const isCompleted = isCourseCompleted(course.id);
              const isBasics = course.requiredCourse === null;

              const cardGradients = {
                canvas: "from-pink-100 to-purple-100",
                printData: "from-blue-100 to-cyan-100",
                iframe: "from-green-100 to-emerald-100",
                default: "from-yellow-100 to-orange-100",
              };

              const cardBorders = {
                canvas: "border-pink-200",
                printData: "border-blue-200",
                iframe: "border-green-200",
                default: "border-yellow-200",
              };

              return (
                <div
                  key={course.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {isUnlocked ? (
                    <Link
                      href={course.id === 1 ? "/" : `/course/${course.id}`}
                      onClick={() => {
                        if (typeof window !== "undefined") {
                          setProfileItem("lastCourseId", course.id.toString());
                        }
                      }}
                    >
                      <Card
                        className={`relative transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer border-2 bg-gradient-to-br ${cardGradients[course.type as keyof typeof cardGradients] || cardGradients.default} ${cardBorders[course.type as keyof typeof cardBorders] || cardBorders.default} ${
                          isCompleted
                            ? "ring-4 ring-green-400 ring-opacity-50"
                            : ""
                        } hover:rotate-1 transform-gpu`}
                      >
                        {/* Completion indicator */}
                        {isCompleted && (
                          <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-2 shadow-lg">
                            <CheckCircle className="h-4 w-4" />
                          </div>
                        )}

                        <CardHeader className="text-center">
                          <div className="flex justify-center mb-4">
                            <div
                              className={`p-4 rounded-full shadow-lg transform transition-transform hover:scale-110 ${
                                isCompleted
                                  ? "bg-gradient-to-br from-green-100 to-green-200 text-green-600"
                                  : isUnlocked
                                    ? "bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600"
                                    : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400"
                              }`}
                            >
                              {isCompleted ? (
                                <CheckCircle className="h-10 w-10" />
                              ) : isUnlocked ? (
                                getCourseIcon(course.type)
                              ) : (
                                <Lock className="h-10 w-10" />
                              )}
                            </div>
                          </div>
                          <CardTitle className="text-xl mb-3 font-bold">
                            <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                              {course.title}
                            </span>
                            {isBasics && (
                              <Badge className="ml-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg">
                                Start Here
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription className="text-sm font-medium bg-white/50 rounded-full px-3 py-1 mx-auto inline-block">
                            {getCourseTypeDescription(course.type)}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="bg-white/70 rounded-lg p-3 mb-4 border border-white/50">
                            <p className="text-gray-700 text-sm leading-relaxed font-medium">
                              {course.description}
                            </p>
                          </div>

                          <div className="space-y-3">
                            {isCompleted && (
                              <div className="flex items-center justify-center bg-green-50 text-green-700 text-sm font-semibold rounded-full py-2 px-4 border-2 border-green-200">
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Course Completed!
                              </div>
                            )}

                            {!isUnlocked && !isBasics && (
                              <div className="flex items-center justify-center bg-gray-50 text-gray-600 text-sm font-medium rounded-full py-2 px-4 border-2 border-gray-200">
                                <Lock className="h-4 w-4 mr-2" />
                                Complete Basics course first
                              </div>
                            )}

                            <Button
                              className={`w-full font-bold text-sm py-3 transition-all duration-300 transform hover:scale-105 shadow-lg ${
                                isCompleted
                                  ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0"
                                  : isUnlocked
                                    ? "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0"
                                    : ""
                              }`}
                              variant={
                                isCompleted
                                  ? "default"
                                  : isUnlocked
                                    ? "default"
                                    : "outline"
                              }
                              disabled={!isUnlocked}
                            >
                              {isUnlocked ? (
                                <>
                                  <Play className="h-4 w-4 mr-2" />
                                  {isCompleted
                                    ? "Review Course"
                                    : isBasics
                                      ? "Start Learning"
                                      : "Start Course"}
                                </>
                              ) : (
                                <>
                                  <Lock className="h-4 w-4 mr-2" />
                                  Locked
                                </>
                              )}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ) : (
                    <Card
                      className={`relative transition-all duration-300 opacity-70 cursor-not-allowed border-2 bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300 transform hover:scale-102`}
                    >
                      <CardHeader className="text-center">
                        <div className="flex justify-center mb-3">
                          <div
                            className={`p-3 rounded-full ${
                              isCompleted
                                ? "bg-green-100 text-green-600"
                                : isUnlocked
                                  ? "bg-blue-100 text-blue-600"
                                  : "bg-gray-100 text-gray-400"
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

                          <Button
                            className="w-full"
                            variant={isCompleted ? "outline" : "default"}
                            disabled={!isUnlocked}
                          >
                            {isUnlocked ? (
                              <>
                                <Play className="h-4 w-4 mr-2" />
                                {isCompleted
                                  ? "Review Course"
                                  : isBasics
                                    ? "Start Learning"
                                    : "Start Course"}
                              </>
                            ) : (
                              <>
                                <Lock className="h-4 w-4 mr-2" />
                                Locked
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              );
            })}
          </div>

          {/* Progress Info Section */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-8 max-w-3xl mx-auto border-2 border-blue-200 shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-full shadow-lg">
                    <Database className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                  Your Progress is Automatically Saved
                </h3>
                <div className="bg-white/80 rounded-xl p-4 backdrop-blur-sm border border-blue-200">
                  <p className="text-gray-700 font-medium leading-relaxed">
                    All your progress is{" "}
                    <strong className="text-purple-600">
                      automatically saved
                    </strong>{" "}
                    in your browser.
                    <br />
                    Come back anytime and continue your learning journey right
                    where you left off!
                  </p>
                </div>

                {/* Progress stats if completed courses exist */}
                {completedCourses.length > 0 && (
                  <div className="mt-4 flex justify-center">
                    <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-full px-6 py-2 border-2 border-green-300">
                      <span className="text-green-700 font-bold">
                        {completedCourses.length} Course
                        {completedCourses.length !== 1 ? "s" : ""} Completed
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <Analytics />
      </div>
    </div>
  );
}
