import type { Metadata } from "next";
import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { getAllSubjects } from "@/lib/teachers";
import { getMaterialsForTeacher } from "@/lib/materials";
import { MATERIAL_COURSE_LABELS } from "@/lib/constants";
import UploadMaterialForm from "./UploadMaterialForm";
import { deleteMaterial } from "./actions";

export const metadata: Metadata = {
  title: "Mis materiales · TuProfesorParticular",
};

export default async function MisMaterialesPage() {
  const session = await requireRole("teacher");

  const teacherProfile = await prisma.teacherProfile.findUniqueOrThrow({
    where: { userId: session.user.id },
  });

  const [subjects, materials] = await Promise.all([
    getAllSubjects(),
    getMaterialsForTeacher(teacherProfile.id),
  ]);

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold text-stone-900">Mis materiales</h1>
      <p className="mt-1 text-sm text-stone-500">
        Comparte apuntes, ejercicios o guías con los alumnos. Se publican en la sección{" "}
        <span className="font-medium">Materiales</span>, agrupados por materia.
      </p>

      <div className="mt-6 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <UploadMaterialForm subjects={subjects} />
      </div>

      <div className="mt-8">
        <h2 className="text-sm font-semibold text-stone-900">
          Materiales publicados ({materials.length})
        </h2>
        <ul className="mt-3 space-y-2">
          {materials.map((material) => (
            <li
              key={material.id}
              className="flex items-center justify-between rounded-lg border border-stone-200 bg-white px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-stone-900">{material.title}</p>
                <p className="text-xs text-stone-500">
                  {material.subject.name} · {MATERIAL_COURSE_LABELS[material.course]}
                </p>
              </div>
              <form action={deleteMaterial}>
                <input type="hidden" name="materialId" value={material.id} />
                <button
                  type="submit"
                  className="ml-3 flex-shrink-0 text-xs font-medium text-red-600 hover:underline"
                >
                  Eliminar
                </button>
              </form>
            </li>
          ))}
          {materials.length === 0 && (
            <p className="rounded-lg border border-dashed border-stone-300 p-6 text-center text-sm text-stone-400">
              Todavía no has subido ningún material.
            </p>
          )}
        </ul>
      </div>
    </main>
  );
}
