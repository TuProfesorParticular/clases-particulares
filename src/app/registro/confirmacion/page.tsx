import Link from "next/link";

export default function ConfirmacionRegistroPage() {
  return (
    <main className="mx-auto max-w-md px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-slate-900">¡Cuenta creada!</h1>
      <p className="mt-3 text-slate-600">
        Te hemos enviado un email de verificación. Confírmalo para activar tu
        cuenta por completo.
      </p>
      <p className="mt-1 text-xs text-slate-400">
        (El envío real de emails se activa al configurar EMAIL_SERVER en el
        proyecto — ver .env.example.)
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
      >
        Ir a buscar profesores
      </Link>
    </main>
  );
}
