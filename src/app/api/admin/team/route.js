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
        console.log('Team API Check:', {
            email: session?.user?.email,
            role: session?.user?.role,
            isAdmin: session?.user?.role === 'admin'
        });

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({
                success: false,
                error: `Unauthorized: User role is '${session?.user?.role || 'unknown'}'`
            }, { status: 401 });
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
        const { isAdmin: checkAdmin } = await import('../../../../lib/admin-check');
        const isAdmin = await checkAdmin();

        if (!isAdmin) {
            console.log('Team API POST Unauthorized: Robust check failed');
            return NextResponse.json({ success: false, error: 'Unauthorized: Admin access required' }, { status: 401 });
        }

        const body = await req.json();
        const { email, password, name, permissions } = body;

        // Validation
        if (!email || !name) {
            return NextResponse.json({ success: false, error: 'Name and email are required' }, { status: 400 });
        }

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
        console.error('Team API POST Error:', error);
        return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
    }
}
