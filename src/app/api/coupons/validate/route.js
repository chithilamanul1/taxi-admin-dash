import dbConnect from '@/lib/db';
import Coupon from '@/models/Coupon';
import { NextResponse } from 'next/server';

export async function POST(req) {
    await dbConnect();
    try {
        const { code, location } = await req.json(); // location is likely dropoff or pickup string
        const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

        if (!coupon) {
            return NextResponse.json({ valid: false, message: 'Invalid coupon code' });
        }

        if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
            return NextResponse.json({ valid: false, message: 'Coupon expired' });
        }

        // Location Check
        if (coupon.applicableLocations && coupon.applicableLocations.length > 0) {
            if (!location) return NextResponse.json({ valid: false, message: 'Location required for this coupon' });

            const locLower = location.toLowerCase();
            const matches = coupon.applicableLocations.some(loc => locLower.includes(loc.toLowerCase()));

            if (!matches) {
                return NextResponse.json({ valid: false, message: 'Coupon not applicable for this location' });
            }
        }

        return NextResponse.json({ valid: true, coupon });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
