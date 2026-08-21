"use server";

import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { requireStripe, PRICE_IDS } from "@/lib/stripe";

const APP_URL = process.env.APP_URL || "http://localhost:3000";

export async function startSubscriptionCheckout(formData: FormData) {
  const session = await requireRole("teacher");
  const plan = String(formData.get("plan") || "");
  if (plan !== "pro" && plan !== "premium") return;

  const priceId = PRICE_IDS[plan];
  if (!priceId) {
    throw new Error(`Falta configurar el Price ID de Stripe para el plan ${plan}`);
  }

  const stripe = requireStripe();

  const teacherProfile = await prisma.teacherProfile.findUniqueOrThrow({
    where: { userId: session.user.id },
    include: { user: true },
  });

  let customerId = teacherProfile.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: teacherProfile.user.email,
      name: teacherProfile.user.name,
      metadata: { teacherProfileId: teacherProfile.id },
    });
    customerId = customer.id;
    await prisma.teacherProfile.update({
      where: { id: teacherProfile.id },
      data: { stripeCustomerId: customerId },
    });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${APP_URL}/panel/suscripcion?success=1`,
    cancel_url: `${APP_URL}/panel/suscripcion?canceled=1`,
    metadata: { teacherProfileId: teacherProfile.id, plan },
  });

  if (!checkoutSession.url) {
    throw new Error("Stripe no devolvió una URL de checkout");
  }

  redirect(checkoutSession.url);
}

export async function openBillingPortal() {
  const session = await requireRole("teacher");
  const stripe = requireStripe();

  const teacherProfile = await prisma.teacherProfile.findUniqueOrThrow({
    where: { userId: session.user.id },
  });

  if (!teacherProfile.stripeCustomerId) {
    redirect("/panel/suscripcion");
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: teacherProfile.stripeCustomerId,
    return_url: `${APP_URL}/panel/suscripcion`,
  });

  redirect(portalSession.url);
}
