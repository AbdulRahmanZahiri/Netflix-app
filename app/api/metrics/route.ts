import { NextResponse } from "next/server";
import { flags } from "@/lib/flags";
import {
  listAssignments,
  listCourses,
  listStudySessions
} from "@/lib/dev-store";

function toDate(value: string) {
  return new Date(value + "T00:00:00");
}

export async function GET() {
  if (!flags.devLocalDb) {
    return NextResponse.json({ error: "Local DB disabled." }, { status: 501 });
  }

  const [courses, assignments, sessions] = await Promise.all([
    listCourses(),
    listAssignments(),
    listStudySessions()
  ]);

  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);

  const upcoming = assignments.filter(
    (assignment) =>
      !assignment.completed &&
      toDate(assignment.due_date) <= nextWeek
  );

  const lastWeek = new Date();
  lastWeek.setDate(today.getDate() - 7);

  const weeklyMinutes = sessions
    .filter((session) => new Date(session.date) >= lastWeek)
    .reduce((sum, session) => sum + session.duration, 0);

  const completedAssignments = assignments.filter((a) => a.completed).length;
  const completionRate = assignments.length
    ? Math.round((completedAssignments / assignments.length) * 100)
    : 0;

  const status = completionRate >= 75 ? "On-track" : completionRate >= 50 ? "At risk" : "Behind";

  return NextResponse.json({
    totalCourses: courses.length,
    upcomingDeadlines: upcoming.length,
    studyHours: Number((weeklyMinutes / 60).toFixed(1)),
    completionRate,
    status
  });
}
