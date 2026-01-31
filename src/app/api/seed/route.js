import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Pricing from '@/models/Pricing';

// Define the exact vehicles and pricing requested by the user
const vehicleData = [
    {
        vehicleType: 'mini-car',
        category: 'airport-transfer',
        name: 'Mini Car (Budget)',
        image: '/vehicles/minicar.png', // Assuming user will upload or we map to existing
        capacity: 2,
        luggage: 2,
        handLuggage: 2,
        features: ['Air Conditioned'],
        basePrice: 3500, // 0-20km
        baseKm: 20,
        perKmRate: 100, // 41-130km
        sortOrder: 1,
        tiers: [
            { min: 0, max: 20, type: 'flat', price: 3500 },
            { min: 21, max: 40, type: 'flat', price: 4000 },
            { min: 41, max: 130, type: 'per_km', rate: 100 },
            { min: 131, max: 9999, type: 'per_km', rate: 92.5 }
        ]
    },
    {
        vehicleType: 'sedan',
        category: 'airport-transfer',
        name: 'Sedan (Comfort)',
        image: '/vehicles/sedan.png',
        capacity: 3,
        luggage: 3,
        handLuggage: 3,
        features: ['Air Conditioned'],
        basePrice: 4500,
        baseKm: 20,
        perKmRate: 150,
        sortOrder: 2,
        tiers: [
            { min: 0, max: 20, type: 'flat', price: 4500 },
            { min: 21, max: 40, type: 'flat', price: 6000 },
            { min: 41, max: 50, type: 'per_km', rate: 150 },
            { min: 51, max: 100, type: 'per_km', rate: 130 },
            { min: 101, max: 140, type: 'per_km', rate: 120 },
            { min: 141, max: 200, type: 'per_km', rate: 115 },
            { min: 201, max: 9999, type: 'per_km', rate: 110 }
        ]
    },
    {
        vehicleType: 'suv',
        category: 'airport-transfer',
        name: 'SUV (Luxury)',
        image: '/vehicles/suv.jpg',
        capacity: 3,
        luggage: 3,
        handLuggage: 3,
        features: ['Air Conditioned'],
        basePrice: 7000,
        baseKm: 20,
        perKmRate: 250,
        sortOrder: 3,
        tiers: [
            { min: 0, max: 20, type: 'flat', price: 7000 },
            { min: 21, max: 40, type: 'flat', price: 12000 },
            { min: 41, max: 100, type: 'per_km', rate: 250 },
            { min: 101, max: 9999, type: 'per_km', rate: 180 }
        ]
    },
    {
        vehicleType: 'mini-van-every',
        category: 'airport-transfer',
        name: 'Mini Van (Every)',
        image: '/vehicles/van.jpg', // "Van.jpg" in screenshot, likely the Every
        capacity: 3,
        luggage: 3,
        handLuggage: 3,
        features: ['Air Conditioned'],
        basePrice: 4500,
        baseKm: 20,
        perKmRate: 150,
        sortOrder: 4,
        tiers: [
            { min: 0, max: 20, type: 'flat', price: 4500 },
            { min: 21, max: 40, type: 'flat', price: 6000 },
            { min: 41, max: 50, type: 'per_km', rate: 150 },
            { min: 51, max: 100, type: 'per_km', rate: 130 },
            { min: 101, max: 140, type: 'per_km', rate: 120 },
            { min: 141, max: 200, type: 'per_km', rate: 115 },
            { min: 201, max: 9999, type: 'per_km', rate: 110 }
        ]
    },
    {
        vehicleType: 'mini-van-05',
        category: 'airport-transfer',
        name: 'Mini Van (4 Seat)',
        image: '/vehicles/minivan-4.jpg',
        capacity: 4,
        luggage: 4,
        handLuggage: 4,
        features: ['Air Conditioned'],
        basePrice: 6000,
        baseKm: 20,
        perKmRate: 200,
        sortOrder: 5,
        tiers: [
            { min: 0, max: 20, type: 'flat', price: 6000 },
            { min: 21, max: 40, type: 'flat', price: 8500 },
            { min: 41, max: 100, type: 'per_km', rate: 200 },
            { min: 101, max: 140, type: 'per_km', rate: 160 },
            { min: 141, max: 200, type: 'per_km', rate: 130 },
            { min: 201, max: 9999, type: 'per_km', rate: 120 }
        ]
    },
    {
        vehicleType: 'kdh-van',
        category: 'airport-transfer',
        name: 'KDH Van (Flat Roof)',
        image: '/vehicles/kdh.jpg',
        capacity: 6,
        luggage: 7,
        handLuggage: 7,
        features: ['Air Conditioned'],
        basePrice: 6000,
        baseKm: 20,
        perKmRate: 200,
        sortOrder: 6,
        tiers: [
            { min: 0, max: 20, type: 'flat', price: 6000 },
            { min: 21, max: 40, type: 'flat', price: 8500 },
            { min: 41, max: 100, type: 'per_km', rate: 200 },
            { min: 101, max: 140, type: 'per_km', rate: 160 },
            { min: 141, max: 200, type: 'per_km', rate: 130 },
            { min: 201, max: 9999, type: 'per_km', rate: 120 }
        ]
    },
    {
        vehicleType: 'mini-bus',
        category: 'airport-transfer',
        name: 'Mini Bus (KDH Highroof)',
        image: '/vehicles/minibus.jpg',
        capacity: 8,
        luggage: 8,
        handLuggage: 6,
        features: ['Air Conditioned'],
        basePrice: 7500,
        baseKm: 20,
        perKmRate: 220,
        sortOrder: 7,
        tiers: [
            { min: 0, max: 20, type: 'flat', price: 7500 },
            { min: 21, max: 40, type: 'flat', price: 12000 },
            { min: 41, max: 100, type: 'per_km', rate: 220 },
            { min: 101, max: 140, type: 'per_km', rate: 200 },
            { min: 141, max: 200, type: 'per_km', rate: 140 },
            { min: 201, max: 9999, type: 'per_km', rate: 130 }
        ]
    },
    {
        vehicleType: 'large-bus',
        category: 'airport-transfer',
        name: 'Bus (Toyota Coaster)',
        image: '/vehicles/bus.jpg',
        capacity: 20,
        luggage: 15,
        handLuggage: 10,
        features: ['Air Conditioned'],
        basePrice: 15000, // Placeholder
        baseKm: 20,
        perKmRate: 400,
        sortOrder: 8,
        tiers: [] // No tiers provided yet, using defaults
    },
    {
        vehicleType: 'coach-bus',
        category: 'airport-transfer',
        name: 'Coach Bus',
        image: '/vehicles/couch_bus.jpg',
        capacity: 40,
        luggage: 30,
        handLuggage: 20,
        features: ['Air Conditioned'],
        basePrice: 25000, // Placeholder
        baseKm: 20,
        perKmRate: 600,
        sortOrder: 9,
        tiers: [] // No tiers provided yet
    }
];

export async function GET() {
    try {
        await dbConnect();

        // 1. Delete all existing pricing for airport-transfer to ensure clean state
        // This prevents duplicate vehicles or old pricing from persisting
        await Pricing.deleteMany({ category: 'airport-transfer' });

        // 2. Insert new data
        await Pricing.insertMany(vehicleData);

        return NextResponse.json({
            success: true,
            message: 'Vehicle pricing seeded successfully!',
            count: vehicleData.length
        });

    } catch (error) {
        console.error('Seeding error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
