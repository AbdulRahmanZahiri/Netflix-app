import { createClient } from "@/lib/supabase/server";

export type PlanName = "free" | "pro";

const PLAN_LIMITS: Record<PlanName, {
  maxCourses: number;
  maxAssignments: number;
  aiCredits: number;
}> = {
  free: {
    maxCourses: 2,
    maxAssignments: 20,
    aiCredits: 10
  },
  pro: {
    maxCourses: Number.POSITIVE_INFINITY,
    maxAssignments: Number.POSITIVE_INFINITY,
    aiCredits: 500
  }
};

export function getPlanLimits(plan: PlanName) {
  return PLAN_LIMITS[plan];
}

export async function getUserPlan(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("subscriptions")
    .select("plan,status")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data || data.status !== "active") {
    return { plan: "free" as PlanName, status: "inactive" };
  }

  return {
    plan: (data.plan as PlanName) ?? "free",
    status: data.status
  };
}

export function canUseAdvancedPlanner(plan: PlanName) {
  return plan === "pro";
}
