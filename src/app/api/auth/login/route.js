import dbConnect from '@/lib/db';
import User from '@/models/User';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function POST(request) {
    try {
        await dbConnect();
        const { email, password } = await request.json();

        const user = await User.findOne({ email });

        if (!user || !(await user.matchPassword(password))) {
            return NextResponse.json(
                { message: 'Invalid email or password' },
                { status: 401 }
            );
        }

        if (user.role !== 'admin') {
            return NextResponse.json(
                { message: 'Access denied. Admins only.' },
                { status: 403 }
            );
        }

        const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;
        console.log('Login Debug - Secrets:', {
            hasJwtSecret: !!process.env.JWT_SECRET,
            hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
            resolvedSecretLength: secret ? secret.length : 0
        });

        if (!secret) {
            console.error('CRITICAL: No JWT secret found in environment');
            throw new Error('JWT_SECRET IS MISSING IN ENV');
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            secret,
            { expiresIn: '7d' }
        );

        // Set Cookie
        const seralized = serialize('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Ensure this is false in dev
            sameSite: 'lax', // Changed from strict to lax for better compatibility
            maxAge: MAX_AGE,
            path: '/',
        });

        const response = NextResponse.json(
            { message: 'Authenticated successfully', user: { name: user.name, email: user.email } },
            { status: 200 }
        );

        response.headers.set('Set-Cookie', seralized);

        return response;

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
