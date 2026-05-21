"use client";

import { useState } from "react";

import { TodoForm } from "@/components/todo-form";
import { TodoItem } from "@/components/todo-item";
import type { TodoDto } from "@/lib/definitions";

interface TodoListProps {
  initialTodos: TodoDto[];
}

export function TodoList({ initialTodos }: TodoListProps) {
  const [todos, setTodos] = useState<TodoDto[]>(initialTodos);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadTodos() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/todos");

      if (!response.ok) {
        const data = await response.json();
        setError(data.error ?? "Failed to load todos");
        return;
      }

      const data = await response.json();
      setTodos(data.todos);
    } catch {
      setError("Failed to load todos");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="mb-4 text-lg font-semibold">Add a new todo</h2>
        <TodoForm onCreated={loadTodos} />
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">Your todos</h2>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            {todos.length} {todos.length === 1 ? "item" : "items"}
          </span>
        </div>

        {isLoading ? (
          <div className="rounded-xl border border-dashed border-zinc-300 px-4 py-10 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            Refreshing todos...
          </div>
        ) : null}

        {error ? (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
          >
            {error}
          </div>
        ) : null}

        {!isLoading && !error && todos.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 px-4 py-10 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            No todos yet. Add your first task above.
          </div>
        ) : null}

        {!isLoading && !error && todos.length > 0 ? (
          <ul className="space-y-3">
            {todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onUpdated={loadTodos}
                onDeleted={loadTodos}
              />
            ))}
          </ul>
        ) : null}
      </section>
    </div>
  );
}
