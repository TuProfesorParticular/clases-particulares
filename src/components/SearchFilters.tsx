import type { Subject } from "@prisma/client";
import { LEVEL_LABELS, LEVEL_ORDER, MODALITY_LABELS } from "@/lib/constants";

type SearchFiltersProps = {
  subjects: Subject[];
  defaultValues: {
    materia?: string;
    ciudad?: string;
    modalidad?: string;
    nivel?: string;
    precioMax?: string;
  };
};

const selectClass =
  "rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

export default function SearchFilters({
  subjects,
  defaultValues,
}: SearchFiltersProps) {
  return (
    <form className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-5">
      <select
        name="materia"
        defaultValue={defaultValues.materia ?? ""}
        className={selectClass}
      >
        <option value="">Todas las materias</option>
        {subjects.map((subject) => (
          <option key={subject.id} value={subject.name}>
            {subject.name}
          </option>
        ))}
      </select>

      <input
        name="ciudad"
        type="text"
        placeholder="Ciudad"
        defaultValue={defaultValues.ciudad ?? ""}
        className={selectClass}
      />

      <select
        name="modalidad"
        defaultValue={defaultValues.modalidad ?? ""}
        className={selectClass}
      >
        <option value="">Cualquier modalidad</option>
        {Object.entries(MODALITY_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <select
        name="nivel"
        defaultValue={defaultValues.nivel ?? ""}
        className={selectClass}
      >
        <option value="">Cualquier nivel</option>
        {LEVEL_ORDER.map((level) => (
          <option key={level} value={level}>
            {LEVEL_LABELS[level]}
          </option>
        ))}
      </select>

      <input
        name="precioMax"
        type="number"
        min="0"
        placeholder="Precio máx. €/h"
        defaultValue={defaultValues.precioMax ?? ""}
        className={selectClass}
      />

      <button
        type="submit"
        className="col-span-full rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700 sm:col-span-5"
      >
        Buscar
      </button>
    </form>
  );
}
