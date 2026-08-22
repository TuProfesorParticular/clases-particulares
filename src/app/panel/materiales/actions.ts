"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-helpers";
import { uploadMaterialFile, deleteMaterialFile } from "@/lib/storage";
import { MATERIAL_COURSE_ORDER } from "@/lib/constants";

const schema = z.object({
  title: z.string().min(2, "Introduce un título").max(200),
  description: z.string().max(1000).optional(),
  subjectId: z.string().min(1, "Selecciona una materia"),
  course: z.enum(MATERIAL_COURSE_ORDER as [string, ...string[]], {
    message: "Selecciona un curso",
  }),
});

export type UploadMaterialState = {
  success?: boolean;
  error?: string;
};

export async function uploadMaterial(
  _prevState: UploadMaterialState,
  formData: FormData,
): Promise<UploadMaterialState> {
  const session = await requireRole("teacher");

  const parsed = schema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    subjectId: formData.get("subjectId"),
    course: formData.get("course"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Selecciona un archivo" };
  }

  const teacherProfile = await prisma.teacherProfile.findUniqueOrThrow({
    where: { userId: session.user.id },
  });

  const { fileUrl, fileName } = await uploadMaterialFile(teacherProfile.id, file);

  await prisma.material.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      subjectId: parsed.data.subjectId,
      course: parsed.data.course as (typeof MATERIAL_COURSE_ORDER)[number],
      teacherProfileId: teacherProfile.id,
      fileUrl,
      fileName,
    },
  });

  revalidatePath("/panel/materiales");
  revalidatePath("/materiales");

  return { success: true };
}

export async function deleteMaterial(formData: FormData) {
  const session = await requireRole("teacher");
  const materialId = String(formData.get("materialId") || "");

  const material = await prisma.material.findUnique({
    where: { id: materialId },
    include: { teacherProfile: true },
  });

  if (!material || material.teacherProfile.userId !== session.user.id) {
    return;
  }

  await prisma.material.delete({ where: { id: materialId } });
  await deleteMaterialFile(material.fileUrl);

  revalidatePath("/panel/materiales");
  revalidatePath("/materiales");
}
