import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token');

    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { value } = token;
        const secret = process.env.JWT_SECRET || '';

        const decoded = verify(value, secret);

        if (!decoded) {
            return NextResponse.json({ message: 'Invalid Token' }, { status: 401 });
        }

        await dbConnect();
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ user }, { status: 200 });

    } catch (e) {
        return NextResponse.json({ message: 'Something went wrong' }, { status: 400 });
    }
}
