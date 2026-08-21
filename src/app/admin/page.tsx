import type { Metadata } from "next";
import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { setTeacherProfileStatus, toggleUserStatus } from "./actions";

export const metadata: Metadata = {
  title: "Administración · ClasesParticulares",
};

export default async function AdminPage() {
  const session = await requireRole("admin");

  const [pendingProfiles, users] = await Promise.all([
    prisma.teacherProfile.findMany({
      where: { status: "pending" },
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-bold text-stone-900">Administración</h1>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-stone-900">
          Anuncios pendientes de aprobación ({pendingProfiles.length})
        </h2>

        {pendingProfiles.length === 0 ? (
          <p className="mt-4 text-sm text-stone-500">
            No hay anuncios pendientes.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {pendingProfiles.map((profile) => (
              <li
                key={profile.id}
                className="flex items-center justify-between gap-4 rounded-xl border border-stone-200 bg-white p-4"
              >
                <div className="min-w-0">
                  <p className="font-medium text-stone-900">
                    {profile.user.name}{" "}
                    <span className="font-normal text-stone-400">
                      · {profile.user.email}
                    </span>
                  </p>
                  <p className="truncate text-sm text-stone-500">
                    {profile.bio || "(sin presentación todavía)"}
                  </p>
                </div>
                <div className="flex flex-shrink-0 gap-2">
                  <form action={setTeacherProfileStatus}>
                    <input type="hidden" name="teacherProfileId" value={profile.id} />
                    <input type="hidden" name="status" value="approved" />
                    <button
                      type="submit"
                      className="rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700"
                    >
                      Aprobar
                    </button>
                  </form>
                  <form action={setTeacherProfileStatus}>
                    <input type="hidden" name="teacherProfileId" value={profile.id} />
                    <input type="hidden" name="status" value="rejected" />
                    <button
                      type="submit"
                      className="rounded-lg border border-red-300 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      Rechazar
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-stone-900">Usuarios</h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-stone-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-stone-100 text-stone-500">
              <tr>
                <th className="px-4 py-2 font-medium">Nombre</th>
                <th className="px-4 py-2 font-medium">Email</th>
                <th className="px-4 py-2 font-medium">Rol</th>
                <th className="px-4 py-2 font-medium">Estado</th>
                <th className="px-4 py-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2 text-stone-500">{user.email}</td>
                  <td className="px-4 py-2 text-stone-500">{user.role}</td>
                  <td className="px-4 py-2">
                    <span
                      className={
                        user.status === "active"
                          ? "rounded-full bg-green-50 px-2 py-0.5 text-xs text-green-700"
                          : "rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-700"
                      }
                    >
                      {user.status === "active" ? "Activo" : "Suspendido"}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right">
                    {user.id !== session.user.id && (
                      <form action={toggleUserStatus}>
                        <input type="hidden" name="userId" value={user.id} />
                        <button
                          type="submit"
                          className="text-xs font-medium text-teal-600 hover:underline"
                        >
                          {user.status === "active" ? "Suspender" : "Reactivar"}
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
