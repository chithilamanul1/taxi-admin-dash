import { NextResponse } from "next/server";

export function middleware(request) {
    const token =
        request.cookies.get("next-auth.session-token") ||
        request.cookies.get("__Secure-next-auth.session-token");

    const { pathname } = request.nextUrl;

    // Allow public routes explicitly
    if (
        pathname.startsWith("/login") ||
        pathname.startsWith("/api") ||
        pathname.startsWith("/_next") ||
        pathname === "/"
    ) {
        return NextResponse.next();
    }

    // Protect admin routes
    if (pathname.startsWith("/admin") && !token) {
        if (pathname === "/admin/login") {
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // If trying to access login page while logged in, redirect to dashboard
    if (pathname === "/admin/login" && token) {
        return NextResponse.redirect(new URL("/admin", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
