import { Metadata } from "next";
import CourseSelection from "@/components/pages/CourseSelection";

export const metadata: Metadata = {
  title: "JsTutor - Interactive JavaScript Learning Platform",
  description:
    "Learn JavaScript through interactive tutorials, code examples, and real-time practice. Browse our comprehensive JavaScript courses from beginner to advanced.",
  openGraph: {
    title: "JsTutor - Interactive JavaScript Learning Platform",
    description:
      "Learn JavaScript through interactive tutorials, code examples, and real-time practice. Browse our comprehensive courses from beginner to advanced.",
    url: "https://jstutor.chofter.com",
    siteName: "JsTutor",
    images: [
      {
        url: "/jstutor-og-image.png",
        width: 1200,
        height: 630,
        alt: "JsTutor - Interactive JavaScript Learning Platform with visual courses for Basics, Array Methods, DOM Manipulation, and TypeScript"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "JsTutor - Interactive JavaScript Learning Platform",
    description:
      "Learn JavaScript through interactive tutorials, code examples, and real-time practice. Start with Basics and progress through specialized courses!",
    images: ["/jstutor-og-image.png"],
    creator: "@jstutor"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  }
};

export default function HomePage() {
  return <CourseSelection />;
}
