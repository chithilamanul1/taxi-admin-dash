import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Driver from '@/models/Driver';
import User from '@/models/User';

// POST - Driver login via phone number
export async function POST(req) {
    try {
        await connectDB();
        const { phone: rawPhone, pin } = await req.json();

        // Sanitize phone: remove spaces, dashes, etc.
        const phone = rawPhone.replace(/\D/g, '');
        console.log(`Driver Login Attempt: Raw "${rawPhone}" -> Cleaned "${phone}"`);

        // Search Strategy:
        // 1. Try to find a User first (for the new system)
        let user = await User.findOne({ phone });
        let driver = null;

        if (user) {
            driver = await Driver.findOne({ user: user._id }).populate('user');
        }

        // 2. Fallback: If no User found (or User has no linked driver), try finding Driver directly by phone
        // This handles "Legacy" or "Broken" drivers created before the fix
        if (!driver) {
            console.log(`User-linked driver not found. Searching Driver collection directly for ${phone}...`);
            driver = await Driver.findOne({ phone });
            // If found here, we should ideally populate 'user' but it might be missing
        }

        if (!driver) {
            console.log('Driver Not Found in either collection');
            return NextResponse.json({ error: `Driver account not found for number: ${phone}` }, { status: 404 });
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
