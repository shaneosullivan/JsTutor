import { NextResponse } from "next/server";
import { getTutorialsForCourse } from "@/lib/dataUtils";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const courseTutorials = getTutorialsForCourse(id);

  return NextResponse.json(courseTutorials);
}
