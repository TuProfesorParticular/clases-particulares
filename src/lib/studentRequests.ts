import { prisma } from "@/lib/prisma";

export function getStudentRequestsForStudent(studentId: string) {
  return prisma.studentRequest.findMany({
    where: { studentId },
    include: { subject: true },
    orderBy: { createdAt: "desc" },
  });
}

export function getOpenStudentRequests(subjectId?: string) {
  return prisma.studentRequest.findMany({
    where: {
      status: "open",
      ...(subjectId ? { subjectId } : {}),
    },
    include: { subject: true, student: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });
}
