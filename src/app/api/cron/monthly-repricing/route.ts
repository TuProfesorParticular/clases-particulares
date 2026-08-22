import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { getPlan, getDiscountedPrice } from "@/lib/plans";
import { getPreviousMonthMaterialCount } from "@/lib/materials";

// Se ejecuta una vez al mes (ver vercel.json): recalcula el precio de cada
// suscripción activa según los materiales subidos el mes que acaba de
// terminar. Si un profesor no subió nada, su próxima cuota vuelve al precio
// original del plan — el descuento nunca queda fijado para siempre.
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (!stripe) {
    return NextResponse.json({ skipped: "Stripe no configurado" });
  }

  const teacherProfiles = await prisma.teacherProfile.findMany({
    where: {
      plan: { in: ["pro", "premium"] },
      stripeSubscriptionId: { not: null },
      subscriptionStatus: "active",
    },
  });

  const results: { teacherProfileId: string; newPrice: number }[] = [];

  for (const teacherProfile of teacherProfiles) {
    if (!teacherProfile.stripeSubscriptionId) continue;

    const plan = getPlan(teacherProfile.plan);
    const materialsLastMonth = await getPreviousMonthMaterialCount(teacherProfile.id);
    const newPrice = getDiscountedPrice(plan.price, materialsLastMonth);

    const subscription = await stripe.subscriptions.retrieve(
      teacherProfile.stripeSubscriptionId,
    );
    const item = subscription.items.data[0];
    if (!item) continue;

    await stripe.subscriptions.update(teacherProfile.stripeSubscriptionId, {
      items: [
        {
          id: item.id,
          price_data: {
            currency: "eur",
            unit_amount: Math.round(newPrice * 100),
            recurring: { interval: "month" },
            product: typeof item.price.product === "string" ? item.price.product : item.price.product.id,
          },
        },
      ],
      proration_behavior: "none",
    });

    results.push({ teacherProfileId: teacherProfile.id, newPrice });
  }

  return NextResponse.json({ updated: results.length, results });
}
