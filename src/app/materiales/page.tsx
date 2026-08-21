import Link from "next/link";
import type { Metadata } from "next";
import { CATEGORIES, MATERIALS_CATEGORY } from "@/lib/constants";
import { getMaterialsByCategory } from "@/lib/materials";

export const metadata: Metadata = {
  title: "Materiales · TuProfesorParticular",
};

type SearchParams = { categoria?: string };

export default async function MaterialesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { categoria } = await searchParams;

  if (!categoria) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-bold text-stone-900">Materiales</h1>
        <p className="mt-2 text-stone-500">
          Apuntes, ejercicios y recursos que comparten los profesores, organizados por área.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              href={`/materiales?categoria=${encodeURIComponent(category.slug)}`}
              className={`rounded-xl border p-6 transition hover:-translate-y-0.5 hover:shadow-md ${category.colors.bg} ${category.colors.border} ${category.colors.ring}`}
            >
              <h2 className={`text-lg font-semibold ${category.colors.text}`}>
                {category.label}
              </h2>
              <p className="mt-1 text-sm text-stone-600">{category.description}</p>
            </Link>
          ))}
        </div>
      </main>
    );
  }

  const category = [...CATEGORIES, MATERIALS_CATEGORY].find(
    (c) => c.slug.toLowerCase() === categoria.toLowerCase(),
  );
  const materials = await getMaterialsByCategory(categoria);

  const materialsBySubject = new Map<string, typeof materials>();
  for (const material of materials) {
    const list = materialsBySubject.get(material.subject.name) ?? [];
    list.push(material);
    materialsBySubject.set(material.subject.name, list);
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Link href="/materiales" className="text-sm text-teal-600 hover:underline">
        ← Todas las categorías
      </Link>
      <h1 className="mt-2 text-3xl font-bold text-stone-900">
        {category?.label ?? categoria}
      </h1>
      <p className="mt-2 text-stone-500">{category?.description}</p>

      {materialsBySubject.size === 0 ? (
        <p className="mt-8 rounded-lg border border-dashed border-stone-300 p-8 text-center text-stone-400">
          Todavía no hay materiales en esta categoría.
        </p>
      ) : (
        <div className="mt-8 space-y-8">
          {[...materialsBySubject.entries()].map(([subjectName, items]) => (
            <section key={subjectName}>
              <h2 className="text-lg font-semibold text-stone-900">{subjectName}</h2>
              <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {items.map((material) => (
                  <li
                    key={material.id}
                    className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm"
                  >
                    <p className="font-medium text-stone-900">{material.title}</p>
                    {material.description && (
                      <p className="mt-1 text-sm text-stone-600">{material.description}</p>
                    )}
                    <p className="mt-2 text-xs text-stone-400">
                      Por {material.teacherProfile.user.name}
                    </p>
                    <a
                      href={material.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-block rounded-lg bg-rose-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-rose-700"
                    >
                      Descargar
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
