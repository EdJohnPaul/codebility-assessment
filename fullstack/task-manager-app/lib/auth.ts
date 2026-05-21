import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";

import { decrypt } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export const getSession = cache(async () => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);

  if (!session?.userId) {
    return null;
  }

  return session;
});

export async function getCurrentUser() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  return prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, createdAt: true },
  });
}

export async function requireSession() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  return session;
}
