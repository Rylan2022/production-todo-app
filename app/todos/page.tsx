import { AppShell } from "@/components/app-shell";
import { TodoWorkspace } from "@/components/todo-workspace";
import { getCurrentUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function TodosPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <AppShell>
      <TodoWorkspace />
    </AppShell>
  );
}
