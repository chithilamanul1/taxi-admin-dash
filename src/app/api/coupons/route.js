import dbConnect from '@/lib/db';
import Coupon from '@/models/Coupon';
import { NextResponse } from 'next/server';

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

async function isAdmin() {
    try {
        // 1. Check for NextAuth session
        const session = await getServerSession(authOptions);
        if (session?.user?.role === 'admin') return true;

        // 2. Check for custom auth_token cookie (used in some admin login implementations)
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (token) {
            const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;
            if (secret) {
                try {
                    const decoded = jwt.verify(token, secret);
                    if (decoded && decoded.role === 'admin') return true;
                } catch (jwtErr) {
                    console.error("Coupons API: JWT Verify Fail:", jwtErr.message);
                }
            }
        }

        console.log("Coupons API: Unauthorized access attempt", {
            hasSession: !!session,
            sessionRole: session?.user?.role,
            hasAuthToken: !!token
        });
    } catch (err) {
        console.error("Coupons API: Auth check error:", err);
    }
    return false;
}

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const isPublic = searchParams.get('public') === 'true';

    await dbConnect();

    if (!isPublic && !(await isAdmin())) {
        return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
    }

    try {
        const query = isPublic ? { displayInWidget: true, isActive: true } : {};
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
        return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
    }

    await dbConnect();
    try {
        const body = await req.json();

        // Basic validation
        if (!body.code || !body.value) {
            return NextResponse.json({ error: 'Code and Value are required' }, { status: 400 });
        }

        // Clean up data
        const couponData = {
            ...body,
            code: body.code.toUpperCase().trim(),
            value: parseFloat(body.value),
            expiryDate: body.expiryDate ? new Date(body.expiryDate) : null
        };

        const coupon = await Coupon.create(couponData);
        return NextResponse.json(coupon);
    } catch (error) {
        console.error("Coupons API: Create Error:", error);
        if (error.code === 11000) {
            return NextResponse.json({ error: 'A coupon with this code already exists' }, { status: 400 });
        }
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
