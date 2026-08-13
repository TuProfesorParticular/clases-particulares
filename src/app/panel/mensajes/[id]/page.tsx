import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { requireSession } from "@/lib/auth-helpers";
import { getConversationForUser } from "@/lib/messages";
import { sendMessage } from "../actions";

export const metadata: Metadata = {
  title: "Conversación · ClasesParticulares",
};

export default async function ConversacionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireSession();
  const { id } = await params;
  const conversation = await getConversationForUser(id, session.user.id);

  if (!conversation) {
    notFound();
  }

  const otherParty =
    conversation.studentId === session.user.id
      ? conversation.teacher
      : conversation.student;

  return (
    <main className="mx-auto flex h-[calc(100vh-73px)] max-w-2xl flex-col px-4 py-6">
      <Link href="/panel/mensajes" className="text-sm text-blue-600 hover:underline">
        ← Volver a mensajes
      </Link>
      <h1 className="mt-2 text-xl font-bold text-slate-900">
        {otherParty.name}
      </h1>

      <div className="mt-4 flex-1 space-y-3 overflow-y-auto rounded-xl border border-slate-200 bg-white p-4">
        {conversation.messages.length === 0 && (
          <p className="text-center text-sm text-slate-400">
            Escribe el primer mensaje para iniciar la conversación.
          </p>
        )}
        {conversation.messages.map((message) => {
          const isOwn = message.senderId === session.user.id;
          return (
            <div
              key={message.id}
              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                  isOwn
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-800"
                }`}
              >
                {message.body}
              </div>
            </div>
          );
        })}
      </div>

      <form action={sendMessage} className="mt-4 flex gap-2">
        <input type="hidden" name="conversationId" value={conversation.id} />
        <input
          name="body"
          type="text"
          required
          placeholder="Escribe un mensaje…"
          autoComplete="off"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Enviar
        </button>
      </form>
    </main>
  );
}
