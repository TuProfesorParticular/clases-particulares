import Link from "next/link";
import { prisma } from "@/lib/prisma";

type SearchParams = {
  token?: string;
  email?: string;
};

export default async function VerificarEmailPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { token, email } = await searchParams;

  let success = false;

  if (token && email) {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (
      verificationToken &&
      verificationToken.identifier === email &&
      verificationToken.expires > new Date()
    ) {
      await prisma.$transaction([
        prisma.user.update({
          where: { email },
          data: { emailVerified: new Date() },
        }),
        prisma.verificationToken.delete({ where: { token } }),
      ]);
      success = true;
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-16 text-center">
      {success ? (
        <>
          <h1 className="text-2xl font-bold text-stone-900">
            Email verificado
          </h1>
          <p className="mt-3 text-stone-600">
            Tu cuenta ha sido verificada correctamente. Ya puedes iniciar
            sesión.
          </p>
          <Link
            href="/iniciar-sesion"
            className="mt-6 inline-block rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
          >
            Iniciar sesión
          </Link>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold text-stone-900">
            Enlace no válido
          </h1>
          <p className="mt-3 text-stone-600">
            El enlace de verificación no es válido o ha caducado.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
          >
            Ir al inicio
          </Link>
        </>
      )}
    </main>
  );
}
