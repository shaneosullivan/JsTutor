import { Metadata } from "next";
import NotFoundPage from "@/components/pages/NotFoundPage";

export const metadata: Metadata = {
  title: "404 - Page Not Found - JsTutor",
  description:
    "The page you are looking for does not exist. Return to JsTutor to continue learning JavaScript."
};

export default function NotFound() {
  return <NotFoundPage />;
}
