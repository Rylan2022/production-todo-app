"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, Circle, Trash2 } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { PageHeader } from "@/components/app-shell";
import type { Todo } from "@/components/todo-workspace";

export function TodoDetail({ id }: { id: string }) {
  const [todo, setTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    fetch(`/api/todos/${id}`).then(async (r) => {
      const data = await r.json();
      if (!r.ok) setError(data.message ?? "Task not found.");
      else setTodo(data.data);
      setLoading(false);
    });
  }, [id]);
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    const body = Object.fromEntries(new FormData(event.currentTarget));
    const r = await fetch(`/api/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await r.json();
    setSaving(false);
    if (!r.ok) setError(data.message ?? "Could not save changes.");
    else setTodo(data.data);
  }
  async function remove() {
    if (!window.confirm("Delete this task permanently?")) return;
    const r = await fetch(`/api/todos/${id}`, { method: "DELETE" });
    if (r.ok) window.location.href = "/todos";
  }
  if (loading)
    return (
      <main className="mx-auto max-w-3xl px-5 py-10">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
      </main>
    );
  if (!todo)
    return (
      <main className="mx-auto max-w-3xl px-5 py-20 text-center">
        <p className="text-red-600">{error || "Task not found."}</p>
        <Link
          href="/todos"
          className="mt-4 inline-block text-sm text-primary underline"
        >
          Back to tasks
        </Link>
      </main>
    );
  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <Link
        href="/todos"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to tasks
      </Link>
      <PageHeader
        eyebrow="Task details"
        title="Edit task"
        description="Keep the next step clear and actionable."
        action={
          <button
            onClick={remove}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-red-200 px-4 text-sm text-red-600 hover:bg-red-50"
          >
            <Trash2 className="size-4" /> Delete
          </button>
        }
      />
      <form
        onSubmit={save}
        className="space-y-5 rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-7"
      >
        <button
          type="button"
          onClick={async () => {
            const r = await fetch(`/api/todos/${id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ completed: !todo.completed }),
            });
            if (r.ok) setTodo((await r.json()).data);
          }}
          className="flex items-center gap-2 text-sm font-medium text-primary"
        >
          {todo.completed ? (
            <CheckCircle2 className="size-5" />
          ) : (
            <Circle className="size-5" />
          )}
          {todo.completed ? "Completed" : "Mark as completed"}
        </button>
        <label className="field">
          <span>Title</span>
          <input name="title" defaultValue={todo.title} required />
        </label>
        <label className="field">
          <span>Description</span>
          <textarea
            name="description"
            defaultValue={todo.description ?? ""}
            rows={5}
            placeholder="What does done look like?"
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          disabled={saving}
          className="h-11 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>
    </main>
  );
}
