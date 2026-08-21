"use client";

import { useActionState } from "react";
import { registerUser, type RegisterState } from "./actions";

const initialState: RegisterState = {};

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(
    registerUser,
    initialState,
  );

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <fieldset>
        <legend className="mb-2 text-sm font-medium text-stone-700">
          Quiero registrarme como
        </legend>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex cursor-pointer items-center justify-center rounded-lg border border-stone-300 px-4 py-3 text-sm font-medium has-[:checked]:border-teal-600 has-[:checked]:bg-teal-50 has-[:checked]:text-teal-700">
            <input
              type="radio"
              name="role"
              value="student"
              defaultChecked
              className="sr-only"
            />
            Alumno
          </label>
          <label className="flex cursor-pointer items-center justify-center rounded-lg border border-stone-300 px-4 py-3 text-sm font-medium has-[:checked]:border-teal-600 has-[:checked]:bg-teal-50 has-[:checked]:text-teal-700">
            <input
              type="radio"
              name="role"
              value="teacher"
              className="sr-only"
            />
            Profesor
          </label>
        </div>
      </fieldset>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-stone-700">
          Nombre completo
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          minLength={2}
          className="mt-1 block w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-stone-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1 block w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-stone-700">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          className="mt-1 block w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
        />
        <p className="mt-1 text-xs text-stone-400">Mínimo 8 caracteres.</p>
      </div>

      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-60"
      >
        {isPending ? "Creando cuenta…" : "Crear cuenta"}
      </button>
    </form>
  );
}
