"use server";

import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { requireStripe } from "@/lib/stripe";

const APP_URL = process.env.APP_URL || "http://localhost:3000";

export async function startConnectOnboarding() {
  const session = await requireRole("teacher");
  const stripe = requireStripe();

  const teacherProfile = await prisma.teacherProfile.findUniqueOrThrow({
    where: { userId: session.user.id },
    include: { user: true },
  });

  let accountId = teacherProfile.stripeConnectAccountId;
  if (!accountId) {
    const account = await stripe.accounts.create({
      type: "express",
      email: teacherProfile.user.email,
      country: "ES",
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });
    accountId = account.id;
    await prisma.teacherProfile.update({
      where: { id: teacherProfile.id },
      data: { stripeConnectAccountId: accountId },
    });
  }

  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${APP_URL}/panel/pagos`,
    return_url: `${APP_URL}/panel/pagos?onboarded=1`,
    type: "account_onboarding",
  });

  redirect(accountLink.url);
}
