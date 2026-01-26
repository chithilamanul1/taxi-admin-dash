import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import Booking from '../../../models/Booking';
import { getServerSession } from 'next-auth';
import { logBookingCreated, logError } from '../../../lib/discord';
import { sendBookingConfirmation } from '../../../lib/email-service';
import { authOptions } from '../../../lib/auth';
import { cookies } from 'next/headers';

export async function GET(request) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        const { searchParams } = new URL(request.url);
        const ids = searchParams.get('ids');

        // Check for admin cookie as fallback
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;
        const driverToken = cookieStore.get('driver_token')?.value;

        let isCustomAdmin = false;
        if (token) {
            try {
                const { verify } = await import('jsonwebtoken');
                const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;
                const decoded = verify(token, secret);
                if (decoded.role === 'admin') isCustomAdmin = true;
            } catch (e) { }
        }

        let isDriver = false;
        let driverId = null;
        if (driverToken) {
            try {
                const { verify } = await import('jsonwebtoken');
                const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'seranex_secret_key_12345';
                const decoded = verify(driverToken, secret);
                if (decoded.role === 'driver') {
                    isDriver = true;
                    driverId = decoded.id;
                }
            } catch (e) { }
        }

        let query = {};

        // Admin access: either role is admin or has valid admin token
        if ((session?.user?.role === 'admin') || isCustomAdmin) {
            // Admin sees all (no filter)
        } else if (isDriver) {
            query.driver = driverId;
        } else if (session) {
            // Logged in user sees their own bookings by email (not ObjectId, since Google IDs aren't ObjectIds)
            query.customerEmail = session.user.email;
        } else if (ids) {
            // Guest sees specific IDs
            const idList = ids.split(',').filter(id => id.match(/^[0-9a-fA-F]{24}$/));
            query._id = { $in: idList };
        } else {
            // Unauthorized
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const bookings = await Booking.find(query).sort({ createdAt: -1 });
        return NextResponse.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}

import User from '../../../models/User';

export async function POST(request) {
    try {
        await dbConnect();
        const data = await request.json();
        const session = await getServerSession(authOptions);

        // Fix: If logged in, find the actual User _id by email
        // The client often sends the Google ID string (e.g. "117...") which causes CastError
        if (session?.user?.email) {
            const user = await User.findOne({ email: session.user.email });
            if (user) {
                data.customer = user._id; // Replace with valid MongoDB ObjectId
                data.customerEmail = session.user.email; // Ensure email is set
                data.customerName = data.customerName || session.user.name;
            } else {
                // User logged in but not in DB? Rare, but safest to unset invalid customer ID
                delete data.customer;
            }
        } else {
            // Guest booking: Remove any invalid customer ID sent by client
            delete data.customer;
        }

        const booking = await Booking.create(data);

        // Log to Discord
        try {
            await logBookingCreated(booking);
        } catch (discordError) {
            console.error('Discord logging failed:', discordError);
        }

        // Send Email to Customer AND Owner
        try {
            await sendBookingConfirmation(booking);
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
        }

        return NextResponse.json(booking, { status: 201 });
    } catch (error) {
        console.error('Error creating booking:', error);

        // Log error to Discord
        try {
            await logError(error, 'Booking Creation');
        } catch (e) { }

        return NextResponse.json({ message: 'Failed to create booking', error: error.message }, { status: 400 });
    }
}
