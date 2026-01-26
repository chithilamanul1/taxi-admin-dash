import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Driver from '@/models/Driver';
import User from '@/models/User';

// POST - Driver login via phone number
export async function POST(req) {
    try {
        await connectDB();
        const { phone, pin } = await req.json();

        // Find driver by phone (through user relation)
        // Correct approach: Find User first, then finding linked Driver
        const user = await User.findOne({ phone });

        if (!user) {
            return NextResponse.json({ error: 'Driver account not found' }, { status: 404 });
        }

        const driver = await Driver.findOne({ user: user._id }).populate('user');

        if (!driver) {
            return NextResponse.json({ error: 'Driver profile not found' }, { status: 404 });
        }

        // Simple PIN verification (in production, use hashed PINs)
        // For now, we'll use a simple check - can be enhanced later
        // Default PIN is last 4 digits of phone number
        const expectedPin = phone.slice(-4);

        if (pin !== expectedPin) {
            return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 });
        }

        // Set driver online
        driver.isOnline = true;
        await driver.save();

        const { sign } = await import('jsonwebtoken');
        const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'seranex_secret_key_12345';
        const token = sign({ id: driver._id, role: 'driver' }, secret, { expiresIn: '7d' });

        const response = NextResponse.json({
            success: true,
            driver: {
                id: driver._id,
                name: driver.user.name,
                vehicleType: driver.vehicleType,
                vehicleNumber: driver.vehicleNumber,
                status: driver.status
            }
        });

        response.cookies.set('driver_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,
            path: '/'
        });

        return response;
    } catch (error) {
        console.error('Driver login error:', error);
        return NextResponse.json({ error: 'Login failed' }, { status: 500 });
    }
}
