import dbConnect from '@/lib/db';
import Coupon from '@/models/Coupon';
import { NextResponse } from 'next/server';

export async function POST(req) {
    await dbConnect();
    try {
        const { code, pickup, dropoff } = await req.json(); // pickup/dropoff are strings or objects? Expecting strings or extracting address
        const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

        if (!coupon) {
            return NextResponse.json({ valid: false, message: 'Invalid coupon code' });
        }

        if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
            return NextResponse.json({ valid: false, message: 'Coupon expired' });
        }

        // Location Check
        if (coupon.applicableLocations && coupon.applicableLocations.length > 0) {
            // Combine pickup and dropoff for checking
            // Handle if they are objects (BookingWidget sends {name: ...}?) 
            // Plan said we'd check Frontend logic. Let's assume strings for now, or handle objects.

            const pickupText = (typeof pickup === 'object' ? pickup?.name : pickup) || '';
            const dropoffText = (typeof dropoff === 'object' ? dropoff?.name : dropoff) || '';
            const fullRoute = `${pickupText} ${dropoffText}`.toLowerCase();

            if (!fullRoute.trim()) return NextResponse.json({ valid: false, message: 'Location required for this coupon' });

            const matches = coupon.applicableLocations.some(loc => fullRoute.includes(loc.toLowerCase()));

            if (!matches) {
                return NextResponse.json({ valid: false, message: 'Coupon not applicable for this location' });
            }
        }

        return NextResponse.json({ valid: true, coupon });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
