import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Pricing from '@/models/Pricing';
import { isAdmin } from '@/lib/admin-check';

// Only vehicle metadata — NO tiers/rates. Order matches display order.
const VEHICLE_METADATA = {
    'mini-car': { name: 'Mini Car', image: '/vehicles/minicar.png', capacity: 2, luggage: 2, handLuggage: 2, sortOrder: 1 },
    'sedan': { name: 'Sedan', image: '/vehicles/sedan2.png', capacity: 3, luggage: 3, handLuggage: 3, sortOrder: 2 },
    'mini-van-every': { name: 'Mini Van (Every)', image: '/vehicles/susukievery.png', capacity: 3, luggage: 3, handLuggage: 3, sortOrder: 3 },
    'mini-van-05': { name: 'Mini Van (4 Seat)', image: '/vehicles/minivan5seat.png', capacity: 4, luggage: 4, handLuggage: 4, sortOrder: 4 },
    'suv': { name: 'SUV', image: '/vehicles/Hondavezel.png', capacity: 3, luggage: 3, handLuggage: 3, sortOrder: 5 },
    'vezel': { name: 'Honda Vezel', image: '/vehicles/Hondavezel.png', capacity: 3, luggage: 3, handLuggage: 3, sortOrder: 6 },
    'normal-kdh': { name: 'Van (KDH Flat Roof)', image: '/vehicles/van.png', capacity: 6, luggage: 7, handLuggage: 7, sortOrder: 7 },
    'kdh-van': { name: 'Mini Bus (KDH High Roof)', image: '/vehicles/toyota-highroof.png', capacity: 8, luggage: 8, handLuggage: 6, sortOrder: 8 },
    'mini-bus': { name: 'Coaster Bus', image: '/vehicles/costerbus.png', capacity: 8, luggage: 8, handLuggage: 6, sortOrder: 9 },
    'coach-bus': { name: 'Coach Bus', image: '/vehicles/coach-bus.png', capacity: 40, luggage: 30, handLuggage: 20, sortOrder: 10 },
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
                
                // Only update image if it's NOT a remote URL (Cloudinary) and NOT already the correct local path
                const isRemote = pricing.image && (pricing.image.startsWith('http') || pricing.image.startsWith('https'));
                if (!isRemote) {
                    pricing.image = meta.image;
                } else {
                    console.log(`Protecting remote image for ${pricing.vehicleType}: ${pricing.image}`);
                }

                pricing.capacity = meta.capacity;
                pricing.luggage = meta.luggage;
                pricing.handLuggage = meta.handLuggage;
                pricing.sortOrder = meta.sortOrder;
                await pricing.save();
                updatedCount++;
            }
        }

        // Reactivate coach-bus if deactivated previously
        await Pricing.updateMany(
            { vehicleType: 'coach-bus' },
            { $set: { isActive: true } }
        );

        // Deactivate old 'bus' records
        const deactivated = await Pricing.updateMany(
            { vehicleType: 'bus' },
            { $set: { isActive: false } }
        );

        return NextResponse.json({
            success: true,
            message: `Vehicle details updated for ${updatedCount} records. ${deactivated.modifiedCount || 0} bus records deactivated. Pricing rates were NOT changed.`
        });
    } catch (error) {
        console.error('Error syncing vehicle metadata:', error);
        return NextResponse.json({ success: false, error: 'Failed to sync vehicle metadata' }, { status: 500 });
    }
}
