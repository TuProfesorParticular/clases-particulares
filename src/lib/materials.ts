import type { MaterialCourse } from "@prisma/client";
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

export function getMaterialsByCategoryAndCourse(category: string, course: MaterialCourse) {
  return prisma.material.findMany({
    where: {
      course,
      subject: { category: { equals: category, mode: "insensitive" } },
    },
    include: {
      subject: true,
      teacherProfile: { include: { user: { select: { name: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getMaterialCountsByCourse(category: string) {
  const materials = await prisma.material.findMany({
    where: { subject: { category: { equals: category, mode: "insensitive" } } },
    select: { course: true },
  });

  const counts = new Map<MaterialCourse, number>();
  for (const material of materials) {
    counts.set(material.course, (counts.get(material.course) ?? 0) + 1);
  }
  return counts;
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
