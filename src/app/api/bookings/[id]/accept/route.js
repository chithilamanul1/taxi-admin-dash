import dbConnect from '@/lib/db';
import Booking from '@/models/Booking';
import { pusher } from '@/lib/pusher';
import { NextResponse } from 'next/server';

export async function POST(req, { params }) {
    try {
        await dbConnect();
        const { id } = params;
        const { driverId } = await req.json();

        const booking = await Booking.findById(id);
        if (!booking) {
            return NextResponse.json({ success: false, message: 'Booking not found' }, { status: 404 });
        }

        // Verify it's assigned to this driver
        if (booking.driver?.toString() !== driverId) {
            console.warn(`[Auth-403] Unauthorized Accept update. Booking#${id}. Assigned: ${booking.driver}. Body-Driver: ${driverId}`);
            return NextResponse.json({ success: false, message: 'Unauthorized driver' }, { status: 403 });
        }

        booking.status = 'ongoing';
        await booking.save();

        // Broadcast to Pusher for real-time updates
        if (pusher) {
            await pusher.trigger(`booking-${id}`, 'status-update', {
                status: 'ongoing',
                message: 'Driver has started the trip'
            });
            await pusher.trigger('admin-dashboard', 'booking-update', {
                bookingId: id,
                status: 'ongoing'
            });
        }

        return NextResponse.json({ success: true, message: 'Trip started successfully' });

    } catch (error) {
        console.error('Accept Booking Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
