import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Destination from '@/models/Destination';

const sigiriyaTiers = {
    'mini-car': [
        { minKm: 0, maxKm: 20, type: 'flat', value: 7000 },
        { minKm: 21, maxKm: 40, type: 'flat', value: 9000 },
        { minKm: 41, maxKm: 60, type: 'per-km', value: 150 },
        { minKm: 61, maxKm: 100, type: 'per-km', value: 150 },
        { minKm: 100, maxKm: 9999, type: 'per-km', value: 135 }
    ],
    'sedan': [
        { minKm: 0, maxKm: 20, type: 'flat', value: 9000 },
        { minKm: 21, maxKm: 40, type: 'flat', value: 11000 },
        { minKm: 41, maxKm: 60, type: 'per-km', value: 180 },
        { minKm: 61, maxKm: 100, type: 'per-km', value: 170 },
        { minKm: 100, maxKm: 9999, type: 'per-km', value: 155 }
    ]
};

const ellaTiers = {
    'mini-car': [
        { minKm: 0, maxKm: 20, type: 'flat', value: 7000 },
        { minKm: 21, maxKm: 40, type: 'flat', value: 9000 },
        { minKm: 41, maxKm: 60, type: 'per-km', value: 150 },
        { minKm: 61, maxKm: 100, type: 'per-km', value: 150 },
        { minKm: 100, maxKm: 9999, type: 'per-km', value: 135 }
    ],
    'sedan': [
        { minKm: 0, maxKm: 20, type: 'flat', value: 9000 },
        { minKm: 21, maxKm: 40, type: 'flat', value: 11000 },
        { minKm: 41, maxKm: 60, type: 'per-km', value: 180 },
        { minKm: 61, maxKm: 100, type: 'per-km', value: 170 },
        { minKm: 100, maxKm: 9999, type: 'per-km', value: 155 }
    ]
};

export async function GET(req) {
    try {
        await dbConnect();

        let sigiriyaUpdated = false;
        let ellaUpdated = false;

        // Update Sigiriya
        const sigiriya = await Destination.findOne({ name: /Sigiriya/i, pickupLocation: '' });
        if (sigiriya) {
            sigiriya.vehicleTiers = sigiriyaTiers;
            sigiriya.applicableRideType = 'all';
            await sigiriya.save();
            sigiriyaUpdated = true;
        } else {
            await Destination.create({
                id: `dest_${Date.now()}_sigiriya`,
                name: 'Sigiriya, Sri Lanka',
                pickupLocation: '',
                applicableRideType: 'all',
                vehicleTiers: sigiriyaTiers,
                route_id: `route_global_sigiriya_${Date.now().toString().slice(-6)}`,
                title: 'Airport to Sigiriya, Sri Lanka',
                slug: 'sigiriya-sri-lanka'
            });
            sigiriyaUpdated = true;
        }

        // Update Ella
        const ella = await Destination.findOne({ name: /Ella/i, pickupLocation: '' });
        if (ella) {
            ella.vehicleTiers = ellaTiers;
            ella.applicableRideType = 'all';
            await ella.save();
            ellaUpdated = true;
        } else {
            await Destination.create({
                id: `dest_${Date.now()}_ella`,
                name: 'Ella, Sri Lanka',
                pickupLocation: '',
                applicableRideType: 'all',
                vehicleTiers: ellaTiers,
                route_id: `route_global_ella_${Date.now().toString().slice(-6)}`,
                title: 'Airport to Ella, Sri Lanka',
                slug: 'ella-sri-lanka'
            });
            ellaUpdated = true;
        }

        return NextResponse.json({
            success: true,
            message: 'Successfully seeded Sigiriya and Ella tier rates!',
            details: {
                sigiriya: sigiriyaUpdated ? 'Updated/Created' : 'Failed',
                ella: ellaUpdated ? 'Updated/Created' : 'Failed'
            }
        });
    } catch (error) {
        console.error('[API/SeedRates] Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
