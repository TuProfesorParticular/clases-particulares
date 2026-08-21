"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-helpers";

export async function setTeacherProfileStatus(formData: FormData) {
  await requireRole("admin");

  const teacherProfileId = String(formData.get("teacherProfileId"));
  const status = String(formData.get("status"));

  if (status !== "approved" && status !== "rejected") return;

  await prisma.teacherProfile.update({
    where: { id: teacherProfileId },
    data: { status },
  });

  revalidatePath("/admin");
}

export async function toggleUserStatus(formData: FormData) {
  const session = await requireRole("admin");

  const userId = String(formData.get("userId"));
  if (userId === session.user.id) return;

  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });

  await prisma.user.update({
    where: { id: userId },
    data: { status: user.status === "active" ? "suspended" : "active" },
  });

  revalidatePath("/admin");
}

export async function setEthicsReportStatus(formData: FormData) {
  await requireRole("admin");

  const reportId = String(formData.get("reportId"));
  const status = String(formData.get("status"));

  if (status !== "reviewed" && status !== "closed" && status !== "open") return;

  await prisma.ethicsReport.update({
    where: { id: reportId },
    data: { status },
  });

  revalidatePath("/admin");
}
