"use client";

import { useActionState, useRef, useEffect } from "react";
import type { Subject } from "@prisma/client";
import { MATERIAL_COURSE_LABELS, MATERIAL_COURSE_ORDER } from "@/lib/constants";
import { uploadMaterial, type UploadMaterialState } from "./actions";

const initialState: UploadMaterialState = {};

const fieldClass =
  "mt-1 block w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500";

export default function UploadMaterialForm({ subjects }: { subjects: Subject[] }) {
  const [state, formAction, isPending] = useActionState(uploadMaterial, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-stone-700">
          Título
        </label>
        <input id="title" name="title" type="text" required maxLength={200} className={fieldClass} />
      </div>

      <div>
        <label htmlFor="subjectId" className="block text-sm font-medium text-stone-700">
          Materia
        </label>
        <select id="subjectId" name="subjectId" required className={fieldClass}>
          <option value="">Selecciona una materia</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.category} · {subject.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="course" className="block text-sm font-medium text-stone-700">
          Curso
        </label>
        <select id="course" name="course" required className={fieldClass}>
          <option value="">Selecciona un curso</option>
          {MATERIAL_COURSE_ORDER.map((course) => (
            <option key={course} value={course}>
              {MATERIAL_COURSE_LABELS[course]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-stone-700">
          Descripción (opcional)
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          maxLength={1000}
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="file" className="block text-sm font-medium text-stone-700">
          Archivo (PDF, Word, PowerPoint o imagen — máx. 20MB)
        </label>
        <input
          id="file"
          name="file"
          type="file"
          required
          accept=".pdf,.doc,.docx,.ppt,.pptx,image/png,image/jpeg"
          className="mt-1 block w-full text-sm text-stone-600 file:mr-4 file:rounded-lg file:border-0 file:bg-rose-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-rose-700 hover:file:bg-rose-100"
        />
      </div>

      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.error}</p>
      )}
      {state.success && (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Material subido correctamente.
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-60"
      >
        {isPending ? "Subiendo…" : "Subir material"}
      </button>
    </form>
  );
}
