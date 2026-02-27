import { NextResponse } from "next/server";
import { flags } from "@/lib/flags";
import { deleteAssignment, updateAssignment } from "@/lib/dev-store";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  if (!flags.devLocalDb) {
    return NextResponse.json({ error: "Local DB disabled." }, { status: 501 });
  }

  const body = await req.json();
  const updated = await updateAssignment(params.id, {
    title: body.title,
    due_date: body.due_date,
    weight: body.weight,
    estimated_hours: body.estimated_hours,
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

  await deleteAssignment(params.id);
  return NextResponse.json({ success: true });
}
