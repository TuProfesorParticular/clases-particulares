import "dotenv/config";
import Stripe from "stripe";
import { PLANS } from "../src/lib/plans";

async function ensurePrice(stripe: Stripe, planId: "pro" | "premium") {
  const plan = PLANS.find((p) => p.id === planId)!;
  const lookupKey = `clases-particulares-${planId}`;

  const existingPrices = await stripe.prices.list({
    lookup_keys: [lookupKey],
    limit: 1,
  });
  if (existingPrices.data.length > 0) {
    console.log(`Price ya existe para '${planId}': ${existingPrices.data[0].id}`);
    return existingPrices.data[0].id;
  }

  const product = await stripe.products.create({
    name: `TuProfesorParticular — Plan ${plan.name}`,
    description: plan.description,
  });

  const price = await stripe.prices.create({
    product: product.id,
    currency: "eur",
    unit_amount: Math.round(plan.price * 100),
    recurring: { interval: "month" },
    lookup_key: lookupKey,
  });

  console.log(`Price creado para '${planId}': ${price.id}`);
  return price.id;
}

async function main() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("Falta STRIPE_SECRET_KEY");
  }

  const stripe = new Stripe(secretKey);

  const proPriceId = await ensurePrice(stripe, "pro");
  const premiumPriceId = await ensurePrice(stripe, "premium");

  console.log("\nAñade esto a tu .env / variables de entorno de Vercel:\n");
  console.log(`STRIPE_PRICE_PRO="${proPriceId}"`);
  console.log(`STRIPE_PRICE_PREMIUM="${premiumPriceId}"`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
