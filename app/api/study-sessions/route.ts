import { NextResponse } from "next/server";
import { flags } from "@/lib/flags";
import { createStudySession, listStudySessions } from "@/lib/dev-store";

export async function GET() {
  if (!flags.devLocalDb) {
    return NextResponse.json({ error: "Local DB disabled." }, { status: 501 });
  }

  const sessions = await listStudySessions();
  return NextResponse.json(sessions);
}

export async function POST(req: Request) {
  if (!flags.devLocalDb) {
    return NextResponse.json({ error: "Local DB disabled." }, { status: 501 });
  }

  const body = await req.json();
  const session = await createStudySession({
    course_id: body.course_id ?? null,
    date: String(body.date || ""),
    duration: Number(body.duration || 50),
    topic: body.topic ? String(body.topic) : null,
    completed: Boolean(body.completed)
  });

  return NextResponse.json(session, { status: 201 });
}
