import { NextResponse } from "next/server";
import { getTutorialsByCourse } from "@/lib/data";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const courseId = parseInt(params.id);
  const courseTutorials = getTutorialsByCourse(courseId);

  return NextResponse.json(courseTutorials);
}
