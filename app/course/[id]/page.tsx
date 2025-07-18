import { Metadata } from "next";
import CoursePage from "@/components/pages/CoursePage";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id: courseId } = await params;

  // You can fetch course data here for dynamic metadata
  return {
    title: `JavaScript Course: ${courseId} - JsTutor`,
    description: `Learn JavaScript through interactive tutorials and hands-on practice in course ${courseId}.`,
    openGraph: {
      title: `JavaScript Course: ${courseId} - JsTutor`,
      description: `Learn JavaScript through interactive tutorials and hands-on practice in course ${courseId}.`,
      url: `https://jstutor.com/course/${courseId}`
    }
  };
}

export default async function CoursePageRoute({ params }: Props) {
  const { id } = await params;
  return <CoursePage courseId={id} />;
}
