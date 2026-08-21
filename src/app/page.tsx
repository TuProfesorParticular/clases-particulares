import Link from "next/link";
import type { Modality, Level } from "@prisma/client";
import { getAllSubjects, getTeacherSearchResults } from "@/lib/teachers";
import { CATEGORIES, MATERIALS_CATEGORY } from "@/lib/constants";
import SearchFilters from "@/components/SearchFilters";
import TeacherCard from "@/components/TeacherCard";

type SearchParams = {
  materia?: string;
  categoria?: string;
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
      category: params.categoria || undefined,
      city: params.ciudad || undefined,
      modality: (params.modalidad as Modality) || undefined,
      level: (params.nivel as Level) || undefined,
      maxPrice: params.precioMax ? Number(params.precioMax) : undefined,
    }),
  ]);

  const activeCategory = CATEGORIES.find(
    (c) => c.slug.toLowerCase() === params.categoria?.toLowerCase(),
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <section className="text-center">
        <h1 className="text-3xl font-bold text-stone-900 sm:text-4xl">
          Encuentra tu profesor particular ideal
        </h1>
        <p className="mt-2 text-stone-500">
          Busca por materia, ubicación o modalidad y contacta directamente.
        </p>
      </section>

      <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {CATEGORIES.map((category) => (
          <Link
            key={category.slug}
            href={`/?categoria=${encodeURIComponent(category.slug)}`}
            className={`rounded-xl border p-5 transition hover:-translate-y-0.5 hover:shadow-md ${category.colors.bg} ${category.colors.border} ${category.colors.ring}`}
          >
            <h2 className={`font-semibold ${category.colors.text}`}>{category.label}</h2>
            <p className="mt-1 text-xs text-stone-600">{category.description}</p>
          </Link>
        ))}
        <Link
          href="/materiales"
          className={`rounded-xl border p-5 transition hover:-translate-y-0.5 hover:shadow-md ${MATERIALS_CATEGORY.colors.bg} ${MATERIALS_CATEGORY.colors.border} ${MATERIALS_CATEGORY.colors.ring}`}
        >
          <h2 className={`font-semibold ${MATERIALS_CATEGORY.colors.text}`}>
            {MATERIALS_CATEGORY.label}
          </h2>
          <p className="mt-1 text-xs text-stone-600">{MATERIALS_CATEGORY.description}</p>
        </Link>
      </section>

      <section className="mt-10">
        <SearchFilters subjects={subjects} defaultValues={params} />
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-stone-500">
            {teachers.length}{" "}
            {teachers.length === 1 ? "profesor encontrado" : "profesores encontrados"}
            {activeCategory && (
              <>
                {" "}
                en <span className="font-medium">{activeCategory.label}</span>
              </>
            )}
          </p>
          {activeCategory && (
            <Link href="/" className="text-sm text-teal-600 hover:underline">
              Quitar filtro de categoría
            </Link>
          )}
        </div>

        {teachers.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {teachers.map((teacher) => (
              <TeacherCard key={teacher.id} teacher={teacher} />
            ))}
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-stone-300 p-8 text-center text-stone-400">
            No hay profesores que coincidan con tu búsqueda todavía.
          </p>
        )}
      </section>
    </main>
  );
}
