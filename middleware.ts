import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
	// 1. Get the session cookie
	// Note: We'll set this cookie in our Server Action later
	const session = request.cookies.get("session");

	// 2. Define protected routes
	const protectedRoutes = [
		"/dashboard",
		"/loans",
		"/marketplace",
		"/profile",
		"/messages",
		"/orders",
		"/notifications",
	];

	// 3. Check if the current path is a protected route
	const isProtectedRoute = protectedRoutes.some((route) =>
		request.nextUrl.pathname.startsWith(route)
	);

	// 4. Redirect unauthenticated users
	if (isProtectedRoute && !session) {
		// Redirect to login page
		return NextResponse.redirect(new URL("/login", request.url));
	}

	// 5. (Optional) Redirect authenticated users away from /login and /register
	if (
		(request.nextUrl.pathname === "/login" ||
			request.nextUrl.pathname === "/register") &&
		session
	) {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}

	return NextResponse.next();
}

// Configure which paths the middleware runs on
export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public folder
		 */
		"/((?!api|_next/static|_next/image|favicon.ico).*)",
	],
};
