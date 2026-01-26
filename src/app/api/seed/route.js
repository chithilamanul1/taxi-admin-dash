import dbConnect from '../../../lib/db';
import User from '../../../models/User';
import Pricing from '../../../models/Pricing';
import Driver from '../../../models/Driver';
import { NextResponse } from 'next/server';

// User-provided tiered pricing rates (Jan 2026)
// User-provided tiered pricing rates (Jan 2026)
const PRICING_DATA = [
    {
        vehicleType: 'mini-car',
        name: 'MINI CAR (Budget)',
        image: '/vehicles/wagon-r.jpeg',
        capacity: 2,
        luggage: 2,
        handLuggage: 2,
        features: ['Air-Conditioning'],
        basePrice: 3500,
        baseKm: 20,
        perKmRate: 92.50,
        tiers: [
            { min: 1, max: 20, type: 'flat', price: 3500, rate: 0 },
            { min: 21, max: 40, type: 'flat', price: 4000, rate: 0 },
            { min: 41, max: 130, type: 'per_km', price: 0, rate: 100 },
            { min: 131, max: 9999, type: 'per_km', price: 0, rate: 92.50 }
        ],
        isActive: true
    },
    {
        vehicleType: 'mini-van-every',
        name: 'MINI VAN (Every)',
        image: '/vehicles/every.jpg',
        capacity: 3,
        luggage: 3,
        handLuggage: 3,
        features: ['Air-Conditioning'],
        basePrice: 4500,
        baseKm: 20,
        perKmRate: 110,
        tiers: [
            { min: 1, max: 20, type: 'flat', price: 4500, rate: 0 },
            { min: 21, max: 40, type: 'flat', price: 6000, rate: 0 },
            { min: 41, max: 50, type: 'per_km', price: 0, rate: 150 },
            { min: 51, max: 100, type: 'per_km', price: 0, rate: 130 },
            { min: 101, max: 140, type: 'per_km', price: 0, rate: 120 },
            { min: 141, max: 200, type: 'per_km', price: 0, rate: 115 },
            { min: 201, max: 9999, type: 'per_km', price: 0, rate: 110 }
        ],
        isActive: true
    },
    {
        vehicleType: 'sedan',
        name: 'SEDAN CAR',
        image: '/vehicles/sedan.png',
        capacity: 3,
        luggage: 3,
        handLuggage: 3,
        features: ['Air-Conditioning'],
        basePrice: 4500,
        baseKm: 20,
        perKmRate: 110,
        tiers: [
            { min: 1, max: 20, type: 'flat', price: 4500, rate: 0 },
            { min: 21, max: 40, type: 'flat', price: 6000, rate: 0 },
            { min: 41, max: 50, type: 'per_km', price: 0, rate: 150 },
            { min: 51, max: 100, type: 'per_km', price: 0, rate: 130 },
            { min: 101, max: 140, type: 'per_km', price: 0, rate: 120 },
            { min: 141, max: 200, type: 'per_km', price: 0, rate: 115 },
            { min: 201, max: 9999, type: 'per_km', price: 0, rate: 110 }
        ],
        isActive: true
    },
    {
        vehicleType: 'mini-van-05',
        name: 'MINI VAN (4-5 Seater)',
        image: '/vehicles/minivan-4.jpg',
        capacity: 5,
        luggage: 4,
        handLuggage: 4,
        features: ['Air-Conditioning'],
        basePrice: 6000,
        baseKm: 20,
        perKmRate: 120,
        tiers: [
            { min: 1, max: 20, type: 'flat', price: 6000, rate: 0 },
            { min: 21, max: 40, type: 'flat', price: 8500, rate: 0 },
            { min: 41, max: 100, type: 'per_km', price: 0, rate: 200 },
            { min: 101, max: 140, type: 'per_km', price: 0, rate: 160 },
            { min: 141, max: 200, type: 'per_km', price: 0, rate: 130 },
            { min: 201, max: 9999, type: 'per_km', price: 0, rate: 120 }
        ],
        isActive: true
    },
    {
        vehicleType: 'kdh-van',
        name: 'KDH VAN (Standard Van)',
        image: '/vehicles/Van.jpg',
        capacity: 6,
        luggage: 7,
        handLuggage: 7,
        features: ['Air-Conditioning'],
        basePrice: 6000,
        baseKm: 20,
        perKmRate: 120,
        tiers: [
            { min: 1, max: 20, type: 'flat', price: 6000, rate: 0 },
            { min: 21, max: 40, type: 'flat', price: 8500, rate: 0 },
            { min: 41, max: 100, type: 'per_km', price: 0, rate: 200 },
            { min: 101, max: 140, type: 'per_km', price: 0, rate: 160 },
            { min: 141, max: 200, type: 'per_km', price: 0, rate: 130 },
            { min: 201, max: 9999, type: 'per_km', price: 0, rate: 120 }
        ],
        isActive: true
    },
    {
        vehicleType: 'suv',
        name: 'SUV (Luxury)',
        image: '/vehicles/suv.jpg',
        capacity: 3,
        luggage: 3,
        handLuggage: 3,
        features: ['Air-Conditioning'],
        basePrice: 7000,
        baseKm: 20,
        perKmRate: 180,
        tiers: [
            { min: 1, max: 20, type: 'flat', price: 7000, rate: 0 },
            { min: 21, max: 40, type: 'flat', price: 12000, rate: 0 },
            { min: 41, max: 100, type: 'per_km', price: 0, rate: 250 },
            { min: 101, max: 9999, type: 'per_km', price: 0, rate: 180 }
        ],
        isActive: true
    },
    {
        vehicleType: 'mini-bus',
        name: 'KDH HIGHROOF',
        image: '/vehicles/kdh.png',
        capacity: 7,
        luggage: 7,
        handLuggage: 5,
        features: ['Air-Conditioning', 'High Roof', 'Luxury Seats'],
        basePrice: 7500,
        baseKm: 20,
        perKmRate: 130,
        tiers: [
            { min: 1, max: 20, type: 'flat', price: 7500, rate: 0 },
            { min: 21, max: 40, type: 'flat', price: 12000, rate: 0 },
            { min: 41, max: 100, type: 'per_km', price: 0, rate: 220 },
            { min: 101, max: 140, type: 'per_km', price: 0, rate: 200 },
            { min: 141, max: 200, type: 'per_km', price: 0, rate: 140 },
            { min: 201, max: 9999, type: 'per_km', price: 0, rate: 130 }
        ],
        isActive: true
    }
];

