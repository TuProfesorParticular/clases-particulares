import Link from "next/link";
import type { Modality, Level } from "@prisma/client";
import { getAllSubjects, getTeacherSearchResults } from "@/lib/teachers";
import { CATEGORIES, MATERIALS_CATEGORY, UNIVERSITY_SECTION } from "@/lib/constants";
import SearchFilters from "@/components/SearchFilters";
import TeacherCard from "@/components/TeacherCard";
import PricingSection from "@/components/PricingSection";
import Testimonials from "@/components/Testimonials";
import FeaturedTeachers from "@/components/FeaturedTeachers";

type SearchParams = {
  materia?: string;
  categoria?: string;
  ciudad?: string;
  modalidad?: string;
  nivel?: string;
  precioMax?: string;
};

const CATEGORY_ICONS: Record<string, string> = {
  Ciencias: "🔬",
  Humanidades: "📚",
  Oposiciones: "🏛️",
  "Cursos oficiales": "🌍",
  Universidad: "🎓",
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const hasActiveSearch = Boolean(
    params.materia ||
      params.categoria ||
      params.ciudad ||
      params.modalidad ||
      params.nivel ||
      params.precioMax,
  );

  const activeCategory = CATEGORIES.find(
    (c) => c.slug.toLowerCase() === params.categoria?.toLowerCase(),
  );
  const isUniversityFilter = !activeCategory && params.nivel === "universidad";

  const [subjects, teachers] = await Promise.all([
    getAllSubjects(),
    hasActiveSearch
      ? getTeacherSearchResults({
          subject: params.materia || undefined,
          category: params.categoria || undefined,
          city: params.ciudad || undefined,
          modality: (params.modalidad as Modality) || undefined,
          level: (params.nivel as Level) || undefined,
          maxPrice: params.precioMax ? Number(params.precioMax) : undefined,
        })
      : Promise.resolve(null),
  ]);

  return (
    <>
      <section className="relative overflow-hidden border-b border-stone-200 bg-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-teal-200/40 blur-3xl"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-16 text-center sm:py-20">
          <h1 className="text-4xl font-extrabold tracking-tight text-stone-900 sm:text-6xl">
            Encuentra tu profesor particular{" "}
            <span className="text-teal-600">ideal.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-stone-500">
            Busca por materia, ubicación o modalidad y contacta directamente.
            Sin intermediarios innecesarios, sin letra pequeña.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              href={`/?categoria=${encodeURIComponent(category.slug)}`}
              className={`rounded-2xl border p-5 transition hover:-translate-y-1 hover:shadow-lg ${category.colors.bg} ${category.colors.border} ${category.colors.ring}`}
            >
              <span className="text-2xl">{CATEGORY_ICONS[category.slug]}</span>
              <h2 className={`mt-2 text-lg font-bold ${category.colors.text}`}>
                {category.label}
              </h2>
              <p className="mt-1 text-xs text-stone-600">{category.description}</p>
            </Link>
          ))}

          <Link
            href="/?nivel=universidad"
            className={`rounded-2xl border p-5 transition hover:-translate-y-1 hover:shadow-lg ${UNIVERSITY_SECTION.colors.bg} ${UNIVERSITY_SECTION.colors.border} ${UNIVERSITY_SECTION.colors.ring}`}
          >
            <span className="text-2xl">{CATEGORY_ICONS.Universidad}</span>
            <h2 className={`mt-2 text-lg font-bold ${UNIVERSITY_SECTION.colors.text}`}>
              {UNIVERSITY_SECTION.label}
            </h2>
            <p className="mt-1 text-xs text-stone-600">
              {UNIVERSITY_SECTION.description}
            </p>
          </Link>

          <Link
            href="/materiales"
            className={`rounded-2xl border p-5 transition hover:-translate-y-1 hover:shadow-lg ${MATERIALS_CATEGORY.colors.bg} ${MATERIALS_CATEGORY.colors.border} ${MATERIALS_CATEGORY.colors.ring}`}
          >
            <span className="text-2xl">📁</span>
            <h2 className={`mt-2 text-lg font-bold ${MATERIALS_CATEGORY.colors.text}`}>
              {MATERIALS_CATEGORY.label}
            </h2>
            <p className="mt-1 text-xs text-stone-600">
              {MATERIALS_CATEGORY.description}
            </p>
          </Link>
        </section>

        <FeaturedTeachers />

        {hasActiveSearch && (
          <>
            <section className="mt-10">
              <Link href="/" className="text-sm text-teal-600 hover:underline">
                ← Todas las categorías
              </Link>
              <div className="mt-3">
                <SearchFilters subjects={subjects} defaultValues={params} />
              </div>
            </section>

            <section className="mt-10">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-stone-500">
                  {teachers?.length ?? 0}{" "}
                  {teachers?.length === 1 ? "profesor encontrado" : "profesores encontrados"}
                  {activeCategory && (
                    <>
                      {" "}
                      en <span className="font-medium">{activeCategory.label}</span>
                    </>
                  )}
                  {isUniversityFilter && (
                    <>
                      {" "}
                      en <span className="font-medium">Universidad</span>
                    </>
                  )}
                </p>
              </div>

              {teachers && teachers.length > 0 ? (
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
          </>
        )}

        <Testimonials />

        <PricingSection />
      </main>
    </>
  );
}
