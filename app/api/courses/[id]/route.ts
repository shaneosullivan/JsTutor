import { NextResponse } from "next/server";
import { getCourse } from "@/lib/data";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const courseId = parseInt(params.id);
  const course = getCourse(courseId);

  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  return NextResponse.json(course);
}
