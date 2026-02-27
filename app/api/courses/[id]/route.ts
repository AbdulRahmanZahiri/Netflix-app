import { NextResponse } from "next/server";
import { flags } from "@/lib/flags";
import { deleteCourse, updateCourse } from "@/lib/dev-store";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  if (!flags.devLocalDb) {
    return NextResponse.json({ error: "Local DB disabled." }, { status: 501 });
  }

  const body = await req.json();
  const updated = await updateCourse(params.id, {
    name: body.name,
    difficulty: body.difficulty,
    weekly_hours: body.weekly_hours,
    grading_weights: body.grading_weights,
    exam_date: body.exam_date
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

  await deleteCourse(params.id);
  return NextResponse.json({ success: true });
}
