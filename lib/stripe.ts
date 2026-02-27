import Stripe from "stripe";
import { flags } from "@/lib/flags";

let stripeInstance: Stripe | null = null;

export function getStripe() {
  if (!flags.billingEnabled) {
    throw new Error("Billing is disabled.");
  }

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY must be set.");
  }

  if (!stripeInstance) {
    stripeInstance = new Stripe(key, {
      apiVersion: "2024-06-20",
      typescript: true
    });
  }

  return stripeInstance;
}
