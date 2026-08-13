"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth-helpers";
import { sendNewMessageEmail } from "@/lib/mailer";

const APP_URL = process.env.APP_URL || "http://localhost:3000";

export async function startConversation(formData: FormData) {
  const session = await requireSession();
  const teacherProfileId = String(formData.get("teacherProfileId"));

  const teacherProfile = await prisma.teacherProfile.findUniqueOrThrow({
    where: { id: teacherProfileId },
  });

  if (teacherProfile.userId === session.user.id) {
    redirect(`/profesores/${teacherProfileId}`);
  }

  const conversation = await prisma.conversation.upsert({
    where: {
      studentId_teacherId: {
        studentId: session.user.id,
        teacherId: teacherProfile.userId,
      },
    },
    update: {},
    create: {
      studentId: session.user.id,
      teacherId: teacherProfile.userId,
    },
  });

  redirect(`/panel/mensajes/${conversation.id}`);
}

export async function sendMessage(formData: FormData) {
  const session = await requireSession();
  const conversationId = String(formData.get("conversationId"));
  const body = String(formData.get("body") ?? "").trim();

  if (!body) return;

  const conversation = await prisma.conversation.findUniqueOrThrow({
    where: { id: conversationId },
    include: {
      student: { select: { id: true, email: true, name: true } },
      teacher: { select: { id: true, email: true, name: true } },
    },
  });

  if (
    conversation.studentId !== session.user.id &&
    conversation.teacherId !== session.user.id
  ) {
    throw new Error("No autorizado");
  }

  await prisma.message.create({
    data: {
      conversationId,
      senderId: session.user.id,
      body,
    },
  });

  const recipient =
    conversation.studentId === session.user.id
      ? conversation.teacher
      : conversation.student;
  const sender =
    conversation.studentId === session.user.id
      ? conversation.student
      : conversation.teacher;

  await sendNewMessageEmail(
    recipient.email,
    sender.name,
    `${APP_URL}/panel/mensajes/${conversationId}`,
  );

  revalidatePath(`/panel/mensajes/${conversationId}`);
}
