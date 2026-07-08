import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Pricing from '@/models/Pricing';
const VEHICLE_DEFAULTS = {
    'mini-car': { name: 'Mini Car', image: '/vehicles/minicar.png', capacity: 2, luggage: 2, handLuggage: 2, features: ['Air Conditioning', 'Bluetooth', 'USB Charging'], tiers: [{ min: 0, max: 20, type: 'flat', price: 3500 }, { min: 20, max: 40, type: 'flat', price: 4000 }, { min: 40, max: 130, type: 'per_km', rate: 100 }, { min: 130, max: 9999, type: 'per_km', rate: 102 }] },
    'sedan': { name: 'Sedan', image: '/vehicles/sedancar.png', capacity: 3, luggage: 3, handLuggage: 3, features: ['Air Conditioning', 'Bluetooth', 'USB Charging'], tiers: [{ min: 0, max: 20, type: 'flat', price: 4500 }, { min: 20, max: 40, type: 'flat', price: 6000 }, { min: 40, max: 50, type: 'per_km', rate: 150 }, { min: 50, max: 100, type: 'per_km', rate: 130 }, { min: 100, max: 140, type: 'per_km', rate: 120 }, { min: 140, max: 200, type: 'per_km', rate: 115 }, { min: 200, max: 9999, type: 'per_km', rate: 110 }] },
    'mini-van-every': { name: 'Mini Van (Every)', image: '/vehicles/susukievery.png', capacity: 3, luggage: 3, handLuggage: 3, features: ['Air Conditioning', 'Bluetooth', 'USB Charging'], tiers: [{ min: 0, max: 20, type: 'flat', price: 4500 }, { min: 20, max: 40, type: 'flat', price: 6000 }, { min: 40, max: 50, type: 'per_km', rate: 150 }, { min: 50, max: 100, type: 'per_km', rate: 130 }, { min: 100, max: 140, type: 'per_km', rate: 120 }, { min: 140, max: 200, type: 'per_km', rate: 115 }, { min: 200, max: 9999, type: 'per_km', rate: 110 }] },
    'mini-van-05': { name: 'Mini Van (4 Seat)', image: '/vehicles/minivan5seat.png', capacity: 4, luggage: 4, handLuggage: 4, features: ['Air Conditioning', 'Bluetooth', 'USB Charging'], tiers: [{ min: 0, max: 20, type: 'flat', price: 6000 }, { min: 20, max: 40, type: 'flat', price: 8500 }, { min: 40, max: 100, type: 'per_km', rate: 200 }, { min: 100, max: 140, type: 'per_km', rate: 160 }, { min: 140, max: 200, type: 'per_km', rate: 130 }, { min: 200, max: 9999, type: 'per_km', rate: 120 }] },
    'suv': { name: 'SUV', image: '/vehicles/suv.png', capacity: 3, luggage: 3, handLuggage: 3, features: ['Air Conditioning', 'Bluetooth', 'USB Charging'], sortOrder: 5, tiers: [{ min: 0, max: 20, type: 'flat', price: 6500 }, { min: 20, max: 40, type: 'flat', price: 9500 }, { min: 40, max: 100, type: 'per_km', rate: 150 }, { min: 100, max: 140, type: 'per_km', rate: 145 }, { min: 140, max: 200, type: 'per_km', rate: 140 }, { min: 200, max: 9999, type: 'per_km', rate: 135 }] },
    'vezel': { name: 'Honda Vezel', image: '/vehicles/Hondavezel.png', capacity: 3, luggage: 3, handLuggage: 3, features: ['Air Conditioning', 'Bluetooth', 'USB Charging'], sortOrder: 6, tiers: [{ min: 0, max: 20, type: 'flat', price: 6500 }, { min: 20, max: 40, type: 'flat', price: 9500 }, { min: 40, max: 100, type: 'per_km', rate: 150 }, { min: 100, max: 140, type: 'per_km', rate: 145 }, { min: 140, max: 200, type: 'per_km', rate: 140 }, { min: 200, max: 9999, type: 'per_km', rate: 135 }] },
    'normal-kdh': { name: 'Van (KDH Flat Roof)', image: '/vehicles/van.png', capacity: 6, luggage: 7, handLuggage: 7, features: ['Air Conditioning', 'Bluetooth', 'USB Charging'], sortOrder: 7, tiers: [{ min: 0, max: 20, type: 'flat', price: 6000 }, { min: 20, max: 40, type: 'flat', price: 8500 }, { min: 40, max: 100, type: 'per_km', rate: 200 }, { min: 100, max: 140, type: 'per_km', rate: 160 }, { min: 140, max: 200, type: 'per_km', rate: 130 }, { min: 200, max: 9999, type: 'per_km', rate: 120 }] },
    'kdh-van': { name: 'Mini Bus (KDH High Roof)', image: '/vehicles/toyota-highroof.png', capacity: 8, luggage: 8, handLuggage: 6, features: ['Air Conditioning', 'Bluetooth', 'USB Charging'], sortOrder: 8, tiers: [{ min: 0, max: 20, type: 'flat', price: 6000 }, { min: 20, max: 40, type: 'flat', price: 8500 }, { min: 40, max: 100, type: 'per_km', rate: 200 }, { min: 100, max: 140, type: 'per_km', rate: 160 }, { min: 140, max: 200, type: 'per_km', rate: 130 }, { min: 200, max: 9999, type: 'per_km', rate: 120 }] },
    'mini-bus': { name: 'Coaster Bus', image: '/vehicles/costerbus.png', capacity: 25, luggage: 20, handLuggage: 15, features: ['Air Conditioning', 'Bluetooth', 'USB Charging'], sortOrder: 9, tiers: [{ min: 0, max: 20, type: 'flat', price: 15000 }, { min: 20, max: 40, type: 'flat', price: 25000 }, { min: 40, max: 100, type: 'per_km', rate: 550 }, { min: 100, max: 200, type: 'per_km', rate: 450 }, { min: 200, max: 9999, type: 'per_km', rate: 400 }] },
    'coach-bus': { name: 'Coach Bus', image: '/vehicles/coach-bus.png', capacity: 40, luggage: 40, handLuggage: 20, features: ['Air Conditioning', 'Bluetooth', 'USB Charging'], sortOrder: 10, tiers: [{ min: 0, max: 20, type: 'flat', price: 30000 }, { min: 20, max: 40, type: 'flat', price: 45000 }, { min: 40, max: 100, type: 'per_km', rate: 850 }, { min: 100, max: 200, type: 'per_km', rate: 750 }, { min: 200, max: 9999, type: 'per_km', rate: 650 }] }
};

export const dynamic = 'force-dynamic';

export async function GET(req) {
    try {
        await dbConnect();
        let createdCount = 0;

        for (const [vehicleType, defaults] of Object.entries(VEHICLE_DEFAULTS)) {
            const { tiers, ...metadata } = defaults;

            const firstTier = tiers.sort((a, b) => a.min - b.min)[0];
            const lastTier = tiers[tiers.length - 1];
            const basePrice = firstTier.type === 'flat' ? firstTier.price : 0;
            const baseKm = firstTier.type === 'flat' ? firstTier.max : 0;
            const perKmRate = lastTier.type === 'per_km' ? lastTier.rate : (lastTier.price / (lastTier.max || 1));

            const existing = await Pricing.findOne({ vehicleType, category: 'airport-transfer' });

            if (!existing) {
                await Pricing.create({
                    vehicleType,
                    category: 'airport-transfer',
                    ...metadata,
                    tiers,
                    basePrice,
                    baseKm,
                    perKmRate
                });
                createdCount++;
            }
        }

        return NextResponse.json({ success: true, message: `Created ${createdCount} missing airport-transfer vehicles.` });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
