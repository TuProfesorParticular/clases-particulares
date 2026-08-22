import Stripe from "stripe";

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export function requireStripe(): Stripe {
  if (!stripe) {
    throw new Error("Stripe no está configurado (falta STRIPE_SECRET_KEY).");
  }
  return stripe;
}
