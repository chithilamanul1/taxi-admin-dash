import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Driver from '@/models/Driver';
import bcrypt from 'bcryptjs';

export async function GET() {
    try {
        await dbConnect();

        const results = {
            admin: 'skipped',
            driver: 'skipped'
        };

        // 1. Seed Admin
        const adminEmail = 'admin@airporttaxitours.lk';
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (!existingAdmin) {
            // Manually hash password since we might bypass middleware or want explicit control
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin', salt);

            await User.create({
                name: 'Super Admin',
                email: adminEmail,
                password: hashedPassword, // 'admin'
                role: 'admin',
                isAdmin: true
            });
            results.admin = 'created';
        }

        // 2. Seed Driver (0774844637)
        const driverPhone = '0774844637';
        const existingDriverUser = await User.findOne({ phone: driverPhone });

        if (!existingDriverUser) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('driver123', salt);

            // Create User first
            const newDriverUser = await User.create({
                name: 'Test Driver',
                email: 'driver@test.com',
                phone: driverPhone,
                password: hashedPassword,
                role: 'driver'
            });

            // Create Driver Profile
            await Driver.create({
                user: newDriverUser._id,
                vehicleType: 'mini-car',
                vehicleNumber: 'CAB-1234',
                licenseNumber: 'LIC-5678',
                status: 'available',
                isOnline: false
            });
            results.driver = 'created';
        } else {
            // Check if Driver profile exists for this user, if not create it
            const profile = await Driver.findOne({ user: existingDriverUser._id });
            if (!profile) {
                await Driver.create({
                    user: existingDriverUser._id,
                    vehicleType: 'mini-car',
                    vehicleNumber: 'CAB-1234',
                    licenseNumber: 'LIC-5678',
                    status: 'available',
                    isOnline: false
                });
                results.driver = 'profile_fixed';
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Database Seeded Successfully',
            details: results,
            credentials: {
                admin: { email: 'admin@airporttaxitours.lk', pass: 'admin' },
                driver: { phone: '0774844637', pin: '4637' }
            }
        });

    } catch (error) {
        console.error('Seeding Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
