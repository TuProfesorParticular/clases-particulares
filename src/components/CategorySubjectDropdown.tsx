"use client";

import { useRouter } from "next/navigation";

export default function CategorySubjectDropdown({
  subjects,
  extraParams,
  className,
}: {
  subjects: { id: string; name: string }[];
  extraParams?: Record<string, string>;
  className?: string;
}) {
  const router = useRouter();

  return (
    <select
      defaultValue=""
      onChange={(e) => {
        const value = e.target.value;
        if (!value) return;
        const params = new URLSearchParams({ materia: value, ...extraParams });
        router.push(`/?${params.toString()}`);
      }}
      className={
        className ??
        "mt-3 w-full rounded-lg border border-white bg-white/80 px-2 py-1.5 text-xs text-stone-700"
      }
    >
      <option value="">Ver una materia…</option>
      {subjects.map((subject) => (
        <option key={subject.id} value={subject.name}>
          {subject.name}
        </option>
      ))}
    </select>
  );
}
