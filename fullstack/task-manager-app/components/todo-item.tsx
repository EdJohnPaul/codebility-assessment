"use client";

import { useState } from "react";

import type { TodoDto } from "@/lib/definitions";

interface TodoItemProps {
  todo: TodoDto;
  onUpdated: () => void;
  onDeleted: () => void;
}

function formatDate(isoDate: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(isoDate));
}

export function TodoItem({ todo, onUpdated, onDeleted }: TodoItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggleComplete() {
    setError(null);
    setIsUpdating(true);

    try {
      const response = await fetch(`/api/todos/${todo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !todo.completed }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error ?? "Failed to update todo");
        return;
      }

      onUpdated();
    } catch {
      setError("Failed to update todo");
    } finally {
      setIsUpdating(false);
    }
  }

  async function deleteTodo() {
    setError(null);
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/todos/${todo.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error ?? "Failed to delete todo");
        return;
      }

      onDeleted();
    } catch {
      setError("Failed to delete todo");
    } finally {
      setIsDeleting(false);
    }
  }

  const isBusy = isUpdating || isDeleting;

  return (
    <li className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-1 gap-3">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={toggleComplete}
            disabled={isBusy}
            aria-label={`Mark "${todo.title}" as ${todo.completed ? "incomplete" : "complete"}`}
            className="mt-1 h-4 w-4 shrink-0 rounded border-zinc-300"
          />
          <div className="min-w-0 space-y-1">
            <p
              className={`text-sm font-medium break-words ${
                todo.completed
                  ? "text-zinc-500 line-through dark:text-zinc-400"
                  : "text-zinc-900 dark:text-zinc-100"
              }`}
            >
              {todo.title}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Created {formatDate(todo.createdAt)}
            </p>
            <span
              className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                todo.completed
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                  : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
              }`}
            >
              {todo.completed ? "Complete" : "Incomplete"}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={toggleComplete}
            disabled={isBusy}
            className="inline-flex h-9 items-center justify-center rounded-lg border border-zinc-300 px-3 text-sm font-medium transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            {isUpdating
              ? "Saving..."
              : todo.completed
                ? "Mark incomplete"
                : "Mark complete"}
          </button>
          <button
            type="button"
            onClick={deleteTodo}
            disabled={isBusy}
            className="inline-flex h-9 items-center justify-center rounded-lg border border-red-200 px-3 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      {error ? (
        <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : null}
    </li>
  );
}
