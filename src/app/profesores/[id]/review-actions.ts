"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

export type ReviewState = {
  success?: boolean;
  error?: string;
};

export async function submitReview(
  _prevState: ReviewState,
  formData: FormData,
): Promise<ReviewState> {
  const session = await requireSession();
  const teacherProfileId = String(formData.get("teacherProfileId") || "");

  const parsed = schema.safeParse({
    rating: formData.get("rating"),
    comment: formData.get("comment") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const booking = await prisma.booking.findUnique({
    where: {
      studentId_teacherProfileId: {
        studentId: session.user.id,
        teacherProfileId,
      },
    },
  });

  if (!booking || booking.status !== "paid") {
    return {
      error: "Solo puedes valorar a un profesor tras reservar y pagar tu primera clase.",
    };
  }

  await prisma.review.upsert({
    where: {
      studentId_teacherProfileId: {
        studentId: session.user.id,
        teacherProfileId,
      },
    },
    create: {
      studentId: session.user.id,
      teacherProfileId,
      rating: parsed.data.rating,
      comment: parsed.data.comment,
    },
    update: {
      rating: parsed.data.rating,
      comment: parsed.data.comment,
    },
  });

  revalidatePath(`/profesores/${teacherProfileId}`);

  return { success: true };
}
