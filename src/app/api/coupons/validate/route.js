import dbConnect from '@/lib/db';
import Coupon from '@/models/Coupon';
import { NextResponse } from 'next/server';

export async function POST(req) {
    await dbConnect();
    try {
        const { code, pickup, dropoff, tripType } = await req.json(); // pickup/dropoff are strings or objects? Expecting strings or extracting address
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

        const incomingTripType = tripType || ''; // Extract from raw request

        if (coupon.applicableFor && coupon.applicableFor !== 'all') {
            if (coupon.applicableFor === 'round-trips' && incomingTripType !== 'tour' && incomingTripType !== 'tours') {
                return NextResponse.json({ valid: false, message: 'This coupon is only valid for Round Trips.' });
            }
            if (coupon.applicableFor === 'airport-transfer' && !['pickup', 'drop'].includes(incomingTripType) && incomingTripType !== '') {
                return NextResponse.json({ valid: false, message: 'This coupon is only valid for Airport Transfers.' });
            }
            if (coupon.applicableFor === 'ride-now' && incomingTripType !== 'ride') {
                return NextResponse.json({ valid: false, message: 'This coupon is only valid for Intercity Rides (Ride Now).' });
            }
            if (coupon.applicableFor === 'transfers' && (incomingTripType === 'tour' || incomingTripType === 'tours')) {
                return NextResponse.json({ valid: false, message: 'This coupon is only valid for Airport Transfers.' });
            }
        }

        // Airport Drop and Pickup check (unless it's a tour)
        const pickupText = (typeof pickup === 'object' ? pickup?.name : pickup || '').toLowerCase();
        const dropoffText = (typeof dropoff === 'object' ? dropoff?.name : dropoff || '').toLowerCase();

        if (incomingTripType !== 'tour' && incomingTripType !== 'tours' && incomingTripType !== 'ride' && coupon.applicableFor !== 'round-trips' && coupon.applicableFor !== 'ride-now') {
            const isAirport = (name) => {
                if (!name) return false;
                const n = name.toLowerCase();
                return (n.includes('bandaranaike') || n.includes('cmb') || n.includes('airport'));
            };

            const isAirportRide = isAirport(pickupText) || isAirport(dropoffText);

            if (!isAirportRide) {
                return NextResponse.json({ valid: false, message: 'Coupons are only applicable for airport drop and pickup rides or tours.' });
            }
        }

        // Location Check
        if (coupon.applicableLocations && coupon.applicableLocations.length > 0) {
            const dropoffText = (typeof dropoff === 'object' ? dropoff?.name : dropoff || '').toLowerCase();

            if (!pickupText && !dropoffText) {
                return NextResponse.json({ valid: false, message: 'Location required for this coupon' });
            }

            const matches = coupon.applicableLocations.some(loc => {
                const l = loc.toLowerCase().trim();

                const isRealMatch = (address, keyword) => {
                    if (!address || !keyword) return false;
                    const addr = address.toLowerCase().trim();
                    const kw = keyword.toLowerCase().trim();
                    
                    const streetPattern1 = kw + ' road';
                    const streetPattern2 = kw + ' face';
                    const streetPattern3 = kw + ' street';
                    const streetPattern4 = kw + ' lane';
                    const streetPattern5 = kw + ' hotel';

                    if (addr.includes(streetPattern1) || addr.includes(streetPattern2) || addr.includes(streetPattern3) || addr.includes(streetPattern4) || addr.includes(streetPattern5)) {
                        const cleanedAddr = addr
                            .split(streetPattern1).join('')
                            .split(streetPattern2).join('')
                            .split(streetPattern3).join('')
                            .split(streetPattern4).join('')
                            .split(streetPattern5).join('');
                            
                        const regex = new RegExp(`\\b${kw}\\b`, 'i');
                        return regex.test(cleanedAddr);
                    }
                    
                    const regex = new RegExp(`\\b${kw}\\b`, 'i');
                    return regex.test(addr);
                };

                if (l.includes('->')) {
                    const [fromPart, toPart] = l.split('->').map(s => s.trim());
                    return isRealMatch(pickupText, fromPart) && isRealMatch(dropoffText, toPart);
                }
                // Fallback: simple match if no '->'
                return isRealMatch(pickupText, l) || isRealMatch(dropoffText, l);
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
