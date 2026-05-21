import type { Todo } from "@prisma/client";

import type { TodoDto } from "@/lib/definitions";

export function toTodoDto(todo: Todo): TodoDto {
  return {
    id: todo.id,
    title: todo.title,
    completed: todo.completed,
    createdAt: todo.createdAt.toISOString(),
  };
}
