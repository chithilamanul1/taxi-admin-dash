import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Pricing from '@/models/Pricing';
import { isAdmin } from '@/lib/admin-check';

// Complete vehicle defaults including metadata AND tiers
const VEHICLE_DEFAULTS = {
    'mini-car': {
        name: 'Mini Car',
        image: '/vehicles/minicar.png',
        capacity: 2,
        luggage: 2,
        handLuggage: 2,
        features: ['Air Conditioning', 'Bluetooth', 'USB Charging'],
        tiers: [
            { min: 0, max: 20, type: 'flat', price: 3500 },
            { min: 20, max: 40, type: 'flat', price: 4000 },
            { min: 40, max: 130, type: 'per_km', rate: 100 },
            { min: 130, max: 9999, type: 'per_km', rate: 102 }
        ]
    },
    'sedan': {
        name: 'Sedan',
        image: '/vehicles/sedancar.png',
        capacity: 3,
        luggage: 3,
        handLuggage: 3,
        features: ['Air Conditioning', 'Bluetooth', 'USB Charging'],
        tiers: [
            { min: 0, max: 20, type: 'flat', price: 4500 },
            { min: 20, max: 40, type: 'flat', price: 6000 },
            { min: 40, max: 50, type: 'per_km', rate: 150 },
            { min: 50, max: 100, type: 'per_km', rate: 130 },
            { min: 100, max: 140, type: 'per_km', rate: 120 },
            { min: 140, max: 200, type: 'per_km', rate: 115 },
            { min: 200, max: 9999, type: 'per_km', rate: 110 }
        ]
    },
    'mini-van-every': {
        name: 'Mini Van (Every)',
        image: '/vehicles/susukievery.png',
        capacity: 3,
        luggage: 3,
        handLuggage: 3,
        features: ['Air Conditioning', 'Bluetooth', 'USB Charging'],
        tiers: [
            { min: 0, max: 20, type: 'flat', price: 4500 },
            { min: 20, max: 40, type: 'flat', price: 6000 },
            { min: 40, max: 50, type: 'per_km', rate: 150 },
            { min: 50, max: 100, type: 'per_km', rate: 130 },
            { min: 100, max: 140, type: 'per_km', rate: 120 },
            { min: 140, max: 200, type: 'per_km', rate: 115 },
            { min: 200, max: 9999, type: 'per_km', rate: 110 }
        ]
    },
    'mini-van-05': {
        name: 'Mini Van (4 Seat)',
        image: '/vehicles/minivan5seat.png',
        capacity: 4,
        luggage: 4,
        handLuggage: 4,
        features: ['Air Conditioning', 'Bluetooth', 'USB Charging'],
        tiers: [
            { min: 0, max: 20, type: 'flat', price: 6000 },
            { min: 20, max: 40, type: 'flat', price: 8500 },
            { min: 40, max: 100, type: 'per_km', rate: 200 },
            { min: 100, max: 140, type: 'per_km', rate: 160 },
            { min: 140, max: 200, type: 'per_km', rate: 130 },
            { min: 200, max: 9999, type: 'per_km', rate: 120 }
        ]
    },
    'suv': {
        name: 'SUV',
        image: '/vehicles/Hondavezel.png',
        capacity: 3,
        luggage: 3,
        handLuggage: 3,
        features: ['Air Conditioning', 'Bluetooth', 'USB Charging'],
        sortOrder: 5,
        tiers: [
            { min: 0, max: 20, type: 'flat', price: 6500 },
            { min: 20, max: 40, type: 'flat', price: 9500 },
            { min: 40, max: 100, type: 'per_km', rate: 150 },
            { min: 100, max: 140, type: 'per_km', rate: 145 },
            { min: 140, max: 200, type: 'per_km', rate: 140 },
            { min: 200, max: 9999, type: 'per_km', rate: 135 }
        ]
    },
    'vezel': {
        name: 'Honda Vezel',
        image: '/vehicles/Hondavezel.png',
        capacity: 3,
        luggage: 3,
        handLuggage: 3,
        features: ['Air Conditioning', 'Bluetooth', 'USB Charging'],
        sortOrder: 6,
        tiers: [
            { min: 0, max: 20, type: 'flat', price: 6500 },
            { min: 20, max: 40, type: 'flat', price: 9500 },
            { min: 40, max: 100, type: 'per_km', rate: 150 },
            { min: 100, max: 140, type: 'per_km', rate: 145 },
            { min: 140, max: 200, type: 'per_km', rate: 140 },
            { min: 200, max: 9999, type: 'per_km', rate: 135 }
        ]
    },
    'normal-kdh': {
        name: 'Van (KDH Flat Roof)',
        image: '/vehicles/van.png',
        capacity: 6,
        luggage: 7,
        handLuggage: 7,
        features: ['Air Conditioning', 'Bluetooth', 'USB Charging'],
        sortOrder: 7,
        tiers: [
            { min: 0, max: 20, type: 'flat', price: 6000 },
            { min: 20, max: 40, type: 'flat', price: 8500 },
            { min: 40, max: 100, type: 'per_km', rate: 200 },
            { min: 100, max: 140, type: 'per_km', rate: 160 },
            { min: 140, max: 200, type: 'per_km', rate: 130 },
            { min: 200, max: 9999, type: 'per_km', rate: 120 }
        ]
    },
    'kdh-van': {
        name: 'Mini Bus (KDH High Roof)',
        image: '/vehicles/toyota-highroof.png',
        capacity: 8,
        luggage: 8,
        handLuggage: 6,
        features: ['Air Conditioning', 'Bluetooth', 'USB Charging'],
        sortOrder: 8,
        tiers: [
            { min: 0, max: 20, type: 'flat', price: 6000 },
            { min: 20, max: 40, type: 'flat', price: 8500 },
            { min: 40, max: 100, type: 'per_km', rate: 200 },
            { min: 100, max: 140, type: 'per_km', rate: 160 },
            { min: 140, max: 200, type: 'per_km', rate: 130 },
            { min: 200, max: 9999, type: 'per_km', rate: 120 }
        ]
    },
    'mini-bus': {
        name: 'Coaster Bus',
        image: '/vehicles/costerbus.png',
        capacity: 8,
        luggage: 8,
        handLuggage: 6,
        features: ['Air Conditioning', 'Bluetooth', 'USB Charging'],
        sortOrder: 9,
        tiers: [
            { min: 0, max: 20, type: 'flat', price: 7500 },
            { min: 20, max: 40, type: 'flat', price: 12000 },
            { min: 40, max: 100, type: 'per_km', rate: 220 },
            { min: 100, max: 140, type: 'per_km', rate: 220 },
            { min: 140, max: 200, type: 'per_km', rate: 175 },
            { min: 200, max: 9999, type: 'per_km', rate: 155 }
        ]
    },
    'coach-bus': {
        name: 'Coach Bus',
        image: '/vehicles/coach-bus.png',
        capacity: 40,
        luggage: 30,
        handLuggage: 20,
        features: ['Air Conditioning', 'Bluetooth', 'USB Charging'],
        sortOrder: 10,
        tiers: [
            { min: 0, max: 20, type: 'flat', price: 15000 },
            { min: 20, max: 40, type: 'flat', price: 20000 },
            { min: 40, max: 100, type: 'per_km', rate: 300 },
            { min: 100, max: 140, type: 'per_km', rate: 300 },
            { min: 140, max: 200, type: 'per_km', rate: 250 },
            { min: 200, max: 9999, type: 'per_km', rate: 220 }
        ]
    }
};

