import { AppShell } from "@/components/app-shell";
import { UsersTable } from "@/components/users-table";

export default function AdminUsersPage() {
  return (
    <AppShell>
      <UsersTable />
    </AppShell>
  );
}
