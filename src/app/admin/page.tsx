import type { Metadata } from "next";
import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { getEthicsReports } from "@/lib/ethics";
import {
  setTeacherProfileStatus,
  toggleUserStatus,
  setEthicsReportStatus,
} from "./actions";

export const metadata: Metadata = {
  title: "Administración · TuProfesorParticular",
};

const REPORT_STATUS_LABELS = {
  open: "Abierto",
  reviewed: "Revisado",
  closed: "Cerrado",
};

const REPORT_STATUS_STYLES = {
  open: "bg-red-50 text-red-700",
  reviewed: "bg-amber-50 text-amber-700",
  closed: "bg-stone-100 text-stone-500",
};

export default async function AdminPage() {
  const session = await requireRole("admin");

  const [pendingProfiles, users, ethicsReports] = await Promise.all([
    prisma.teacherProfile.findMany({
      where: { status: "pending" },
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    getEthicsReports(),
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
        <h2 className="text-lg font-semibold text-stone-900">
          Canal ético — reportes ({ethicsReports.filter((r) => r.status === "open").length} abiertos)
        </h2>

        {ethicsReports.length === 0 ? (
          <p className="mt-4 text-sm text-stone-500">No hay reportes todavía.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {ethicsReports.map((report) => (
              <li
                key={report.id}
                className="rounded-xl border border-stone-200 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm text-stone-500">
                      De {report.reporter.name} ({report.reporter.email})
                      {report.teacherProfile && (
                        <>
                          {" "}
                          sobre{" "}
                          <span className="font-medium text-stone-700">
                            {report.teacherProfile.user.name}
                          </span>
                        </>
                      )}
                      {" · "}
                      {report.createdAt.toLocaleDateString("es-ES")}
                    </p>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-stone-800">
                      {report.message}
                    </p>
                  </div>
                  <span
                    className={`flex-shrink-0 rounded-full px-3 py-1 text-xs font-medium ${REPORT_STATUS_STYLES[report.status]}`}
                  >
                    {REPORT_STATUS_LABELS[report.status]}
                  </span>
                </div>

                {report.status !== "closed" && (
                  <div className="mt-3 flex gap-2">
                    {report.status === "open" && (
                      <form action={setEthicsReportStatus}>
                        <input type="hidden" name="reportId" value={report.id} />
                        <input type="hidden" name="status" value="reviewed" />
                        <button
                          type="submit"
                          className="rounded-lg border border-amber-300 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-50"
                        >
                          Marcar como revisado
                        </button>
                      </form>
                    )}
                    <form action={setEthicsReportStatus}>
                      <input type="hidden" name="reportId" value={report.id} />
                      <input type="hidden" name="status" value="closed" />
                      <button
                        type="submit"
                        className="rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-50"
                      >
                        Cerrar
                      </button>
                    </form>
                  </div>
                )}
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
