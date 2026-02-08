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

        if (session?.user) {
            // Log for debugging
            console.log('[Auth] Admin check session user:', {
                email: session.user.email,
                role: session.user.role,
                isAdmin: session.user.isAdmin
            });

            // Fallback for primary admin email
            if (session.user.email === 'chithilamanul1@gmail.com') {
                return true;
            }

            if (session.user.role === 'admin' || session.user.isAdmin === true || session.user.isAdmin === 'true') {
                return true;
            }
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

            if (decoded) {
                if (decoded.email === 'chithilamanul1@gmail.com') return true;
                if (decoded.role === 'admin' || decoded.isAdmin === true || decoded.isAdmin === 'true') {
                    return true;
                }
            }
        }

        return false;
    } catch (error) {
        console.error('[Auth] Admin check failed:', error.message);
        return false;
    }
}
