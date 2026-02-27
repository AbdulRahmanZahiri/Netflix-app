import { NextResponse } from "next/server";
import { generateWeeklyPlan, type AssignmentInput } from "@/lib/planner";

export async function POST(req: Request) {
  const body = await req.json();
  const assignments = (body.assignments || []) as AssignmentInput[];
  const weeklyHours = Number(body.weeklyHours || 0);
  const startDate = body.startDate ? new Date(body.startDate) : new Date();

  const plan = generateWeeklyPlan({ assignments, weeklyHours, startDate });

  return NextResponse.json(plan);
}
