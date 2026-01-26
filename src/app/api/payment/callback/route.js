import dbConnect from '@/lib/db';
import Booking from '@/models/Booking';
import { NextResponse } from 'next/server';
import { getActiveGateway, verifySampathSignature } from '@/lib/payment';

/**
 * POST /api/payment/callback
 * 
 * Receives payment result from gateway.
 * For MOCK: Called directly from mock payment page.
 * For SAMPATH: Would receive POST callback from Sampath IPG.
 */
export async function POST(request) {
    try {
        await dbConnect();
        const data = await request.json();
        const gateway = getActiveGateway();

        const { bookingId, status, transactionId, signature } = data;

        // Find the booking
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return NextResponse.json(
                { success: false, message: 'Booking not found' },
                { status: 404 }
            );
        }

        // Verify signature for Sampath (skip for mock)
        if (gateway === 'sampath' && signature) {
            const isValid = verifySampathSignature(data, signature);
            if (!isValid) {
                return NextResponse.json(
                    { success: false, message: 'Invalid signature' },
                    { status: 400 }
                );
            }
        }

        // Update booking status
        booking.paymentStatus = status === 'success' ? 'paid' : 'failed';
        booking.paymentReference = transactionId || `MOCK-${Date.now()}`;
        booking.paymentTimestamp = new Date();
        await booking.save();

        return NextResponse.json({
            success: true,
            bookingId: booking._id,
            paymentStatus: booking.paymentStatus,
        });

    } catch (error) {
        console.error('Payment callback error:', error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

// GET handler for redirect-based callbacks (some gateways use GET)
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('bookingId');
    const status = searchParams.get('status');

    // Redirect to appropriate page
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    if (status === 'success') {
        return NextResponse.redirect(`${baseUrl}/payment/success?bookingId=${bookingId}`);
    } else {
        return NextResponse.redirect(`${baseUrl}/payment/failed?bookingId=${bookingId}`);
    }
}
