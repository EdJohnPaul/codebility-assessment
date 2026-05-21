import { NextResponse } from "next/server";

import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toTodoDto } from "@/lib/todos";
import { createTodoSchema } from "@/lib/validations";

export async function GET() {
  const session = await requireSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const todos = await prisma.todo.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ todos: todos.map(toTodoDto) });
}

export async function POST(request: Request) {
  const session = await requireSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = createTodoSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    const todo = await prisma.todo.create({
      data: {
        title: parsed.data.title,
        userId: session.userId,
      },
    });

    return NextResponse.json({ todo: toTodoDto(todo) }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
