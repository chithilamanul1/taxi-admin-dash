import dbConnect from '@/lib/db';
import Coupon from '@/models/Coupon';
import { NextResponse } from 'next/server';

import { isAdmin } from '@/lib/admin-check';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const isPublic = searchParams.get('public') === 'true';

    await dbConnect();

    if (!isPublic && !(await isAdmin())) {
        return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
    }

    try {
        const query = isPublic ? { displayInWidget: true, isActive: true } : {};

        // Leakage protection: only documents with a definite code and value are actual Coupons
        query.code = { $exists: true, $ne: null };
        query.value = { $exists: true, $ne: null };

        if (isPublic) {
            query.$or = [
                { expiryDate: { $gt: new Date() } },
                { expiryDate: { $eq: null } },
                { expiryDate: { $exists: false } }
            ];
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

        const coupon = await Coupon.findOneAndUpdate(
            { code: couponData.code },
            couponData,
            { new: true, upsert: true }
        );
        return NextResponse.json(coupon);
    } catch (error) {
        console.error("Coupons API: Upsert Error:", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
