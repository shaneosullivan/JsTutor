import { NextResponse } from "next/server";
import { getTutorialsForCourse } from "@/lib/dataUtils";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const courseId = parseInt(params.id);
  const courseTutorials = getTutorialsForCourse(courseId);

  return NextResponse.json(courseTutorials);
}
