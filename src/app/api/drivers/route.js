import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-check';
import dbConnect from '@/lib/db';
import Driver from '@/models/Driver';
import User from '@/models/User';

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
        if (!(await isAdmin())) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        await dbConnect();
        const data = await req.json();

        // Validate required fields
        if (!data.name || !data.phone || !data.vehicleType || !data.vehicleNumber) {
            return NextResponse.json({
                error: 'Name, phone, vehicle type, and vehicle number are required'
            }, { status: 400 });
        }

        // 1. Check if User exists, OR create new User
        let user = await User.findOne({ phone: data.phone });

        if (!user) {
            // Default password is last 4 digits of phone
            const defaultPin = data.phone.slice(-4);

            // Note: We pass the PLAIN password here. 
            // The User model's pre-save hook handles the hashing correctly.
            user = await User.create({
                name: data.name,
                email: data.email || `driver.${data.phone}@airporttaxis.lk`, // Dummy email if not provided
                phone: data.phone,
                password: defaultPin,
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
            email: data.email || undefined,
            nic: data.nic ? data.nic : undefined,
            vehicleType: data.vehicleType,
            vehicleModel: data.vehicleModel,
            vehicleNumber: data.vehicleNumber,
            vehicleYear: data.vehicleYear,
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

