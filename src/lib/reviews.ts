import { prisma } from "@/lib/prisma";

export async function getReviewsForTeacher(teacherProfileId: string) {
  const reviews = await prisma.review.findMany({
    where: { teacherProfileId },
    include: { student: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  const average =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : null;

  return { reviews, average, count: reviews.length };
}

export function getFeaturedReviews(limit = 6) {
  return prisma.review.findMany({
    where: { comment: { not: null } },
    include: {
      student: { select: { name: true } },
      teacherProfile: { select: { user: { select: { name: true } } } },
    },
    orderBy: [{ rating: "desc" }, { createdAt: "desc" }],
    take: limit,
  });
}
