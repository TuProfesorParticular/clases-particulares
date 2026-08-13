import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTeacherProfileById } from "@/lib/teachers";
import { LEVEL_LABELS, MODALITY_LABELS } from "@/lib/constants";
import { auth } from "@/lib/auth";
import { startConversation } from "@/app/panel/mensajes/actions";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const teacher = await getTeacherProfileById(id);

  return {
    title: teacher
      ? `${teacher.user.name} · ClasesParticulares`
      : "Profesor no encontrado",
  };
}

export default async function TeacherProfilePage({ params }: PageProps) {
  const { id } = await params;
  const [teacher, session] = await Promise.all([
    getTeacherProfileById(id),
    auth(),
  ]);

  if (!teacher || teacher.status !== "approved") {
    notFound();
  }

  const isOwnProfile = session?.user?.id === teacher.userId;

  const levelsBySubject = new Map<string, string[]>();
  for (const teacherSubject of teacher.subjects) {
    const levels = levelsBySubject.get(teacherSubject.subject.name) ?? [];
    levels.push(LEVEL_LABELS[teacherSubject.level]);
    levelsBySubject.set(teacherSubject.subject.name, levels);
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/" className="text-sm text-blue-600 hover:underline">
        ← Volver a la búsqueda
      </Link>

      <div className="mt-4 flex flex-col gap-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-start">
        <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-2xl font-semibold text-slate-500">
          {teacher.user.name.charAt(0).toUpperCase()}
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-slate-900">
            {teacher.user.name}
          </h1>
          <p className="text-slate-500">
            {teacher.city ? `${teacher.city} · ` : ""}
            {MODALITY_LABELS[teacher.modality]}
          </p>

          <p className="mt-4 text-slate-700">
            {teacher.bio || "Este profesor todavía no ha añadido una presentación."}
          </p>

          {levelsBySubject.size > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {[...levelsBySubject.entries()].map(([subject, levels]) => (
                <span
                  key={subject}
                  className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700"
                >
                  {subject} · {levels.join(", ")}
                </span>
              ))}
            </div>
          )}

          {teacher.experienceText && (
            <div className="mt-5">
              <h2 className="text-sm font-semibold text-slate-900">
                Titulación y experiencia
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                {teacher.experienceText}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-shrink-0 flex-col items-center gap-3 rounded-lg border border-slate-100 p-4 sm:items-end">
          <p className="text-2xl font-bold text-slate-900">
            {Number(teacher.pricePerHour)}€
            <span className="text-sm font-normal text-slate-400">/hora</span>
          </p>
          {session?.user ? (
            isOwnProfile ? (
              <p className="text-center text-xs text-slate-400 sm:text-right">
                Este es tu propio anuncio.
              </p>
            ) : (
              <form action={startConversation} className="w-full sm:w-auto">
                <input type="hidden" name="teacherProfileId" value={teacher.id} />
                <button
                  type="submit"
                  className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto"
                >
                  Contactar
                </button>
              </form>
            )
          ) : (
            <>
              <Link
                href={`/iniciar-sesion`}
                className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto"
              >
                Contactar
              </Link>
              <p className="text-center text-xs text-slate-400 sm:text-right">
                Necesitas una cuenta para contactar con el profesor.
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
