import { NextResponse } from "next/server";
import { flags } from "@/lib/flags";
import { createCourse, listCourses } from "@/lib/dev-store";

export async function GET() {
  if (!flags.devLocalDb) {
    return NextResponse.json({ error: "Local DB disabled." }, { status: 501 });
  }

  const courses = await listCourses();
  return NextResponse.json(courses);
}

export async function POST(req: Request) {
  if (!flags.devLocalDb) {
    return NextResponse.json({ error: "Local DB disabled." }, { status: 501 });
  }

  const body = await req.json();
  const course = await createCourse({
    name: String(body.name || ""),
    difficulty: Number(body.difficulty || 1),
    weekly_hours: Number(body.weekly_hours || 1),
    grading_weights: body.grading_weights ? String(body.grading_weights) : null,
    exam_date: body.exam_date ? String(body.exam_date) : null
  });

  return NextResponse.json(course, { status: 201 });
}