import { cookies } from 'next/headers';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

async function isAdmin() {
    const session = await getServerSession(authOptions);
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (session?.user?.role === 'admin') return true;

    if (token) {
        try {
            const { verify } = await import('jsonwebtoken');
            const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;
            const decoded = verify(token, secret);
            if (decoded.role === 'admin') return true;
        } catch (e) { }
    }
    return false;
}

export async function GET() {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        await dbConnect();

        const results = {
            admin: 'skipped',
            pricing: 'skipped'
        };

        // 1. Seed Admin
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@airporttaxitours.lk';
        const adminPassword = process.env.ADMIN_PASSWORD || 'password123';

        const adminExists = await User.findOne({ email: adminEmail });
        if (!adminExists) {
            await User.create({
                name: 'Super Admin',
                email: adminEmail,
                password: adminPassword,
                phone: '0000000000',
                role: 'admin',
                isAdmin: true
            });
            results.admin = 'created';
        } else {
            // Update password only if it changed in .env and doesn't match
            // Note: Since we can't easily decrypt, we'll try to match. If match fails, we update.
            const isMatch = await adminExists.matchPassword(adminPassword);
            if (!isMatch) {
                adminExists.password = adminPassword;
                await adminExists.save();
                results.admin = 'updated (password changed)';
            } else {
                results.admin = 'skipped (password unchanged)';
            }
        }

        // 2. Seed/Update Pricing with new tiered rates
        for (const vehicleData of PRICING_DATA) {
            await Pricing.findOneAndUpdate(
                {
                    vehicleType: vehicleData.vehicleType,
                    category: vehicleData.category || 'airport-transfer'
                },
                vehicleData,
                { upsert: true, new: true }
            );
        }
        results.pricing = 'updated with tiered rates';

        // 3. Seed Test Driver
        const driverPhone = '0774139621'; // Default test driver
        let driverUser = await User.findOne({ phone: driverPhone });
        if (!driverUser) {
            driverUser = await User.create({
                name: 'Test Driver',
                email: 'driver@test.com',
                phone: driverPhone,
                password: 'password123', // Will be hashed by pre-save hook
                role: 'driver'
            });
            results.driverUser = 'created';
        } else {
            results.driverUser = 'skipped (exists)';
        }

        let driverProfile = await Driver.findOne({ user: driverUser._id });
        if (!driverProfile) {
            await Driver.create({
                user: driverUser._id,
                name: driverUser.name,
                phone: driverUser.phone,
                email: driverUser.email,
                vehicleType: 'mini-car',
                vehicleNumber: 'WP ABC-1234',
                status: 'free',
                isOnline: false
            });
            results.driverProfile = 'created';
        } else {
            results.driverProfile = 'skipped (exists)';
        }

        return NextResponse.json({
            message: 'Database seeding completed',
            results,
            vehiclesUpdated: PRICING_DATA.length
        });

    } catch (error) {
        console.error('Seeding error:', error);
        return NextResponse.json({ message: 'Seeding failed', error: error.message }, { status: 500 });
    }
}
