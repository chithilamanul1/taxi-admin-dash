import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import User from '../../../../models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import bcrypt from 'bcryptjs';

// GET: List all admins
export async function GET(req) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);

        // Basic Check: Only admins can see other admins
        // In a real scenario, check if session.user.permissions includes 'manage_admins'
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const admins = await User.find({ role: 'admin' }).select('-password');
        return NextResponse.json({ success: true, data: admins });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// POST: Create a new Admin or Promote User
export async function POST(req) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);

        let isAdmin = false;

        // 1. Check NextAuth Session
        if (session && session.user.role === 'admin') {
            isAdmin = true;
        }

        // 2. Check Custom Auth Token (if not already admin)
        if (!isAdmin) {
            const { cookies } = await import('next/headers');
            const jwt = await import('jsonwebtoken');
            const cookieStore = cookies();
            const token = cookieStore.get('auth_token');

            if (token) {
                try {
                    const decoded = jwt.default.verify(token.value, process.env.JWT_SECRET);
                    if (decoded.role === 'admin') {
                        isAdmin = true;
                    }
                } catch (err) {
                    // Token invalid
                }
            }
        }

        if (!isAdmin) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        // Ideally, check for 'manage_admins' permission strictly
        // const currentUser = await User.findById(session.user.id);
        // if (!currentUser.permissions.includes('manage_admins')) ...

        const body = await req.json();
        const { email, password, name, permissions } = body;

        let user = await User.findOne({ email });

        if (user) {
            // Promote existing user
            user.role = 'admin';
            user.isAdmin = true;
            user.permissions = permissions || [];
            await user.save();
        } else {
            // Create new admin
            if (!password) {
                return NextResponse.json({ success: false, error: 'Password required for new user' }, { status: 400 });
            }
            user = await User.create({
                name,
                email,
                password, // Pass plain password, let User model pre-save hook hash it
                role: 'admin',
                isAdmin: true,
                permissions: permissions || []
            });
            // Re-fetching to fix the password issue if logic was ambiguous (for safety, the model usually hashes on save)
            // Actually, mistakenly passing hashed password to a model that hashes again is a common bug.
            // Let's rely on the model. But `create` triggers `save`. So pass PLAIN password.
        }

        return NextResponse.json({ success: true, data: user });

    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
