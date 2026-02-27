import { NextResponse } from "next/server";
import { flags } from "@/lib/flags";
import { createFlashcard, listFlashcards } from "@/lib/dev-store";

export async function GET() {
  if (!flags.devLocalDb) {
    return NextResponse.json({ error: "Local DB disabled." }, { status: 501 });
  }

  const flashcards = await listFlashcards();
  return NextResponse.json(flashcards);
}

export async function POST(req: Request) {
  if (!flags.devLocalDb) {
    return NextResponse.json({ error: "Local DB disabled." }, { status: 501 });
  }

  const body = await req.json();
  const flashcard = await createFlashcard({
    question: String(body.question || ""),
    answer: String(body.answer || "")
  });

  return NextResponse.json(flashcard, { status: 201 });
}
