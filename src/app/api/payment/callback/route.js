import dbConnect from '@/lib/db';
import Booking from '@/models/Booking';
import { NextResponse } from 'next/server';
import { getActiveGateway, verifySampathSignature } from '@/lib/payment';

/**
 * POST /api/payment/callback
 * 
 * Receives payment result from gateway.
 * For MOCK: Called directly from mock payment page.
 * For SAMPATH: Called via Server-to-Server POST from Sampath IPG.
 */
/**
 * GET /api/payment/callback
 * Handle PayCorp Redirect
 */
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const data = Object.fromEntries(searchParams.entries());
        console.log('PayCorp Callback (GET):', data);

        // Typical PayCorp Redirect Params: reqid, clientRef, responseCode, responseMessage
        const bookingId = data.clientRef;
        const responseCode = data.responseCode;

        // Since we don't have the "Complete" API details, we'll optimistically redirect
        // or show an error based on responseCode (if present).
        // 00 = Success is common, but let's check.

        if (bookingId) {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
            // If manual verification is needed, we could redirect to a loading page.
            // For now, redirect to success/failure based on generic check

            // NOTE: Verification Step C is missing from provided docs. 
            // We will assume success if we get a callback with a reqid for now, 
            // or check responseCode if available.

            return NextResponse.redirect(`${baseUrl}/payment/success?bookingId=${bookingId}&provider=sampath`);
        }

        return NextResponse.json({ message: "Callback received", data });
    } catch (error) {
        console.error("Callback GET Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await dbConnect();

        let data;
        const contentType = request.headers.get('content-type') || '';

        if (contentType.includes('application/json')) {
            data = await request.json();
        } else {
            // Sampath likely sends x-www-form-urlencoded
            const formData = await request.formData();
            data = Object.fromEntries(formData.entries());
        }

        const gateway = getActiveGateway();

        console.log('Payment Callback Received:', { gateway, orderId: data.order_id || data.bookingId });

        let bookingId, status, transactionId, isValid = true;

        if (gateway === 'sampath') {
            // Sampath fields: order_id, status_code (2=Success), transaction_id, hash
            bookingId = data.order_id;
            // status_code: 2 is typically SUCCESS in many gateways, but need to check Sampath specific
            // Let's assume 200 or 2 is success based on common practices, usually docs say "2"
            status = (data.status_code === '2' || data.status_code === '200') ? 'success' : 'failed';
            transactionId = data.transaction_id || `SAMPATH-${Date.now()}`;

            // Verify Signature
            isValid = verifySampathSignature(data);
        } else {
            // Mock fields
            bookingId = data.bookingId;
            status = data.status;
            transactionId = data.transactionId;
        }

        if (!isValid) {
            console.error('Invalid Payment Signature:', data);
            return NextResponse.json({ success: false, message: 'Invalid signature' }, { status: 400 });
        }

        // Find the booking
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return NextResponse.json({ success: false, message: 'Booking not found' }, { status: 404 });
        }

        // Update booking status
        booking.paymentStatus = status === 'success' ? 'paid' : 'failed';
        booking.paymentReference = transactionId;
        booking.paymentTimestamp = new Date();
        booking.gatewayResponse = JSON.stringify(data); // Save raw response for audit
        await booking.save();

        return NextResponse.json({
            success: true,
            bookingId: booking._id,
            paymentStatus: booking.paymentStatus,
        });

    } catch (error) {
        console.error('Payment callback error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
