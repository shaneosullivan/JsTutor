import { Metadata } from "next";
import Home from "@/components/pages/Home";

export const metadata: Metadata = {
  title: "JsTutor - Interactive JavaScript Learning Platform",
  description:
    "Learn JavaScript through interactive tutorials, code examples, and real-time practice. Master JavaScript fundamentals with hands-on exercises.",
  openGraph: {
    title: "JsTutor - Interactive JavaScript Learning Platform",
    description:
      "Learn JavaScript through interactive tutorials, code examples, and real-time practice.",
    url: "https://jstutor.com",
  },
};

export default function HomePage() {
  return <Home />;
}
