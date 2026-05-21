import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { decryptSession } from "@/lib/session-edge";

const protectedRoutes = ["/todos"];
const authRoutes = ["/login", "/signup"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("session")?.value;
  const session = await decryptSession(sessionCookie);

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isApiTodosRoute = pathname.startsWith("/api/todos");

  if (isApiTodosRoute && !session?.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (isProtectedRoute && !session?.userId) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && session?.userId) {
    return NextResponse.redirect(new URL("/todos", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/todos/:path*", "/login", "/signup", "/api/todos/:path*"],
};