export async function POST(req) {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        let updatedCount = 0;
        let createdCount = 0;

        // For each category, sync all vehicle defaults
        const categories = ['airport-transfer', 'ride-now'];

        for (const category of categories) {
            for (const [vehicleType, defaults] of Object.entries(VEHICLE_DEFAULTS)) {
                const { tiers, ...metadata } = defaults;

                // Compute basePrice/perKmRate from tiers
                const firstTier = tiers.sort((a, b) => a.min - b.min)[0];
                const lastTier = tiers[tiers.length - 1];
                const basePrice = firstTier.type === 'flat' ? firstTier.price : 0;
                const baseKm = firstTier.type === 'flat' ? firstTier.max : 0;
                const perKmRate = lastTier.type === 'per_km' ? lastTier.rate : (lastTier.price / (lastTier.max || 1));

                const existing = await Pricing.findOne({ vehicleType, category });

                if (existing) {
                    // Update ALL fields: tiers + metadata
                    existing.tiers = tiers;
                    existing.name = metadata.name;
                    existing.image = metadata.image;
                    existing.capacity = metadata.capacity;
                    existing.luggage = metadata.luggage;
                    existing.handLuggage = metadata.handLuggage;
                    existing.features = metadata.features;
                    existing.basePrice = basePrice;
                    existing.baseKm = baseKm;
                    existing.perKmRate = perKmRate;
                    await existing.save();
                    updatedCount++;
                } else {
                    // Create new record
                    await Pricing.create({
                        vehicleType,
                        category,
                        ...metadata,
                        tiers,
                        basePrice,
                        baseKm,
                        perKmRate
                    });
                    createdCount++;
                }
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
            message: `Sync complete: ${updatedCount} updated, ${createdCount} created. ${deactivated.modifiedCount || 0} bus records deactivated.`
        });
    } catch (error) {
        console.error('Error syncing pricing:', error);
        return NextResponse.json({ success: false, error: 'Failed to sync pricing' }, { status: 500 });
    }
}
