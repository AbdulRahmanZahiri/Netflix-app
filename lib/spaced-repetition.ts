const intervals = [1, 3, 7, 14, 30, 60];

export type ReviewResult = "easy" | "good" | "hard";

export function calculateNextReview({
  masteryLevel,
  result,
  from = new Date()
}: {
  masteryLevel: number;
  result: ReviewResult;
  from?: Date;
}) {
  const delta = result === "easy" ? 2 : result === "good" ? 1 : -1;
  const nextLevel = Math.min(Math.max(0, masteryLevel + delta), intervals.length - 1);
  const days = intervals[nextLevel];
  const nextReview = new Date(from);
  nextReview.setDate(nextReview.getDate() + days);

  return {
    nextLevel,
    nextReviewDate: nextReview.toISOString().slice(0, 10)
  };
}
