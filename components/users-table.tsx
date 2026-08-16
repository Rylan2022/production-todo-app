"use client";

import { Users } from "lucide-react";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/app-shell";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  _count: { todos: number };
};
export function UsersTable() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [state, setState] = useState("loading");
  useEffect(() => {
    fetch("/api/admin/users").then(async (r) => {
      const data = await r.json();
      if (!r.ok) setState(data.message ?? "Unable to load users");
      else {
        setUsers(data.data);
        setState("ready");
      }
    });
  }, []);
  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <PageHeader
        eyebrow="Administration"
        title="Users"
        description="A quick view of everyone using the workspace."
      />
      {state !== "ready" ? (
        <div className="rounded-2xl border bg-white p-8 text-sm text-muted-foreground">
          {state === "loading" ? "Loading users…" : state}
        </div>
      ) : users.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-12 text-center">
          <Users className="mx-auto mb-3 text-muted-foreground" />
          No users yet.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-5 py-4">User</th>
                  <th className="px-5 py-4">Role</th>
                  <th className="px-5 py-4">Tasks</th>
                  <th className="px-5 py-4">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-5 py-4">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-muted-foreground">{user.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-4">{user._count.todos}</td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}
