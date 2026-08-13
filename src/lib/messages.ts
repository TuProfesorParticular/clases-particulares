import { prisma } from "@/lib/prisma";

export function getConversationsForUser(userId: string) {
  return prisma.conversation.findMany({
    where: { OR: [{ studentId: userId }, { teacherId: userId }] },
    include: {
      student: { select: { id: true, name: true } },
      teacher: { select: { id: true, name: true } },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getConversationForUser(
  conversationId: string,
  userId: string,
) {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      student: { select: { id: true, name: true } },
      teacher: { select: { id: true, name: true } },
      messages: {
        orderBy: { createdAt: "asc" },
        include: { sender: { select: { id: true, name: true } } },
      },
    },
  });

  if (!conversation) return null;
  if (conversation.studentId !== userId && conversation.teacherId !== userId) {
    return null;
  }

  return conversation;
}
