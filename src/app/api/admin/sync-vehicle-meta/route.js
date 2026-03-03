import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Pricing from '@/models/Pricing';
import { isAdmin } from '@/lib/admin-check';

// Only vehicle metadata — NO tiers/rates
const VEHICLE_METADATA = {
    'mini-car': { name: 'Mini Car', image: '/vehicles/minicar.png', capacity: 2, luggage: 2, handLuggage: 2 },
    'sedan': { name: 'Sedan', image: '/vehicles/sedancar.png', capacity: 3, luggage: 3, handLuggage: 3 },
    'mini-van-every': { name: 'Mini Van (Every)', image: '/vehicles/susukievery.png', capacity: 3, luggage: 3, handLuggage: 3 },
    'mini-van-05': { name: 'Mini Van (4 Seat)', image: '/vehicles/minivan5seat.png', capacity: 4, luggage: 4, handLuggage: 4 },
    'suv': { name: 'SUV / Vezel', image: '/vehicles/Hondavezel.png', capacity: 3, luggage: 3, handLuggage: 3 },
    'kdh-van': { name: 'Van (KDH High Roof)', image: '/vehicles/toyota-highroof.png', capacity: 8, luggage: 8, handLuggage: 6 },
    'normal-kdh': { name: 'Van (KDH Flat Roof)', image: '/vehicles/van.png', capacity: 6, luggage: 7, handLuggage: 7 },
    'mini-bus': { name: 'Mini Bus', image: '/vehicles/costerbus.png', capacity: 8, luggage: 8, handLuggage: 6 },
    'bus': { name: 'Bus (20+ Seater)', image: '/vehicles/coach-bus.png', capacity: 25, luggage: 20, handLuggage: 20 },
    'coach-bus': { name: 'Coach Bus (40+ Seater)', image: '/vehicles/coach-bus.png', capacity: 45, luggage: 40, handLuggage: 40 },
};

export async function POST(req) {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        let updatedCount = 0;
        const allPricing = await Pricing.find({});

        for (const pricing of allPricing) {
            const meta = VEHICLE_METADATA[pricing.vehicleType];
            if (meta) {
                pricing.name = meta.name;
                pricing.image = meta.image;
                pricing.capacity = meta.capacity;
                pricing.luggage = meta.luggage;
                pricing.handLuggage = meta.handLuggage;
                await pricing.save();
                updatedCount++;
            }
        }

        return NextResponse.json({
            success: true,
            message: `Vehicle details updated for ${updatedCount} records. Pricing rates were NOT changed.`
        });
    } catch (error) {
        console.error('Error syncing vehicle metadata:', error);
        return NextResponse.json({ success: false, error: 'Failed to sync vehicle metadata' }, { status: 500 });
    }
}
