import { NextResponse } from "next/server";
import { flags } from "@/lib/flags";
import { deleteStudySession, updateStudySession } from "@/lib/dev-store";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  if (!flags.devLocalDb) {
    return NextResponse.json({ error: "Local DB disabled." }, { status: 501 });
  }

  const body = await req.json();
  const updated = await updateStudySession(params.id, {
    course_id: body.course_id ?? null,
    date: body.date,
    duration: body.duration,
    topic: body.topic,
    completed: body.completed
  });

  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  if (!flags.devLocalDb) {
    return NextResponse.json({ error: "Local DB disabled." }, { status: 501 });
  }

  await deleteStudySession(params.id);
  return NextResponse.json({ success: true });
}
