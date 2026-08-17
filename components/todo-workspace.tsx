"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Circle,
  Edit3,
  ListFilter,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/app-shell";

export type Todo = {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

export function TodoWorkspace() {
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  async function load() {
    setLoading(true);
    const r = await fetch("/api/todos");
    const data = await r.json();
    if (r.status === 401) {
      router.push("/login");
      return;
    }
    if (!r.ok) setError(data.message ?? "Could not load tasks.");
    else setTodos(data.data);
    setLoading(false);
  }
  useEffect(() => {
    let active = true;
    fetch("/api/todos").then(async (r) => {
      const data = await r.json();
      if (!active) return;
      if (r.status === 401) {
        router.push("/login");
        return;
      }
      if (!r.ok) setError(data.message ?? "Could not load tasks.");
      else setTodos(data.data);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [router]);
  const visible = useMemo(
    () =>
      todos.filter(
        (todo) =>
          (filter === "all" ||
            (filter === "open" ? !todo.completed : todo.completed)) &&
          `${todo.title} ${todo.description ?? ""}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [todos, query, filter],
  );
  async function toggle(todo: Todo) {
    const r = await fetch(`/api/todos/${todo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !todo.completed }),
    });
    if (r.ok)
      setTodos((current) =>
        current.map((item) =>
          item.id === todo.id ? { ...item, completed: !item.completed } : item,
        ),
      );
  }
  async function remove(todo: Todo) {
    if (!window.confirm(`Delete “${todo.title}”?`)) return;
    const r = await fetch(`/api/todos/${todo.id}`, { method: "DELETE" });
    if (r.ok)
      setTodos((current) => current.filter((item) => item.id !== todo.id));
  }
  async function add(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    const body = Object.fromEntries(new FormData(event.currentTarget));
    const r = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await r.json();
    setSaving(false);
    if (!r.ok) {
      setError(data.message ?? "Could not create task.");
      return;
    }
    setTodos((current) => [data.data, ...current]);
    setShowAdd(false);
  }
  const openCount = todos.filter((todo) => !todo.completed).length;
  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <PageHeader
        eyebrow="Your workspace"
        title="Make space for what matters."
        description={`${openCount} ${openCount === 1 ? "task" : "tasks"} still to do.`}
        action={
          <button
            onClick={() => setShowAdd(true)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground"
          >
            <Plus className="size-4" /> Add task
          </button>
        }
      />
      {showAdd && (
        <form
          onSubmit={add}
          className="mb-6 grid gap-3 rounded-2xl border border-primary/30 bg-secondary/40 p-5 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
        >
          <label className="field sm:col-span-1">
            <span>Task title</span>
            <input
              name="title"
              autoFocus
              placeholder="What needs doing?"
              required
            />
          </label>
          <label className="field">
            <span>
              Description{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </span>
            <input name="description" placeholder="Add a little context" />
          </label>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="h-10 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground"
            >
              {saving ? "Adding…" : "Add"}
            </button>
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="h-10 rounded-lg border px-4 text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search tasks…"
            className="h-10 w-full rounded-lg border border-border bg-white pl-9 pr-3 text-sm outline-none focus:border-primary"
          />
        </div>
        <div className="flex items-center gap-2">
          <ListFilter className="size-4 text-muted-foreground" />
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="h-10 rounded-lg border border-border bg-white px-3 text-sm"
          >
            <option value="all">All tasks</option>
            <option value="open">To do</option>
            <option value="done">Completed</option>
          </select>
        </div>
      </div>
      {error && (
        <div
          role="alert"
          className="mb-5 flex items-center justify-between rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
          <button
            onClick={() => {
              setError("");
              load();
            }}
            className="font-medium underline"
          >
            Retry
          </button>
        </div>
      )}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-24 animate-pulse rounded-2xl bg-muted"
            />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-white px-6 py-16 text-center">
          <CheckCircle2 className="mx-auto mb-3 size-10 text-primary/50" />
          <h2 className="font-semibold">
            {todos.length === 0 ? "Your list is clear" : "No matching tasks"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {todos.length === 0
              ? "Add your first task and turn an intention into progress."
              : "Try another search or filter."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((todo) => (
            <article
              key={todo.id}
              className={`group flex gap-3 rounded-2xl border bg-white p-4 shadow-sm transition ${todo.completed ? "border-border/60" : "border-border hover:border-primary/40"}`}
            >
              <button
                onClick={() => toggle(todo)}
                aria-label={
                  todo.completed ? "Mark as incomplete" : "Mark as complete"
                }
                className="mt-0.5 shrink-0 text-primary"
              >
                {todo.completed ? (
                  <CheckCircle2 className="size-5" />
                ) : (
                  <Circle className="size-5 text-muted-foreground group-hover:text-primary" />
                )}
              </button>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/todos/${todo.id}`}
                  className={`font-medium hover:text-primary ${todo.completed ? "text-muted-foreground line-through" : ""}`}
                >
                  {todo.title}
                </Link>
                {todo.description && (
                  <p className="mt-1 truncate text-sm text-muted-foreground">
                    {todo.description}
                  </p>
                )}
                <p className="mt-2 text-xs text-muted-foreground">
                  {new Date(todo.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="flex shrink-0 items-start gap-1 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
                <Link
                  href={`/todos/${todo.id}`}
                  className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                  aria-label="Edit task"
                >
                  <Edit3 className="size-4" />
                </Link>
                <button
                  onClick={() => remove(todo)}
                  className="rounded-lg p-2 text-muted-foreground hover:bg-red-50 hover:text-red-600"
                  aria-label="Delete task"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
