import type { Metadata } from "next";
import ResetPasswordForm from "./ResetPasswordForm";

export const metadata: Metadata = {
  title: "Restablecer contraseña · ClasesParticulares",
};

export default async function RestablecerContrasenaPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-bold text-stone-900">
        Elige una nueva contraseña
      </h1>

      {token ? (
        <ResetPasswordForm token={token} />
      ) : (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          Enlace no válido. Solicita uno nuevo desde la página de recuperación.
        </p>
      )}
    </main>
  );
}
