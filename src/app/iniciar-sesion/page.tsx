import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Iniciar sesión · ClasesParticulares",
};

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-bold text-stone-900">Iniciar sesión</h1>
      <p className="mt-1 text-sm text-stone-500">
        ¿Aún no tienes cuenta?{" "}
        <Link href="/registro" className="text-teal-600 hover:underline">
          Regístrate
        </Link>
      </p>

      <LoginForm />
    </main>
  );
}
