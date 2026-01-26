import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Booking from '@/models/Booking';
import { sendBookingConfirmation } from '@/lib/email-service';

export async function POST(request, { params }) {
    try {
        await dbConnect();

        let { id } = await params; // Ensure we await params!

        const booking = await Booking.findById(id);
        if (!booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        if (!booking.customerEmail) {
            return NextResponse.json({ error: 'No email address associated with this booking' }, { status: 400 });
        }

        // Send Email
        await sendBookingConfirmation(booking);

        return NextResponse.json({ success: true, message: 'Receipt sent to ' + booking.customerEmail });
    } catch (error) {
        console.error('Email trigger error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
