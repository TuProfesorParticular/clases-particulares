import Link from "next/link";
import Image from "next/image";
import type { Prisma } from "@prisma/client";
import { MODALITY_LABELS } from "@/lib/constants";

export type TeacherCardData = Prisma.TeacherProfileGetPayload<{
  include: {
    user: { select: { name: true; avatarUrl: true } };
    subjects: { include: { subject: true } };
  };
}>;

export default function TeacherCard({ teacher }: { teacher: TeacherCardData }) {
  const subjectNames = [...new Set(teacher.subjects.map((s) => s.subject.name))];

  return (
    <Link
      href={`/profesores/${teacher.id}`}
      className="flex flex-col rounded-xl border border-stone-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-stone-100 text-lg font-semibold text-stone-500">
          {teacher.user.avatarUrl ? (
            <Image
              src={teacher.user.avatarUrl}
              alt={teacher.user.name}
              width={48}
              height={48}
              className="h-full w-full object-cover"
            />
          ) : (
            teacher.user.name.charAt(0).toUpperCase()
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate font-semibold text-stone-900">
              {teacher.user.name}
            </p>
            {teacher.plan !== "free" && (
              <span className="flex-shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                Destacado
              </span>
            )}
          </div>
          <p className="truncate text-sm text-stone-500">
            {teacher.city ?? MODALITY_LABELS[teacher.modality]}
          </p>
        </div>
      </div>

      {teacher.bio && (
        <p className="mt-3 line-clamp-2 text-sm text-stone-600">{teacher.bio}</p>
      )}

      <div className="mt-3 flex flex-wrap gap-1.5">
        {subjectNames.slice(0, 3).map((name) => (
          <span
            key={name}
            className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700"
          >
            {name}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3">
        <span className="text-sm text-stone-500">
          {MODALITY_LABELS[teacher.modality]}
        </span>
        <span className="text-lg font-bold text-stone-900">
          {Number(teacher.pricePerHour)}€
          <span className="text-sm font-normal text-stone-400">/h</span>
        </span>
      </div>
    </Link>
  );
}
