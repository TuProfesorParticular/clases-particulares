import type { Metadata } from "next";
import { requireSession } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import EthicsReportForm from "./EthicsReportForm";

export const metadata: Metadata = {
  title: "Canal ético · TuProfesorParticular",
};

export default async function CanalEticoPage({
  searchParams,
}: {
  searchParams: Promise<{ profesor?: string }>;
}) {
  await requireSession();
  const { profesor } = await searchParams;

  const teacherProfile = profesor
    ? await prisma.teacherProfile.findUnique({
        where: { id: profesor },
        include: { user: { select: { name: true } } },
      })
    : null;

  return (
    <main className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-2xl font-bold text-stone-900">Canal ético</h1>
      <p className="mt-2 text-sm text-stone-600">
        Si un profesor no ha cumplido con lo que ofrecía, ha tenido un
        comportamiento inadecuado, o crees que se ha vulnerado alguna norma de
        la plataforma, cuéntanoslo aquí. Todos los reportes los revisa
        directamente el equipo de administración de forma confidencial.
      </p>

      <div className="mt-6">
        <EthicsReportForm
          teacherName={teacherProfile?.user.name}
          teacherProfileId={teacherProfile?.id}
        />
      </div>
    </main>
  );
}
