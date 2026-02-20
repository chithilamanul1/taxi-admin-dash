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
            return NextResponse.json({ success: false, message: 'Unauthorized driver' }, { status: 403 });
        }

        booking.status = 'completed';
        booking.paymentStatus = 'paid'; // Assumed completion means paid
        await booking.save();

        // Broadcast to Pusher
        if (pusher) {
            await pusher.trigger(`booking-${id}`, 'status-update', {
                status: 'completed',
                message: 'Trip completed. Thank you for riding with us!'
            });
            await pusher.trigger('admin-dashboard', 'booking-update', {
                bookingId: id,
                status: 'completed'
            });
        }

        return NextResponse.json({ success: true, message: 'Trip completed successfully' });

    } catch (error) {
        console.error('Finish Booking Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
