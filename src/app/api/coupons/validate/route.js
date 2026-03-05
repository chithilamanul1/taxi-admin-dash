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

        if (coupon.usageLimit && (coupon.usedCount || 0) >= coupon.usageLimit) {
            return NextResponse.json({ valid: false, message: 'Coupon usage limit reached' });
        }

        if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
            return NextResponse.json({ valid: false, message: 'Coupon expired' });
        }

        // Location Check
        if (coupon.applicableLocations && coupon.applicableLocations.length > 0) {
            const pickupText = (typeof pickup === 'object' ? pickup?.name : pickup || '').toLowerCase();
            const dropoffText = (typeof dropoff === 'object' ? dropoff?.name : dropoff || '').toLowerCase();

            if (!pickupText && !dropoffText) {
                return NextResponse.json({ valid: false, message: 'Location required for this coupon' });
            }

            const matches = coupon.applicableLocations.some(loc => {
                const l = loc.toLowerCase().trim();
                if (l.includes('->')) {
                    const [fromPart, toPart] = l.split('->').map(s => s.trim());
                    return pickupText.includes(fromPart) && dropoffText.includes(toPart);
                }
                // Fallback: simple match if no '->'
                return pickupText.includes(l) || dropoffText.includes(l);
            });

            if (!matches) {
                return NextResponse.json({ valid: false, message: 'Coupon not applicable for this route' });
            }
        }

        return NextResponse.json({ valid: true, coupon });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
