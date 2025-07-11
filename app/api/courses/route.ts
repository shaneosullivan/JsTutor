import { NextResponse } from "next/server";
import { getCoursesForLocale } from "@/lib/dataUtils";

export async function GET() {
  const courses = getCoursesForLocale("en");
  return NextResponse.json(courses);
}
