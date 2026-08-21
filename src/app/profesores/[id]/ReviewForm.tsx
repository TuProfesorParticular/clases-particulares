"use client";

import { useActionState, useState } from "react";
import { submitReview, type ReviewState } from "./review-actions";

const initialState: ReviewState = {};

export default function ReviewForm({
  teacherProfileId,
  existingRating,
  existingComment,
}: {
  teacherProfileId: string;
  existingRating?: number;
  existingComment?: string | null;
}) {
  const [state, formAction, isPending] = useActionState(submitReview, initialState);
  const [rating, setRating] = useState(existingRating ?? 5);

  return (
    <form action={formAction} className="rounded-xl border border-stone-200 bg-white p-4">
      <input type="hidden" name="teacherProfileId" value={teacherProfileId} />
      <input type="hidden" name="rating" value={rating} />

      <p className="text-sm font-medium text-stone-700">
        {existingRating ? "Edita tu valoración" : "Deja tu valoración"}
      </p>

      <div className="mt-2 flex gap-1" role="radiogroup" aria-label="Puntuación">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setRating(value)}
            aria-label={`${value} estrellas`}
            className={`text-2xl leading-none ${
              value <= rating ? "text-amber-400" : "text-stone-300"
            }`}
          >
            ★
          </button>
        ))}
      </div>

      <textarea
        name="comment"
        rows={3}
        maxLength={1000}
        defaultValue={existingComment ?? ""}
        placeholder="Cuenta tu experiencia (opcional)"
        className="mt-3 block w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
      />

      {state.error && (
        <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="mt-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          ¡Gracias por tu valoración!
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="mt-3 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-60"
      >
        {isPending ? "Enviando…" : "Enviar valoración"}
      </button>
    </form>
  );
}
