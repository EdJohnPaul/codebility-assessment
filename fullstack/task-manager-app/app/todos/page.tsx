import { redirect } from "next/navigation";

import { SignOutButton } from "@/components/sign-out-button";
import { TodoList } from "@/components/todo-list";
import { getCurrentUser, getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toTodoDto } from "@/lib/todos";

export const metadata = {
  title: "Todos | Task Manager",
};

export default async function TodosPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const todos = await prisma.todo.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-full bg-zinc-50 dark:bg-black">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-10 sm:px-6">
        <header className="flex flex-col gap-4 border-b border-zinc-200 pb-6 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Task Manager
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">Your todos</h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Signed in as {user.email}
            </p>
          </div>
          <SignOutButton />
        </header>

        <TodoList initialTodos={todos.map(toTodoDto)} />
      </div>
    </main>
  );
}
