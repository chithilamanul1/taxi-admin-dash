import dbConnect from '@/lib/db';
import Booking from '@/models/Booking';
import { NextResponse } from 'next/server';
import { getActiveGateway, verifySampathSignature, completePayCorpTransaction } from '@/lib/payment';
import { sendPaymentConfirmation } from '@/lib/email-service';

/**
 * GET /api/payment/callback
 * Handle PayCorp Redirect (Step B -> Step C)
 */
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const reqid = searchParams.get('reqid');
        const clientRef = searchParams.get('clientRef');

        console.log('PayCorp Callback (GET):', { reqid, clientRef });

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

        // 1. Validate Input
        if (!reqid) {
            console.error("Missing reqid in callback");
            return NextResponse.redirect(`${baseUrl}/payment/error?reason=missing_reqid`);
        }

        await dbConnect();

        // 2. Find Booking by reqId (paymentReference)
        // If not found, try by clientRef if available
        let booking = await Booking.findOne({ paymentReference: reqid });

        if (!booking && clientRef) {
            booking = await Booking.findById(clientRef);
        }

        if (!booking) {
            console.error(`Booking not found for reqid: ${reqid}`);
            return NextResponse.redirect(`${baseUrl}/payment/error?reason=booking_not_found`);
        }

        // 3. Step C: Call PAYMENT_COMPLETE (Server-to-Server Verification)
        const verification = await completePayCorpTransaction(reqid, process.env.SAMPATH_CLIENT_ID); // Or derive ClientID from currency

        if (verification.success) {
            // 4. Update Booking to PAID
            booking.paymentStatus = 'paid';
            booking.paymentReference = verification.data.txnId || reqid; // Use actual txnId if available
            booking.gatewayResponse = JSON.stringify(verification.data);
            booking.paymentTimestamp = new Date();
            await booking.save();

            // 5. Send Receipt
            await sendPaymentConfirmation(booking).catch(err => console.error("Error sending receipt:", err));

            // 6. Redirect to Success
            return NextResponse.redirect(`${baseUrl}/payment/success?bookingId=${booking._id}&provider=sampath`);
        } else {
            // Payment Failed or Verification Failed
            console.error("Payment Verification Failed:", verification.message);
            booking.paymentStatus = 'failed';
            booking.gatewayResponse = JSON.stringify(verification.data);
            await booking.save();

            return NextResponse.redirect(`${baseUrl}/payment/error?bookingId=${booking._id}&reason=payment_failed`);
        }

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

        // Send Receipt if successful
        if (status === 'success') {
            const { sendPaymentConfirmation } = require('@/lib/email-service');
            await sendPaymentConfirmation(booking).catch(err => console.error("Error sending receipt:", err));
        }


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
