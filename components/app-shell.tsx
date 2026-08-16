"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CheckSquare, CircleUserRound, LogOut, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

type User = { id: string; name: string; email: string; role: "USER" | "ADMIN" };

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me").then(async (response) => {
      if (response.ok) setUser((await response.json()).data);
    });
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
  }

  const links = [
    { href: "/todos", label: "My tasks" },
    ...(user?.role === "ADMIN"
      ? [{ href: "/admin/users", label: "Users" }]
      : []),
    { href: "/profile", label: "Profile" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/70 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Link
            href="/todos"
            className="flex items-center gap-2 font-semibold tracking-tight"
            onClick={() => setOpen(false)}
          >
            <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <CheckSquare className="size-4" />
            </span>
            Taskly
          </Link>
          <button
            className="rounded-lg p-2 md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X /> : <Menu />}
          </button>
          <nav
            className={`${open ? "absolute inset-x-0 top-16 z-20 flex border-b bg-white p-5" : "hidden"} flex-col gap-3 md:static md:flex md:flex-row md:items-center md:border-0 md:bg-transparent md:p-0`}
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2 text-sm ${pathname.startsWith(link.href) ? "bg-secondary font-medium text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <button
                onClick={logout}
                className="flex items-center gap-2 px-3 py-2 text-left text-sm text-muted-foreground hover:text-foreground"
              >
                <LogOut className="size-4" /> Sign out
              </button>
            ) : (
              <Link
                href="/login"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                Sign in
              </Link>
            )}
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-xl text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function AuthFrame({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <CircleUserRound />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 text-muted-foreground">{subtitle}</p>
        </div>
        {children}
      </div>
    </main>
  );
}
