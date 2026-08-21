import { prisma } from "@/lib/prisma";

export function getMaterialsByCategory(category: string) {
  return prisma.material.findMany({
    where: { subject: { category: { equals: category, mode: "insensitive" } } },
    include: {
      subject: true,
      teacherProfile: { include: { user: { select: { name: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export function getMaterialsBySubject(subjectId: string) {
  return prisma.material.findMany({
    where: { subjectId },
    include: {
      subject: true,
      teacherProfile: { include: { user: { select: { name: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export function getMaterialsForTeacher(teacherProfileId: string) {
  return prisma.material.findMany({
    where: { teacherProfileId },
    include: { subject: true },
    orderBy: { createdAt: "desc" },
  });
}
