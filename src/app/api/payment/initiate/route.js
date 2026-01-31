import dbConnect from '@/lib/db';
import Booking from '@/models/Booking';
import { NextResponse } from 'next/server';
import { getActiveGateway, GATEWAY_CONFIG } from '@/lib/payment';
import { logBookingCreated } from '@/lib/discord';

export async function POST(req) {
    try {
        await dbConnect();
        const data = await req.json();

        // Server-side sanitation: Remove invalid customer IDs (e.g. Google IDs)
        if (data.customer && typeof data.customer === 'string' && !/^[0-9a-fA-F]{24}$/.test(data.customer)) {
            console.warn(`Sanitizing invalid customer ID: ${data.customer}`);
            delete data.customer;
        }

        const gateway = getActiveGateway();

        // 1. Create the booking record
        const booking = await Booking.create({
            ...data,
            paymentStatus: 'pending',
            paymentMethod: data.paymentMethod || 'card',
        });

        // Log to Discord
        await logBookingCreated(booking).catch(console.error);

        // 2. Generate payment URL based on gateway
        let paymentUrl;
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

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
