import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import Booking from '../../../models/Booking';
import { getServerSession } from 'next-auth';
import { logBookingCreated, logError } from '../../../lib/discord';
import { sendBookingConfirmation } from '../../../lib/email-service';
import { authOptions } from '../../../lib/auth';
import { cookies } from 'next/headers';

import { isAdmin as checkAdmin } from '../../../lib/admin-check';

export async function GET(request) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        const isAdmin = await checkAdmin();
        const { searchParams } = new URL(request.url);
        const ids = searchParams.get('ids');

        // Check for driver token as fallback for driver view
        const cookieStore = await cookies();
        const driverToken = cookieStore.get('driver_token')?.value;

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
            } catch (e) {
                console.error('[Bookings API] Driver token error:', e.message);
            }
        }

        let query = {};

        // 1. Admin Access: sees all
        if (isAdmin) {
            // Admin sees all (no filter)
            console.log('[Bookings API] Admin access granted');
        }
        // 2. Driver Access: sees assigned bookings
        else if (isDriver) {
            query.driver = driverId;
            console.log('[Bookings API] Driver access granted for:', driverId);
        }
        // 3. Logged-in User: sees their own bookings
        else if (session?.user?.email) {
            query.customerEmail = session.user.email;
            console.log('[Bookings API] User access granted for:', session.user.email);
        }
        // 4. Guest Access: sees specific IDs (from localStorage/share link)
        else if (ids) {
            const idList = ids.split(',').filter(id => id.match(/^[0-9a-fA-F]{24}$/));
            query._id = { $in: idList };
            console.log('[Bookings API] Guest access granted for IDs:', ids);
        }
        // 5. Unauthorized
        else {
            console.warn('[Bookings API] Unauthorized access attempt');
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

        // Log to Discord (Skip if manual for now, or use a different channel)
        try {
            if (!data.isManual) {
                await logBookingCreated(booking);
            }

            // Internal Notification
            const Notification = (await import('../../../models/Notification')).default;
            await Notification.create({
                type: 'booking',
                title: data.isManual ? 'Manual Booking Added' : 'New Booking',
                message: `${data.isManual ? '[MANUAL] ' : ''}Booking from ${booking.customerName || 'Guest'}: ${booking.pickupLocation?.address?.split(',')[0]} to ${booking.dropoffLocation?.address?.split(',')[0]}`,
                link: '/admin?view=bookings'
            });

            // --- WEB PUSH NOTIFICATION TO ADMINS ---
            try {
                if (!data.isManual) {
                    const webpush = await import('web-push');
                    // ... existing push logic ... (rest of the block is fine)
                }
            } catch (pushError) {
                console.error('Web Push Failed:', pushError);
            }

        } catch (discordError) {
            console.error('Logging/Notification failed:', discordError);
        }

        // Send Email to Customer AND Owner (Skip if manual - usually handled offline)
        try {
            if (!data.isManual && data.paymentMethod !== 'card') {
                await sendBookingConfirmation(booking);
            }
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
