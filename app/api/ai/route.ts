import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  buildPrompt,
  callAiProvider,
  estimateTokens,
  validateAiRequest
} from "@/lib/ai";
import { enforceAiCredits, recordAiUsage } from "@/lib/ai-usage";
import { flags } from "@/lib/flags";

export async function POST(req: Request) {
  try {
    if (flags.devLocalDb) {
      const payload = await req.json();
      const { action } = validateAiRequest(payload);
      return NextResponse.json({
        result: { action, note: "AI is disabled in local dev mode." },
        tokensUsed: 0,
        remaining: 10
      });
    }

    const supabase = createClient();
    const {
      data: { user },
      error
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await req.json();
    const { action, payload: input } = validateAiRequest(payload);
    const prompt = buildPrompt(action, input);
    const estimatedTokens = estimateTokens(prompt);

    const creditStatus = await enforceAiCredits(user.id, estimatedTokens);

    if (!creditStatus.allowed) {
      return NextResponse.json(
        {
          error: "AI credit limit reached.",
          remaining: creditStatus.remaining,
          plan: creditStatus.plan
        },
        { status: 402 }
      );
    }

    const result = await callAiProvider({ prompt });
    await recordAiUsage(user.id, result.tokensEstimated);

    return NextResponse.json({
      result: result.json,
      tokensUsed: result.tokensEstimated,
      remaining: creditStatus.remaining
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
