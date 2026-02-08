import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

/**
 * Robust admin check for API routes
 * Checks both NextAuth session and custom auth_token cookie
 */
export async function isAdmin() {
    try {
        // 1. Check NextAuth Session
        const session = await getServerSession(authOptions);
        if (session?.user?.role === 'admin' || session?.user?.isAdmin) {
            return true;
        }

        // 2. Check Custom JWT Cookie (fallback for manual logins)
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (token) {
            const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;
            if (!secret) {
                console.error('[Auth] No JWT secret configured for validation');
                return false;
            }

            const decoded = jwt.verify(token, secret);
            if (decoded && (decoded.role === 'admin' || decoded.isAdmin)) {
                return true;
            }
        }

        return false;
    } catch (error) {
        console.error('[Auth] Admin check failed:', error.message);
        return false;
    }
}
