import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-stone-500 sm:flex-row">
        <p>© {new Date().getFullYear()} TuProfesorParticular</p>
        <div className="flex gap-5">
          <Link href="/materiales" className="hover:text-stone-700">
            Materiales
          </Link>
          <Link href="/canal-etico" className="hover:text-stone-700">
            Canal ético
          </Link>
        </div>
      </div>
    </footer>
  );
}
