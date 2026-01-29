import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Pricing from '@/models/Pricing';

export async function GET() {
    try {
        await dbConnect();

        // Check for Ride Now pricing
        const rideNowPrices = await Pricing.find({ category: 'ride-now' });

        if (rideNowPrices.length === 0) {
            const rideNowData = [
                {
                    vehicleType: 'mini-car',
                    category: 'ride-now',
                    name: 'Mini Car (Ride Now)',
                    basePrice: 500, // Higher base
                    baseKm: 1,      // Lower base KM
                    perKmRate: 150, // Higher per KM (Airport might be ~100)
                    image: '/images/mini-car.png',
                    isActive: true
                },
                {
                    vehicleType: 'sedan',
                    category: 'ride-now',
                    name: 'Sedan (Ride Now)',
                    basePrice: 600,
                    baseKm: 1,
                    perKmRate: 180,
                    image: '/images/sedan.png',
                    isActive: true
                },
                {
                    vehicleType: 'kdh-van',
                    category: 'ride-now',
                    name: 'KDH Van (Ride Now)',
                    basePrice: 1000,
                    baseKm: 1,
                    perKmRate: 250,
                    image: '/images/kdh.png',
                    isActive: true
                }
            ];

            await Pricing.insertMany(rideNowData);
            return NextResponse.json({ success: true, message: 'Seeded Ride Now prices.' });
        } else {
            return NextResponse.json({ success: true, message: 'Ride Now prices already exist.', count: rideNowPrices.length });
        }
    } catch (error) {
        console.error('Seeding error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
