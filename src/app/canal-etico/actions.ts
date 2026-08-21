"use server";

import { z } from "zod";
import { requireSession } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  teacherProfileId: z.string().optional(),
  message: z.string().min(20, "Cuéntanos con algo más de detalle qué ha ocurrido (mínimo 20 caracteres)").max(3000),
});

export type EthicsReportState = {
  success?: boolean;
  error?: string;
};

export async function submitEthicsReport(
  _prevState: EthicsReportState,
  formData: FormData,
): Promise<EthicsReportState> {
  const session = await requireSession();

  const parsed = schema.safeParse({
    teacherProfileId: formData.get("teacherProfileId") || undefined,
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  await prisma.ethicsReport.create({
    data: {
      reporterId: session.user.id,
      teacherProfileId: parsed.data.teacherProfileId || null,
      message: parsed.data.message,
    },
  });

  return { success: true };
}
