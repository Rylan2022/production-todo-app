import { AppShell } from "@/components/app-shell";
import { TodoDetail } from "@/components/todo-detail";

export default async function TodoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <AppShell>
      <TodoDetail id={id} />
    </AppShell>
  );
}
