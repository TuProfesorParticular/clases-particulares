"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-helpers";
import { canContactStudents } from "@/lib/plans";

export async function contactStudent(formData: FormData) {
  const session = await requireRole("teacher");
  const requestId = String(formData.get("requestId") || "");

  const teacherProfile = await prisma.teacherProfile.findUniqueOrThrow({
    where: { userId: session.user.id },
  });

  if (!canContactStudents(teacherProfile.plan)) {
    redirect("/panel/suscripcion?motivo=contactar-alumnos");
  }

  const request = await prisma.studentRequest.findUniqueOrThrow({
    where: { id: requestId },
  });

  const conversation = await prisma.conversation.upsert({
    where: {
      studentId_teacherId: {
        studentId: request.studentId,
        teacherId: session.user.id,
      },
    },
    update: {},
    create: {
      studentId: request.studentId,
      teacherId: session.user.id,
    },
  });

  redirect(`/panel/mensajes/${conversation.id}`);
}
