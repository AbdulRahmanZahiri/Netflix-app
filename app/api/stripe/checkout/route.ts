import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";
import { flags } from "@/lib/flags";

export async function POST() {
  if (!flags.billingEnabled) {
    return NextResponse.json(
      { error: "Billing is disabled." },
      { status: 503 }
    );
  }

  const supabase = createClient();
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const priceId = process.env.STRIPE_PRICE_PRO_MONTHLY;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!priceId || !appUrl) {
    return NextResponse.json(
      { error: "Stripe price ID or app URL not configured." },
      { status: 500 }
    );
  }

  const { data: existing } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let customerId = existing?.stripe_customer_id || undefined;

  if (!customerId) {
    const customer = await getStripe().customers.create({
      email: user.email ?? undefined,
      metadata: { user_id: user.id }
    });
    customerId = customer.id;

    await supabase.from("subscriptions").insert({
      user_id: user.id,
      stripe_customer_id: customerId,
      status: "pending",
      plan: "pro"
    });
  }

  const session = await getStripe().checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/dashboard/settings?checkout=success`,
    cancel_url: `${appUrl}/dashboard/settings?checkout=cancel`
  });

  return NextResponse.redirect(session.url ?? `${appUrl}/dashboard/settings`, 303);
}
