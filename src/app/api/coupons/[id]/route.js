import dbConnect from '@/lib/db';
import Coupon from '@/models/Coupon';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

async function isAdmin() {
    try {
        const session = await getServerSession(authOptions);
        if (session?.user?.role === 'admin') return true;

        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (token) {
            const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;
            if (secret) {
                try {
                    const decoded = jwt.verify(token, secret);
                    if (decoded && decoded.role === 'admin') return true;
                } catch (e) { }
            }
        }
    } catch (err) { }
    return false;
}

export async function PUT(req, { params }) {
    if (!(await isAdmin())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();

    try {
        const body = await req.json();
        const coupon = await Coupon.findByIdAndUpdate(id, body, { new: true });
        if (!coupon) return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
        return NextResponse.json(coupon);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

export async function DELETE(req, { params }) {
    if (!(await isAdmin())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();

    try {
        const coupon = await Coupon.findByIdAndDelete(id);
        if (!coupon) return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
