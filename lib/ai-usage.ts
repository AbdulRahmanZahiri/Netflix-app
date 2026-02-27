import { createClient } from "@/lib/supabase/server";
import { getPlanLimits, getUserPlan } from "@/lib/subscription";

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export async function getMonthlyAiUsage(userId: string, date = new Date()) {
  const supabase = createClient();
  const start = startOfMonth(date).toISOString();
  const { data, error } = await supabase
    .from("ai_usage")
    .select("tokens_used")
    .eq("user_id", userId)
    .gte("created_at", start);

  if (error) {
    throw new Error(error.message);
  }

  return data.reduce((sum, row) => sum + row.tokens_used, 0);
}

export async function enforceAiCredits(userId: string, tokensToSpend: number) {
  const plan = await getUserPlan(userId);
  const limits = getPlanLimits(plan.plan);
  const usage = await getMonthlyAiUsage(userId);

  if (usage + tokensToSpend > limits.aiCredits) {
    return {
      allowed: false,
      remaining: Math.max(0, limits.aiCredits - usage),
      plan: plan.plan
    };
  }

  return {
    allowed: true,
    remaining: Math.max(0, limits.aiCredits - usage - tokensToSpend),
    plan: plan.plan
  };
}

export async function recordAiUsage(userId: string, tokensUsed: number) {
  const supabase = createClient();
  const { error } = await supabase.from("ai_usage").insert({
    user_id: userId,
    tokens_used: tokensUsed
  });

  if (error) {
    throw new Error(error.message);
  }
}
