import { z } from "zod";

export type AiAction =
  | "study_plan"
  | "flashcards"
  | "quiz"
  | "summary"
  | "simplify";

const studyPlanPrompt = `You are an academic performance strategist.
Create a balanced weekly schedule based on:
Course name
Exam date
Topics
Available hours
Difficulty
Use 50-minute sessions.
Increase revision near exam.
Return a JSON object with a sessions array.`;

const flashcardPrompt = `Convert the following notes into high-quality active recall flashcards.
One concept per card.
Concise answers.
Return a JSON object with a flashcards array.`;

const quizPrompt = `Generate 10 conceptual university-level questions based ONLY on provided content.
Mix multiple choice and short answer.
Return a JSON object with questions and answer_key arrays.`;

const safetyGuard = `Rules:
- ONLY use user-provided content.
- Do NOT solve assignments directly.
- Focus on understanding, not answers.
- Output JSON only, no markdown.`;

export const prompts = {
  studyPlanPrompt,
  flashcardPrompt,
  quizPrompt,
  safetyGuard
};

const requestSchema = z.object({
  action: z.enum(["study_plan", "flashcards", "quiz", "summary", "simplify"]),
  payload: z.record(z.any())
});

export function validateAiRequest(data: unknown) {
  return requestSchema.parse(data);
}

export function buildPrompt(action: AiAction, payload: Record<string, unknown>) {
  const payloadText = JSON.stringify(payload, null, 2);

  if (!payloadText || payloadText.length < 10) {
    throw new Error("User content is required for AI requests.");
  }

  switch (action) {
    case "study_plan":
      return `${studyPlanPrompt}\n${safetyGuard}\nUser Input:\n${payloadText}`;
    case "flashcards":
      return `${flashcardPrompt}\n${safetyGuard}\nUser Notes:\n${payloadText}`;
    case "quiz":
      return `${quizPrompt}\n${safetyGuard}\nUser Content:\n${payloadText}`;
    case "summary":
      return `Summarize the following notes in bullet points. Return a JSON object with a summary array. ${safetyGuard}\nUser Notes:\n${payloadText}`;
    case "simplify":
      return `Simplify the following text for clearer understanding. Return a JSON object with a simplified_text field. ${safetyGuard}\nUser Text:\n${payloadText}`;
    default:
      throw new Error("Unsupported action.");
  }
}

export type AiResponse = {
  raw: string;
  json: unknown;
  tokensEstimated: number;
};

export function estimateTokens(text: string) {
  return Math.ceil(text.length / 4);
}

export async function callAiProvider({
  prompt
}: {
  prompt: string;
}): Promise<AiResponse> {
  const apiUrl = process.env.AI_API_URL;
  const apiKey = process.env.AI_API_KEY;
  const model = process.env.AI_MODEL || "structured-output";

  if (!apiUrl || !apiKey) {
    throw new Error("AI_API_URL and AI_API_KEY must be set.");
  }

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content: safetyGuard
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI provider error: ${errorText}`);
  }

  const data = await response.json();
  const raw = data?.choices?.[0]?.message?.content ?? JSON.stringify(data);
  let json: unknown = raw;

  try {
    json = JSON.parse(raw);
  } catch {
    json = { raw };
  }

  return {
    raw,
    json,
    tokensEstimated: estimateTokens(prompt + raw)
  };
}
