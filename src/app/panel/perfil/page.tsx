import type { Metadata } from "next";
import Link from "next/link";
import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { getAllSubjects } from "@/lib/teachers";
import EditProfileForm from "./EditProfileForm";

export const metadata: Metadata = {
  title: "Mi anuncio · ClasesParticulares",
};

const STATUS_LABELS = {
  pending: "Pendiente de aprobación",
  approved: "Publicado",
  rejected: "Rechazado",
};

const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-700",
  approved: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-700",
};

export default async function EditarPerfilPage() {
  const session = await requireRole("teacher");

  const [teacherProfile, allSubjects] = await Promise.all([
    prisma.teacherProfile.findUniqueOrThrow({
      where: { userId: session.user.id },
      include: { subjects: true },
    }),
    getAllSubjects(),
  ]);

  const selectedSubjectIds = [
    ...new Set(teacherProfile.subjects.map((s) => s.subjectId)),
  ];
  const selectedLevels = [
    ...new Set(teacherProfile.subjects.map((s) => s.level)),
  ];

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Mi anuncio</h1>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[teacherProfile.status]}`}
        >
          {STATUS_LABELS[teacherProfile.status]}
        </span>
      </div>
      <p className="mt-1 text-sm text-slate-500">
        Este es tu perfil público. {teacherProfile.status === "pending" && "Un administrador debe aprobarlo antes de que aparezca en las búsquedas."}
        {teacherProfile.status === "approved" && (
          <>
            {" "}
            <Link href={`/profesores/${teacherProfile.id}`} className="text-blue-600 hover:underline">
              Ver mi anuncio público
            </Link>
          </>
        )}
      </p>

      <EditProfileForm
        teacherProfile={teacherProfile}
        allSubjects={allSubjects}
        selectedSubjectIds={selectedSubjectIds}
        selectedLevels={selectedLevels}
      />
    </main>
  );
}
