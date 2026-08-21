import { prisma } from "@/lib/prisma";

export function getEthicsReports() {
  return prisma.ethicsReport.findMany({
    include: {
      reporter: { select: { name: true, email: true } },
      teacherProfile: { include: { user: { select: { name: true } } } },
    },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });
}
