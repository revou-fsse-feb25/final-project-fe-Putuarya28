import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose"; // <-- Add this

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET; // Make sure this is set

/**
 * @param {NextRequest} request - The incoming request object
 * @returns {NextResponse} - Either a redirect response or passes the request through
 */

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  console.log(`Middleware processing request to: ${path}`);

  // Check for authentication in two possible places:
  // 1. The specific authToken cookie (set by our custom logic)
  // 2. The next-auth.session-token cookie (set by NextAuth.js)
  const authToken = request.cookies.get("authToken")?.value;
  const sessionToken = request.cookies.get("next-auth.session-token")?.value;
  let userRole = null;

  if (sessionToken && NEXTAUTH_SECRET) {
    try {
      const { payload } = await jwtVerify(
        sessionToken,
        new TextEncoder().encode(NEXTAUTH_SECRET)
      );
      userRole = payload.role as string | null;
    } catch {
      userRole = null;
    }
  }

  // User is authenticated if either token exists
  const isAuthenticated = Boolean(authToken || sessionToken);

  // === ADD THIS DEBUG LOG HERE ===
  console.log("MIDDLEWARE DEBUG", {
    path,
    isAuthenticated,
    userRole,
    sessionToken,
    authToken,
  });
  // ===============================

  // Define public paths that don't require authentication
  const publicPaths = [
    "/login",
    "/register",
    "/about",
    "/api/auth/error",
    "/api/register",
  ]; // ADD /api/register
  const isPublicPath =
    publicPaths.includes(path) ||
    path.startsWith("/api/auth") ||
    path.startsWith("/design") ||
    path.startsWith("/fabrics") ||
    path.startsWith("/measurement") ||
    path === "/";

  // Check if user is trying to access a protected route without authentication
  if (!isPublicPath && !isAuthenticated) {
    // Create the URL for the login page with a redirect parameter
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", path);

    console.log(`Redirecting unauthenticated user to login from ${path}`);

    // Redirect to login page with return URL
    return NextResponse.redirect(loginUrl);
  }

  console.log(path);

  // Redirect already authenticated users away from login/register pages
  if (
    isPublicPath &&
    isAuthenticated &&
    (path === "/login" || path === "/register")
  ) {
    // Redirect based on role
    if (userRole === "admin") {
      return NextResponse.redirect(new URL("/dashboard-admin", request.url));
    } else {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // For demonstration purposes, log authentication status
  console.log(
    `Access granted to ${path}, auth status: ${
      isAuthenticated ? "authenticated" : "public route"
    }`
  );

  // Continue with the request if the route is public or user is authenticated
  return NextResponse.next();
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    // Exclude static assets and images from middleware
    "/((?!_next/static|_next/image|favicon.ico|images).*)",
  ],
};
