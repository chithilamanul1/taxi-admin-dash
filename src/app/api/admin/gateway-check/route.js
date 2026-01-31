import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Booking from '@/models/Booking';
import { getActiveGateway, initiatePayHereTransaction, initiatePayCorpTransaction } from '@/lib/payment';

export async function POST(req) {
    try {
        await dbConnect();

        // 1. Create a partial "Ghost" booking for testing
        // We use a predefined ID or format so it doesn't mess up real stats (or clean it up later)
        // For safety, we just create a real booking marked as 'test_mode'

        const testBooking = await Booking.create({
            customerName: 'System Admin',
            customerEmail: process.env.ADMIN_EMAIL || 'admin@airporttaxi.lk',
            guestPhone: '0000000000',
            pickupLocation: { address: 'Gateway Connection Test' },
            dropoffLocation: { address: 'HQ' },
            vehicleType: 'mini-car', // Dummy
            totalPrice: 30, // 30 LKR Test Charge
            paidAmount: 30,
            paymentStatus: 'pending',
            paymentMethod: 'card',
            status: 'cancelled', // Immediately cancel so it doesn't show as active ride
            notes: 'GATEWAY_TEST_TRANSACTION'
        });

        const gateway = getActiveGateway();
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        let paymentUrl;

        if (gateway === 'payhere') {
            // Use our new intermediate page
            paymentUrl = `${baseUrl}/payment/payhere?bookingId=${testBooking._id}`;
        } else if (gateway === 'sampath') {
            const result = await initiatePayCorpTransaction(testBooking, `${baseUrl}/api/payment/callback`);
            if (result.success) {
                paymentUrl = result.paymentUrl;
            } else {
                throw new Error(result.message);
            }
        } else {
            // Mock
            paymentUrl = `${baseUrl}/payment/mock?bookingId=${testBooking._id}&amount=30`;
        }

        return NextResponse.json({
            success: true,
            gateway,
            paymentUrl,
            message: `Initiated 30 LKR test charge via ${gateway}`
        });

    } catch (error) {
        console.error("Gateway Check Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
