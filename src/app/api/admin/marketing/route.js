import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Coupon from '@/models/Coupon';
import LocationOffer from '@/models/LocationOffer';

// GET: Fetch all coupons and offers
export async function GET(request) {
    try {
        await dbConnect();
        const coupons = await Coupon.find({}).sort({ createdAt: -1 });
        const offers = await LocationOffer.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, coupons, offers });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// POST: Create a new coupon or offer
export async function POST(request) {
    try {
        await dbConnect();
        const body = await request.json();
        const { type } = body;

        if (type === 'coupon') {
            const { code, discountType, value, expiryDate, usageLimit } = body;
            const newCoupon = await Coupon.create({ code, discountType, value, expiryDate, usageLimit });
            return NextResponse.json({ success: true, data: newCoupon });
        } else if (type === 'offer') {
            const { locationKeyword, discountPercentage, description } = body;
            const newOffer = await LocationOffer.create({ locationKeyword, discountPercentage, description });
            return NextResponse.json({ success: true, data: newOffer });
        }

        return NextResponse.json({ success: false, message: 'Invalid type' }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// DELETE: Remove an item
export async function DELETE(request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const type = searchParams.get('type');

        if (type === 'coupon') {
            await Coupon.findByIdAndDelete(id);
        } else if (type === 'offer') {
            await LocationOffer.findByIdAndDelete(id);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
