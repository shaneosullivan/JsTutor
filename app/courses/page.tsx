import { Metadata } from "next";
import CourseSelection from "@/components/pages/CourseSelection";

export const metadata: Metadata = {
  title: "JavaScript Courses - JsTutor",
  description:
    "Browse our comprehensive JavaScript courses. From beginner to advanced, learn JavaScript at your own pace with interactive tutorials.",
  openGraph: {
    title: "JavaScript Courses - JsTutor",
    description:
      "Browse our comprehensive JavaScript courses. From beginner to advanced, learn JavaScript at your own pace.",
    url: "https://jstutor.com/courses",
  },
};

export default function CoursesPage() {
  return <CourseSelection />;
}
