import type { Modality, Level } from "@prisma/client";
import { getAllSubjects, getTeacherSearchResults } from "@/lib/teachers";
import SearchFilters from "@/components/SearchFilters";
import TeacherCard from "@/components/TeacherCard";

type SearchParams = {
  materia?: string;
  ciudad?: string;
  modalidad?: string;
  nivel?: string;
  precioMax?: string;
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const [subjects, teachers] = await Promise.all([
    getAllSubjects(),
    getTeacherSearchResults({
      subject: params.materia || undefined,
      city: params.ciudad || undefined,
      modality: (params.modalidad as Modality) || undefined,
      level: (params.nivel as Level) || undefined,
      maxPrice: params.precioMax ? Number(params.precioMax) : undefined,
    }),
  ]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <section className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
          Encuentra tu profesor particular ideal
        </h1>
        <p className="mt-2 text-slate-500">
          Busca por materia, ubicación o modalidad y contacta directamente.
        </p>
      </section>

      <section className="mt-8">
        <SearchFilters subjects={subjects} defaultValues={params} />
      </section>

      <section className="mt-10">
        <p className="mb-4 text-sm text-slate-500">
          {teachers.length}{" "}
          {teachers.length === 1 ? "profesor encontrado" : "profesores encontrados"}
        </p>

        {teachers.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {teachers.map((teacher) => (
              <TeacherCard key={teacher.id} teacher={teacher} />
            ))}
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-400">
            No hay profesores que coincidan con tu búsqueda todavía.
          </p>
        )}
      </section>
    </main>
  );
}
