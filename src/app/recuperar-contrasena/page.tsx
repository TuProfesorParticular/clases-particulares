import type { Metadata } from "next";
import ForgotPasswordForm from "./ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Recuperar contraseña · ClasesParticulares",
};

export default function RecuperarContrasenaPage() {
  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-bold text-slate-900">
        Recuperar contraseña
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Introduce tu email y te enviaremos un enlace para elegir una nueva
        contraseña.
      </p>

      <ForgotPasswordForm />
    </main>
  );
}
