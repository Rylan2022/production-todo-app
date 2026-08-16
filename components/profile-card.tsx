"use client";

import { CalendarDays, Mail, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/app-shell";

type User = { name: string; email: string; role: string; createdAt: string };
export function ProfileCard() {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    fetch("/api/auth/me").then(async (r) => {
      if (r.ok) setUser((await r.json()).data);
    });
  }, []);
  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <PageHeader
        eyebrow="Account"
        title="Your profile"
        description="Your personal details and workspace access."
      />
      {!user ? (
        <div className="h-48 animate-pulse rounded-2xl bg-muted" />
      ) : (
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <div className="mb-7 flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-full bg-secondary text-xl font-semibold text-primary">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="font-semibold">{user.name}</h2>
              <p className="text-sm text-muted-foreground">
                {user.role === "ADMIN" ? "Administrator" : "Member"}
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-muted/50 p-4">
              <Mail className="mb-3 size-4 text-primary" />
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="mt-1 text-sm font-medium">{user.email}</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4">
              <CalendarDays className="mb-3 size-4 text-primary" />
              <p className="text-xs text-muted-foreground">Member since</p>
              <p className="mt-1 text-sm font-medium">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4">
              <UserRound className="mb-3 size-4 text-primary" />
              <p className="text-xs text-muted-foreground">Role</p>
              <p className="mt-1 text-sm font-medium">{user.role}</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
