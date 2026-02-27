import { NextResponse } from "next/server";
import { flags } from "@/lib/flags";
import { deleteFlashcard, updateFlashcard } from "@/lib/dev-store";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  if (!flags.devLocalDb) {
    return NextResponse.json({ error: "Local DB disabled." }, { status: 501 });
  }

  const body = await req.json();
  const updated = await updateFlashcard(params.id, {
    question: body.question,
    answer: body.answer,
    mastery_level: body.mastery_level,
    next_review: body.next_review
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

  await deleteFlashcard(params.id);
  return NextResponse.json({ success: true });
}
