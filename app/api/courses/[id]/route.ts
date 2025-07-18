import { NextResponse } from "next/server";
import { getCourse } from "@/lib/dataUtils";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const courseId = parseInt(id);
  const course = getCourse(courseId);

  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  return NextResponse.json(course);
}
