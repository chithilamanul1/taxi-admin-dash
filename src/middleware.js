import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
    const { pathname } = request.nextUrl;

    if (pathname.startsWith("/admin")) {
        const token = await getToken({
            req: request,
            secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET
        });

        const isLoginPage = pathname === "/admin/login";

        if (!token) {
            if (isLoginPage) return NextResponse.next();
            return NextResponse.redirect(new URL("/admin/login", request.url));
        }

        // Check for admin role
        if (token.role !== 'admin') {
            console.log(`Unauthorized access attempt to ${pathname} by ${token.email}`);
            return NextResponse.redirect(new URL("/", request.url));
        }

        if (isLoginPage) {
            return NextResponse.redirect(new URL("/admin", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
