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

        const driver = new Driver({
            name: data.name,
            phone: data.phone,
            email: data.email || '',
            vehicleType: data.vehicleType,
            vehicleNumber: data.vehicleNumber,
            isOnline: false,
            status: 'free'
        });

        await driver.save();
        return NextResponse.json(driver, { status: 201 });
    } catch (error) {
        console.error('Error creating driver:', error);
        return NextResponse.json({ error: error.message || 'Failed to create driver' }, { status: 500 });
    }
}

