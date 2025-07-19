import { Metadata } from "next";
import CourseSelection from "@/components/pages/CourseSelection";

export const metadata: Metadata = {
  title: "JsTutor - Interactive JavaScript Learning Platform",
  description:
    "Learn JavaScript through interactive tutorials, code examples, and real-time practice. Browse our comprehensive JavaScript courses from beginner to advanced.",
  openGraph: {
    title: "JsTutor - Interactive JavaScript Learning Platform",
    description:
      "Learn JavaScript through interactive tutorials, code examples, and real-time practice. Browse our comprehensive courses.",
    url: "https://jstutor.com"
  }
};

export default function HomePage() {
  return <CourseSelection />;
}
