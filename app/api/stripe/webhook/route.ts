import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { flags } from "@/lib/flags";

const relevantEvents = new Set([
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted"
]);

export async function POST(req: Request) {
  if (!flags.billingEnabled) {
    return NextResponse.json({ received: true });
  }

  const signature = headers().get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing webhook secret." }, { status: 400 });
  }

  const body = await req.text();
  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    return NextResponse.json(
      { error: "Webhook signature verification failed." },
      { status: 400 }
    );
  }

  if (!relevantEvents.has(event.type)) {
    return NextResponse.json({ received: true });
  }

  const subscription = event.data.object as Stripe.Subscription;
  const customerId = subscription.customer as string;
  const status = subscription.status;
  const priceId = subscription.items.data[0]?.price?.id;

  const plan =
    priceId === process.env.STRIPE_PRICE_PRO_MONTHLY ? "pro" : "free";

  const supabaseAdmin = getSupabaseAdmin();
  const { data: existing } = await supabaseAdmin
    .from("subscriptions")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();

  if (existing?.id) {
    await supabaseAdmin
      .from("subscriptions")
      .update({ status, plan })
      .eq("stripe_customer_id", customerId);
  } else {
    const customer = await getStripe().customers.retrieve(customerId);
    const userId =
      typeof customer !== "string" ? customer.metadata?.user_id : undefined;

    if (userId) {
      await supabaseAdmin.from("subscriptions").insert({
        user_id: userId,
        stripe_customer_id: customerId,
        status,
        plan
      });
    }
  }

  return NextResponse.json({ received: true });
}
