import dbConnect from '@/lib/db';
import Booking from '@/models/Booking';
import { NextResponse } from 'next/server';
import { getActiveGateway, GATEWAY_CONFIG } from '@/lib/payment';
import { logBookingCreated } from '@/lib/discord';

export async function POST(req) {
    try {
        await dbConnect();
        const data = await req.json();
        const { bookingId, retry } = data;

        // --- RETRY LOGIC for Existing Bookings ---
        if (retry && bookingId) {
            const existingBooking = await Booking.findById(bookingId);
            if (!existingBooking) {
                return NextResponse.json({ success: false, message: 'Booking not found' }, { status: 404 });
            }

            console.log(`[Payment Retry] Re-initiating for Booking: ${existingBooking._id}`);

            const gateway = getActiveGateway();
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://taxi-admin-dash.vercel.app/';

            if (gateway === 'sampath') {
                const { initiatePayCorpTransaction } = require('@/lib/payment');
                const returnUrl = `${baseUrl}/api/payment/callback`;
                const result = await initiatePayCorpTransaction(existingBooking, returnUrl);

                if (result.success) {
                    existingBooking.paymentReference = result.reqId;
                    await existingBooking.save();
                    return NextResponse.json({ success: true, paymentUrl: result.paymentUrl, gateway });
                } else {
                    return NextResponse.json({ success: false, message: result.message || 'Gateway error' }, { status: 500 });
                }
            } else if (gateway === 'mock') {
                const chargeAmount = existingBooking.paidAmount > 0 ? existingBooking.paidAmount : existingBooking.totalPrice;
                return NextResponse.json({
                    success: true,
                    paymentUrl: `${baseUrl}/payment/mock?bookingId=${existingBooking._id}&amount=${chargeAmount}`,
                    gateway
                });
            } else if (gateway === 'payhere') {
                return NextResponse.json({
                    success: true,
                    paymentUrl: `${baseUrl}/payment/payhere?bookingId=${existingBooking._id}`,
                    gateway
                });
            }
        }

        // Server-side sanitation: Remove invalid customer IDs (e.g. Google IDs)
        if (data.customer && typeof data.customer === 'string' && !/^[0-9a-fA-F]{24}$/.test(data.customer)) {
            console.warn(`Sanitizing invalid customer ID: ${data.customer}`);
            delete data.customer;
        }

        const gateway = getActiveGateway();

        // 1. Create the booking record
        const booking = await Booking.create({
            ...data,
            whatsappNumber: data.whatsappNumber, // Store explicitly if schema supports, or it might be in ...data
            paymentStatus: 'pending',
            paymentMethod: data.paymentMethod || 'card',
        });

        console.log(`[Payment Init] Booking: ${booking._id} | Type: ${booking.paymentType} | Total: ${booking.totalPrice} | Charging: ${booking.paidAmount || booking.totalPrice}`);

        // Log to Discord
        await logBookingCreated(booking).catch(console.error);

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://taxi-admin-dash.vercel.app/';

        // 2. Handle CASH payments (No gateway init needed)
        if (data.paymentMethod === 'cash') {
            // Send Email Confirmation immediately for Cash
            try {
                const { sendBookingConfirmation } = require('@/lib/email-service');
                await sendBookingConfirmation(booking);
            } catch (emailError) {
                console.error('[Cash Booking] Email failed:', emailError);
            }

            return NextResponse.json({
                success: true,
                bookingId: booking._id,
                paymentUrl: `${baseUrl}/payment/success?bookingId=${booking._id}`,
                gateway: 'cash'
            });
        }

        // 3. Generate payment URL based on gateway (For CARD payments)
        let paymentUrl;

        if (gateway === 'mock') {
            // Mock payment: Redirect to our mock payment page
            // CRITICAL FIX: Use paidAmount (which reflects Partial Payment) instead of totalPrice
            const chargeAmount = booking.paidAmount > 0 ? booking.paidAmount : booking.totalPrice;
            paymentUrl = `${baseUrl}/payment/mock?bookingId=${booking._id}&amount=${chargeAmount}`;
        } else if (gateway === 'sampath') {
            // Sampath PayCorp (REST API)
            const { initiatePayCorpTransaction } = require('@/lib/payment');
            const returnUrl = `${baseUrl}/api/payment/callback`; // We will use a dedicated callback route

            const result = await initiatePayCorpTransaction(booking, returnUrl);

            if (result.success) {
                // Save reqId for tracking
                booking.paymentReference = result.reqId;
                await booking.save();

                paymentUrl = result.paymentUrl;
            } else {
                throw new Error(result.message || 'Payment initiation failed');
            }
        } else if (gateway === 'payhere') {
            // PayHere (Form Post)
            // We redirect to an intermediate page that will auto-submit the form
            paymentUrl = `${baseUrl}/payment/payhere?bookingId=${booking._id}`;
        }

        return NextResponse.json({
            success: true,
            bookingId: booking._id,
            paymentUrl,
            gateway,
        });

    } catch (error) {
        console.error('Payment initiation error:', error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
