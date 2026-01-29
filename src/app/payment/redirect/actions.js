'use server';

import dbConnect from '@/lib/db';
import Booking from '@/models/Booking';
import { generateSampathPayload } from '@/lib/payment';
import { redirect } from 'next/navigation';

export async function getBookingForPayment(bookingId) {
    try {
        await dbConnect();

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return { error: 'Booking not found' };
        }

        // Check if already paid
        if (booking.paymentStatus === 'paid') {
            return { error: 'Booking already paid' };
        }

        // Return URL (callback)
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        // Note: Sampath callback is a SERVER-TO-SERVER POST, but they might also redirect the user's browser via a "Return URL" field.
        // We'll use the callback API route for server sync, but for user redirect from bank, we might need a processing page.
        // Usually `return_url` in payload is where user is sent after payment.
        // This should point to a GET route that checks status.
        const returnUrl = `${baseUrl}/api/payment/callback/browser?bookingId=${booking._id}`;

        const payload = generateSampathPayload(booking, returnUrl);

        return { payload };

    } catch (error) {
        console.error("Payment init error:", error);
        return { error: 'System error initializing payment' };
    }
}
