import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth-helpers";

export default async function PanelPage() {
  const session = await requireSession();

  if (session.user.role === "admin") redirect("/admin");
  if (session.user.role === "teacher") redirect("/panel/perfil");
  redirect("/panel/mensajes");
}
