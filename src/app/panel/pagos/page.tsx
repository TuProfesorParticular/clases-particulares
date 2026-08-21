import type { Metadata } from "next";
import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { PLATFORM_FEE_PERCENT } from "@/lib/plans";
import { startConnectOnboarding } from "./actions";

export const metadata: Metadata = {
  title: "Cobros · ClasesParticulares",
};

export default async function PagosPage({
  searchParams,
}: {
  searchParams: Promise<{ onboarded?: string }>;
}) {
  const session = await requireRole("teacher");
  const { onboarded } = await searchParams;

  let teacherProfile = await prisma.teacherProfile.findUniqueOrThrow({
    where: { userId: session.user.id },
  });

  // Al volver de Stripe, refrescamos el estado por si el webhook aún no ha llegado.
  if (onboarded && stripe && teacherProfile.stripeConnectAccountId) {
    const account = await stripe.accounts.retrieve(teacherProfile.stripeConnectAccountId);
    const isOnboarded = Boolean(account.details_submitted && account.charges_enabled);
    if (isOnboarded !== teacherProfile.stripeConnectOnboarded) {
      teacherProfile = await prisma.teacherProfile.update({
        where: { id: teacherProfile.id },
        data: { stripeConnectOnboarded: isOnboarded },
      });
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold text-stone-900">Cobros</h1>
      <p className="mt-1 text-sm text-stone-500">
        Conecta tu cuenta bancaria para poder cobrar la primera clase de tus
        alumnos a través de la plataforma. La plataforma retiene un{" "}
        {PLATFORM_FEE_PERCENT}% de comisión sobre esa primera reserva; el
        resto se transfiere directamente a tu cuenta.
      </p>

      <div className="mt-6 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        {teacherProfile.stripeConnectOnboarded ? (
          <p className="flex items-center gap-2 text-sm font-medium text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Cuenta conectada y verificada. Ya puedes recibir reservas de pago.
          </p>
        ) : (
          <>
            <p className="text-sm text-stone-600">
              Todavía no has conectado ninguna cuenta de pago. La gestiona
              Stripe directamente (verificación de identidad y cuenta
              bancaria) — nosotros nunca vemos tus datos bancarios.
            </p>
            <form action={startConnectOnboarding} className="mt-4">
              <button
                type="submit"
                className="rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
              >
                Conectar cuenta de Stripe
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
