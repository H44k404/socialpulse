import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /api/dashboard/analytics)
  const path = request.nextUrl.pathname;

  // Define protected routes that require authentication
  const protectedRoutes = [
    "/api/dashboard",
    "/api/posts",
    "/api/user",
  ];

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));

  if (isProtectedRoute) {
    // Check for authorization header
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authorization header missing or invalid" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const user = verifyToken(token);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Add user info to headers for use in API routes
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", user.userId);
    requestHeaders.set("x-user-email", user.email);
    requestHeaders.set("x-user-name", user.name);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/dashboard/:path*",
    "/api/posts/:path*",
    "/api/user/:path*",
  ],
};