import dbConnect from '@/lib/db';
import Coupon from '@/models/Coupon';
import { NextResponse } from 'next/server';

import { cookies } from 'next/headers';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

async function isAdmin() {
    const session = await getServerSession(authOptions);
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (session?.user?.role === 'admin') return true;

    if (token) {
        try {
            const { verify } = await import('jsonwebtoken');
            const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;
            const decoded = verify(token, secret);
            if (decoded.role === 'admin') return true;
        } catch (e) { }
    }
    return false;
}

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const isPublic = searchParams.get('public') === 'true';

    await dbConnect();

    if (!isPublic && !(await isAdmin())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const query = isPublic ? { displayInWidget: true, isActive: true } : {};
        // Add a check for expiry date if public
        if (isPublic) {
            query.expiryDate = { $gt: new Date() };
        }

        const coupons = await Coupon.find(query).sort({ createdAt: -1 });
        const responseHeaders = isPublic ? {
            'Cache-Control': 's-maxage=600, stale-while-revalidate=30'
        } : {};

        return NextResponse.json(coupons, { headers: responseHeaders });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    if (!(await isAdmin())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await dbConnect();
    try {
        const body = await req.json();
        const coupon = await Coupon.create(body);
        return NextResponse.json(coupon);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
