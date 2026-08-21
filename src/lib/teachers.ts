import type { Level, Modality } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type TeacherSearchFilters = {
  subject?: string;
  category?: string;
  city?: string;
  modality?: Modality;
  level?: Level;
  maxPrice?: number;
};

export function getTeacherSearchResults(filters: TeacherSearchFilters) {
  return prisma.teacherProfile.findMany({
    where: {
      status: "approved",
      ...(filters.modality ? { modality: filters.modality } : {}),
      ...(filters.city
        ? { city: { contains: filters.city, mode: "insensitive" } }
        : {}),
      ...(filters.maxPrice ? { pricePerHour: { lte: filters.maxPrice } } : {}),
      ...(filters.subject || filters.category || filters.level
        ? {
            subjects: {
              some: {
                ...(filters.subject
                  ? { subject: { name: { equals: filters.subject, mode: "insensitive" } } }
                  : {}),
                ...(filters.category
                  ? { subject: { category: { equals: filters.category, mode: "insensitive" } } }
                  : {}),
                ...(filters.level ? { level: filters.level } : {}),
              },
            },
          }
        : {}),
    },
    include: {
      user: { select: { name: true, avatarUrl: true } },
      subjects: { include: { subject: true } },
    },
    // El enum TeacherPlan se declara free < pro < premium, así que ordenar
    // "desc" por plan pone primero a los profesores con suscripción de pago.
    orderBy: [{ plan: "desc" }, { createdAt: "desc" }],
  });
}

export function getTeacherProfileById(id: string) {
  return prisma.teacherProfile.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, avatarUrl: true, email: true } },
      subjects: { include: { subject: true } },
    },
  });
}

export function getAllSubjects() {
  return prisma.subject.findMany({ orderBy: { name: "asc" } });
}

export function getSubjectsByCategory(category: string) {
  return prisma.subject.findMany({
    where: { category: { equals: category, mode: "insensitive" } },
    orderBy: { name: "asc" },
  });
}
