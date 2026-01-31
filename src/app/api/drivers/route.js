import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Driver from '@/models/Driver';

// GET - List all drivers
export async function GET() {
    try {
        await dbConnect();
        const drivers = await Driver.find({}).sort({ createdAt: -1 });
        return NextResponse.json(drivers);
    } catch (error) {
        console.error('Error fetching drivers:', error);
        return NextResponse.json({ error: 'Failed to fetch drivers' }, { status: 500 });
    }
}

// POST - Create new driver
export async function POST(req) {
    try {
        await dbConnect();
        const data = await req.json();

        // Validate required fields
        if (!data.name || !data.phone || !data.vehicleType || !data.vehicleNumber) {
            return NextResponse.json({
                error: 'Name, phone, vehicle type, and vehicle number are required'
            }, { status: 400 });
        }

        // 1. Check if User exists, OR create new User
        let user = await import('@/models/User').then(mod => mod.default.findOne({ phone: data.phone }));

        if (!user) {
            const bcrypt = await import('bcryptjs'); // Dynamic import for performance if not used elsewhere
            const salt = await bcrypt.genSalt(10);
            // Default password is last 4 digits of phone
            const defaultPin = data.phone.slice(-4);
            const hashedPassword = await bcrypt.hash(defaultPin, salt);

            const User = await import('@/models/User').then(mod => mod.default);
            user = await User.create({
                name: data.name,
                email: data.email || `driver.${data.phone}@airporttaxitours.lk`, // Dummy email if not provided
                phone: data.phone,
                password: hashedPassword,
                role: 'driver'
            });
        }

        // 2. Check if Driver profile exists
        const existingDriver = await Driver.findOne({ vehicleNumber: data.vehicleNumber });
        if (existingDriver) {
            return NextResponse.json({ error: 'Driver with this vehicle number already exists' }, { status: 400 });
        }

        const driver = new Driver({
            user: user._id, // Link to User
            name: data.name,
            phone: data.phone,
            email: data.email || undefined, // Use undefined so sparse index works
            nic: data.nic || undefined, // Use undefined so sparse index works
            vehicleType: data.vehicleType,
            vehicleNumber: data.vehicleNumber,
            isOnline: false,
            status: 'free',
            verificationStatus: 'verified'
        });

        await driver.save();
        return NextResponse.json(driver, { status: 201 });
    } catch (error) {
        console.error('Error creating driver:', error);

        // Handle MongoDB Duplicate Key Error (E11000)
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return NextResponse.json({
                error: `A driver with this ${field} already exists.`
            }, { status: 400 });
        }

        return NextResponse.json({ error: error.message || 'Failed to create driver' }, { status: 500 });
    }
}

