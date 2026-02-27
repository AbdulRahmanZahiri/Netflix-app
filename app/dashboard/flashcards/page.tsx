"use client";

import { useEffect, useState } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { Button } from "@/components/Button";
import { apiFetch } from "@/api/client";
import { calculateNextReview, type ReviewResult } from "@/lib/spaced-repetition";

type Flashcard = {
  id: string;
  question: string;
  answer: string;
  mastery_level: number;
  next_review: string;
};

export default function FlashcardsPage() {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ question: "", answer: "" });

  const loadCards = () =>
    apiFetch<Flashcard[]>("/api/flashcards")
      .then(setCards)
      .catch((err) => setError(err.message));

  useEffect(() => {
    loadCards();
  }, []);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    await apiFetch<Flashcard>("/api/flashcards", {
      method: "POST",
      body: JSON.stringify(form)
    });

    setForm({ question: "", answer: "" });
    loadCards();
  };

  const onReview = async (card: Flashcard, result: ReviewResult) => {
    const { nextLevel, nextReviewDate } = calculateNextReview({
      masteryLevel: card.mastery_level,
      result
    });

    await apiFetch(`/api/flashcards/${card.id}`, {
      method: "PATCH",
      body: JSON.stringify({ mastery_level: nextLevel, next_review: nextReviewDate })
    });

    loadCards();
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Flashcards"
        subtitle="Manual and AI-generated cards with spaced repetition."
      />

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="surface-card rounded-2xl p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-ink">Next review</h3>
            <Button variant="secondary" size="sm">
              Generate from notes
            </Button>
          </div>
          <div className="mt-6 space-y-4">
            {cards.length === 0 ? (
              <p className="text-sm text-slate/70">No flashcards yet.</p>
            ) : (
              cards.map((card) => (
                <div key={card.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-medium text-ink">{card.question}</p>
                  <p className="mt-2 text-xs text-slate/70">
                    Mastery {card.mastery_level} - Review {card.next_review}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onReview(card, "hard")}>
                      Hard
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onReview(card, "good")}>
                      Good
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onReview(card, "easy")}>
                      Easy
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="surface-card rounded-2xl p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-ink">Create a card</h3>
          <form className="mt-4 space-y-4" onSubmit={onSubmit}>
            <label className="flex flex-col gap-2 text-sm text-slate/80">
              <span className="font-medium">Question</span>
              <textarea
                className="min-h-[120px] rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-ink shadow-soft"
                placeholder="What are the stages of the cell cycle?"
                value={form.question}
                onChange={(event) => setForm({ ...form, question: event.target.value })}
                required
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-slate/80">
              <span className="font-medium">Answer</span>
              <textarea
                className="min-h-[120px] rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-ink shadow-soft"
                placeholder="Interphase (G1, S, G2) and mitosis (prophase, metaphase, anaphase, telophase)."
                value={form.answer}
                onChange={(event) => setForm({ ...form, answer: event.target.value })}
                required
              />
            </label>
            <Button type="submit">Save flashcard</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
