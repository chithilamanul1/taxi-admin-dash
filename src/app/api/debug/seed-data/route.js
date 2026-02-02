import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Pricing from '@/models/Pricing';

export async function POST() {
    try {
        await dbConnect();

        // 1. Clear existing pricing data
        await Pricing.deleteMany({});

        // 2. Define standard vehicles
        const vehicles = [
            // --- AIRPORT TRANSFER ---
            {
                name: 'Mini Car (Alto)',
                vehicleType: 'mini-car',
                category: 'airport-transfer',
                capacity: 3,
                luggage: 2,
                basePrice: 2500,
                baseKm: 0,
                perKmRate: 120,
                image: '/vehicles/sedan.png',
                waitingCharges: [500, 1000, 1500],
                tiers: [
                    { min: 0, max: 40, type: 'per_km', rate: 140 },
                    { min: 41, max: 100, type: 'per_km', rate: 120 },
                    { min: 101, max: 9999, type: 'per_km', rate: 110 }
                ]
            },
            {
                name: 'Sedan (Prius/Axio)',
                vehicleType: 'sedan',
                category: 'airport-transfer',
                capacity: 4,
                luggage: 3,
                basePrice: 3500,
                baseKm: 0,
                perKmRate: 160,
                image: '/vehicles/sedan.png',
                tiers: [
                    { min: 0, max: 9999, type: 'per_km', rate: 160 }
                ]
            },
            {
                name: 'KDH High Roof',
                vehicleType: 'kdh-van',
                category: 'airport-transfer',
                capacity: 9,
                luggage: 8,
                basePrice: 5000,
                baseKm: 0,
                perKmRate: 220,
                image: '/vehicles/kdh.jpg',
                tiers: [
                    { min: 0, max: 9999, type: 'per_km', rate: 220 }
                ]
            },

            // --- RIDE NOW / P2P ---
            {
                name: 'Tuk Tuk',
                vehicleType: 'tuk-tuk',
                category: 'ride-now',
                capacity: 3,
                luggage: 1,
                basePrice: 150,
                perKmRate: 80,
                image: '/vehicles/placeholder.png',
            },
            {
                name: 'Nano / Mini',
                vehicleType: 'mini',
                category: 'ride-now',
                capacity: 4,
                luggage: 2,
                basePrice: 200,
                perKmRate: 100,
                image: '/vehicles/sedan.png',
            },

            // --- TOUR PACKAGES ---
            {
                name: 'Luxury Sedan Tour',
                vehicleType: 'tour-sedan',
                category: 'tours',
                capacity: 4,
                luggage: 4,
                basePrice: 25000, // Per day usually
                perKmRate: 0,
                features: ['English Speaking Driver', 'Fuel Included', 'Insurance'],
                image: '/vehicles/sedan.png',
                tiers: [
                    { min: 0, max: 100, type: 'flat', price: 25000 },
                    { min: 101, max: 200, type: 'flat', price: 30000 }
                ]
            },
            {
                name: 'KDH Van Tour',
                vehicleType: 'tour-van',
                category: 'tours',
                capacity: 9,
                luggage: 8,
                basePrice: 35000,
                perKmRate: 0,
                features: ['Dual A/C', 'Adjustable Seats', 'Cool Box'],
                image: '/vehicles/kdh.jpg',
                tiers: [
                    { min: 0, max: 100, type: 'flat', price: 35000 }
                ]
            }
        ];

        await Pricing.insertMany(vehicles);

        return NextResponse.json({ success: true, message: 'Database reset and seeded!' });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
