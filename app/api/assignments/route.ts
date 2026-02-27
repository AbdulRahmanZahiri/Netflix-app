import { NextResponse } from "next/server";
import { flags } from "@/lib/flags";
import { createAssignment, listAssignments, listCourses } from "@/lib/dev-store";

export async function GET() {
  if (!flags.devLocalDb) {
    return NextResponse.json({ error: "Local DB disabled." }, { status: 501 });
  }

  const [assignments, courses] = await Promise.all([
    listAssignments(),
    listCourses()
  ]);

  const courseMap = new Map(courses.map((course) => [course.id, course]));

  const enriched = assignments.map((assignment) => ({
    ...assignment,
    course_name: courseMap.get(assignment.course_id)?.name ?? "Unknown"
  }));

  return NextResponse.json(enriched);
}

export async function POST(req: Request) {
  if (!flags.devLocalDb) {
    return NextResponse.json({ error: "Local DB disabled." }, { status: 501 });
  }

  const body = await req.json();
  const assignment = await createAssignment({
    course_id: String(body.course_id || ""),
    title: String(body.title || ""),
    due_date: String(body.due_date || ""),
    weight: Number(body.weight || 0),
    estimated_hours: Number(body.estimated_hours || 1)
  });

  return NextResponse.json(assignment, { status: 201 });
}
