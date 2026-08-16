"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const body = Object.fromEntries(new FormData(event.currentTarget));
    const response = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = await response.json();
    setLoading(false);
    if (!response.ok) {
      setError(result.message ?? "Something went wrong.");
      return;
    }
    router.push("/todos");
    router.refresh();
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-4 rounded-2xl border border-border bg-white p-6 shadow-sm"
    >
      {mode === "register" && (
        <label className="field">
          <span>Name</span>
          <input
            name="name"
            autoComplete="name"
            placeholder="Alex Morgan"
            required
          />
        </label>
      )}
      <label className="field">
        <span>Email</span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
        />
      </label>
      <label className="field">
        <span>Password</span>
        <input
          name="password"
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          placeholder="At least 8 characters"
          required
        />
      </label>
      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {error}
        </p>
      )}
      <button
        disabled={loading}
        className="h-11 w-full rounded-lg bg-primary font-medium text-primary-foreground disabled:opacity-60"
      >
        {loading
          ? "Please wait…"
          : mode === "login"
            ? "Sign in"
            : "Create account"}
      </button>
      <p className="text-center text-sm text-muted-foreground">
        {mode === "login" ? "New to Taskly? " : "Already have an account? "}
        <Link
          className="font-medium text-primary hover:underline"
          href={mode === "login" ? "/register" : "/login"}
        >
          {mode === "login" ? "Create one" : "Sign in"}
        </Link>
      </p>
    </form>
  );
}
