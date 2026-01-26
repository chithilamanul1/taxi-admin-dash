import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// We use 'jose' here because standard 'jsonwebtoken' often has issues in Edge Middleware
// 'jose' is edge-compatible.

const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'seranex_secret_key_12345'
);

export async function middleware(request) {
    // Only intercept requests to /admin paths
    if (request.nextUrl.pathname.startsWith('/admin')) {

        // Allow access to login page
        if (request.nextUrl.pathname === '/admin/login') {
            return NextResponse.next();
        }

        const token = request.cookies.get('auth_token');

        if (!token) {
            const url = request.nextUrl.clone();
            url.pathname = '/admin/login';
            return NextResponse.redirect(url);
        }

        try {
            const { payload } = await jwtVerify(token.value, secret);

            // Check for admin role if needed (though middleware usually just checks authn)
            if (payload.role !== 'admin') {
                // Or redirect to unauthorized page
                const url = request.nextUrl.clone();
                url.pathname = '/';
                return NextResponse.redirect(url);
            }

            return NextResponse.next();
        } catch (e) {
            // Token invalid or expired
            const url = request.nextUrl.clone();
            url.pathname = '/admin/login';
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
