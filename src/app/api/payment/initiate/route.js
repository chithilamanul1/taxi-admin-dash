import dbConnect from '@/lib/db';
import Booking from '@/models/Booking';
import { NextResponse } from 'next/server';
import { getGatewayForCurrency, GATEWAY_CONFIG } from '@/lib/payment';
import { logBookingCreated } from '@/lib/discord';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req) {
    try {
        await dbConnect();
        const data = await req.json();
        const { bookingId, retry } = data;

        let baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://taxi-admin-dash.vercel.app';
        if (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1);

        const origin = req.headers.get('origin') || req.headers.get('referer');
        if (origin) {
            try {
                baseUrl = new URL(origin).origin;
            } catch (e) {
                // Ignore parsing errors
            }
        }

        // --- RETRY LOGIC for Existing Bookings ---
        if (retry && bookingId) {
            const existingBooking = await Booking.findById(bookingId);
            if (!existingBooking) {
                return NextResponse.json({ success: false, message: 'Booking not found' }, { status: 404 });
            }

            console.log(`[Payment Retry] Re-initiating for Booking: ${existingBooking._id}`);

            // Update booking payment split if requested dynamically by user on checkout view
            if (data.paymentType === 'partial') {
                existingBooking.paymentType = 'partial';
                existingBooking.paidAmount = existingBooking.totalPrice * 0.5;
                existingBooking.balanceAmount = existingBooking.totalPrice * 0.5;
                if (existingBooking.displayPrice) {
                    existingBooking.displayPaidAmount = existingBooking.displayPrice * 0.5;
                    existingBooking.displayBalanceAmount = existingBooking.displayPrice * 0.5;
                }
                await existingBooking.save();
            } else if (data.paymentType === 'full') {
                existingBooking.paymentType = 'full';
                existingBooking.paidAmount = existingBooking.totalPrice;
                existingBooking.balanceAmount = 0;
                if (existingBooking.displayPrice) {
                    existingBooking.displayPaidAmount = existingBooking.displayPrice;
                    existingBooking.displayBalanceAmount = 0;
                }
                await existingBooking.save();
            }

            const gateway = getGatewayForCurrency(existingBooking.currency);

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
                    paymentUrl: `/payment/mock?bookingId=${existingBooking._id}&amount=${chargeAmount}`,
                    gateway
                });
            } else if (gateway === 'payhere') {
                return NextResponse.json({
                    success: true,
                    paymentUrl: `/payment/payhere?bookingId=${existingBooking._id}`,
                    gateway
                });
            }
        }

        // Server-side sanitation: Remove invalid customer IDs (e.g. Google IDs)
        if (data.customer && typeof data.customer === 'string' && !/^[0-9a-fA-F]{24}$/.test(data.customer)) {
            console.warn(`Sanitizing invalid customer ID: ${data.customer}`);
            delete data.customer;
        }

        const gateway = getGatewayForCurrency(data.currency || 'USD');

        // 1. Create the booking record
        const bookingData = {
            ...data,
            whatsappNumber: data.whatsappNumber,
            paymentStatus: 'pending',
            paymentMethod: data.paymentMethod || 'card',
        };

        // Explicitly handle billingDetails if provided in the express checkout flow
        if (data.billingDetails) {
            bookingData.billingDetails = data.billingDetails;
        }

        // Enrich with session data (so logged-in users can view bookings later)
        const session = await getServerSession(authOptions);
        if (session?.user?.email) {
            bookingData.customerEmail = bookingData.customerEmail || session.user.email;
            bookingData.customerName = bookingData.customerName || session.user.name;
        }

        const booking = await Booking.create(bookingData);

        console.log(`[Payment Init] Booking: ${booking._id} | Type: ${booking.paymentType} | Total: ${booking.totalPrice} | Charging: ${booking.paidAmount || booking.totalPrice}`);

        // Log to Discord
        await logBookingCreated(booking).catch(console.error);

        // Internal Notification for Admin Dashboard
        try {
            const Notification = (await import('@/models/Notification')).default;
            await Notification.create({
                type: 'booking',
                title: data.paymentMethod === 'cash' ? 'New Cash Booking' : 'New Card Payment Request',
                message: `Booking from ${booking.customerName || 'Guest'}: ${booking.pickupLocation?.address?.split(',')[0]} to ${booking.dropoffLocation?.address?.split(',')[0]}`,
                link: '/admin?view=bookings'
            });
        } catch (notificationError) {
            console.error('[Notification Error]', notificationError);
        }

        // baseUrl is already resolved at the top

        // 2. Handle CASH payments (No gateway init needed)
        if (data.paymentMethod === 'cash') {
            // Send Email Confirmation immediately for Cash (Already handled below, but keeping logic consistent)
            try {
                const { sendBookingConfirmation } = require('@/lib/email-service');
                await sendBookingConfirmation(booking);
            } catch (emailError) {
                console.error('[Cash Booking] Email failed:', emailError);
            }

            return NextResponse.json({
                success: true,
                bookingId: booking._id,
                paymentUrl: `/payment/success?bookingId=${booking._id}`,
                gateway: 'cash'
            });
        }

        // 3. Generate payment URL based on gateway (For CARD payments)
        let paymentUrl;

        if (gateway === 'mock') {
            // Mock payment: Redirect to our mock payment page
            // CRITICAL FIX: Use paidAmount (which reflects Partial Payment) instead of totalPrice
            const chargeAmount = booking.paidAmount > 0 ? booking.paidAmount : booking.totalPrice;
            paymentUrl = `/payment/mock?bookingId=${booking._id}&amount=${chargeAmount}`;
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
            paymentUrl = `/payment/payhere?bookingId=${booking._id}`;
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
