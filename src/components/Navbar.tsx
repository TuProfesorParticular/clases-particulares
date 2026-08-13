import Link from "next/link";
import { auth } from "@/lib/auth";
import { logout } from "@/app/actions";

export default async function Navbar() {
  const session = await auth();

  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold text-slate-900">
          Clases<span className="text-blue-600">Particulares</span>
        </Link>
        <div className="flex items-center gap-4 text-sm font-medium">
          <Link href="/" className="text-slate-600 hover:text-slate-900">
            Buscar profesores
          </Link>

          {session?.user ? (
            <>
              <Link href="/panel" className="text-slate-600 hover:text-slate-900">
                Mi panel
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50"
                >
                  Cerrar sesión
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/iniciar-sesion" className="text-slate-600 hover:text-slate-900">
                Iniciar sesión
              </Link>
              <Link
                href="/registro"
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
