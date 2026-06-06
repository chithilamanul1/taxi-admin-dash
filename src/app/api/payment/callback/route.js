import dbConnect from '@/lib/db';
import Booking from '@/models/Booking';
import Coupon from '@/models/Coupon';
import { NextResponse } from 'next/server';
import { getActiveGateway, verifySampathSignature, completePayCorpTransaction, GATEWAY_CONFIG } from '@/lib/payment';
import { sendPaymentConfirmation, sendOwnerNotification } from '@/lib/email-service';
import { logPaymentReceived, logError } from '@/lib/discord';

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

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://taxi-admin-dash.vercel.app/';

        // 1. Validate Input
        if (!reqid) {
            console.error("Missing reqid in callback");
            return NextResponse.redirect(`${baseUrl}/payment/failed?reason=missing_reqid`);
        }

        await dbConnect();

        let transaction;

        // 2. Find Booking by reqId (paymentReference)
        // If not found, try by clientRef if available
        let booking = await Booking.findOne({ paymentReference: reqid });

        if (!booking && clientRef) {
            booking = await Booking.findById(clientRef).catch(() => null);
        }

        // 3. If no booking, check for Transaction (Driver Top-up)
        if (!booking) {
            const { default: Transaction } = await import('@/models/Transaction');
            transaction = await Transaction.findOne({ paymentReference: reqid });

            if (!transaction && clientRef) {
                transaction = await Transaction.findById(clientRef).catch(() => null);
            }
        }

        if (!booking && !transaction) {
            console.error(`Booking/Transaction not found for reqid: ${reqid}`);
            return NextResponse.redirect(`${baseUrl}/payment/failed?reason=record_not_found`);
        }

        // 4. Verify Payment (Server-to-Server)
        // Ensure we use the correct Client ID based on the booking's currency
        const currency = (booking || transaction)?.currency || 'LKR';
        const clientId = GATEWAY_CONFIG.sampath.clientIds[currency] || GATEWAY_CONFIG.sampath.clientId;

        console.log(`Verifying PayCorp for ${currency} using ClientID: ${clientId}`);
        const verification = await completePayCorpTransaction(reqid, clientId);

        if (verification.success) {
            if (booking) {
                const prevStatus = booking.paymentStatus;
                booking.paymentStatus = booking.paymentType === 'partial' ? 'partial' : 'paid';
                booking.paymentReference = verification.data.txnId || reqid;
                booking.gatewayResponse = JSON.stringify(verification.data);
                booking.paymentTimestamp = new Date();
                await booking.save();

                // Increment Coupon Usage if status changed to paid/partial for the first time
                if ((booking.paymentStatus === 'paid' || booking.paymentStatus === 'partial') && (prevStatus === 'pending' || prevStatus === 'failed')) {
                    if (booking.appliedCoupons && booking.appliedCoupons.length > 0) {
                        await Coupon.updateMany(
                            { code: { $in: booking.appliedCoupons } },
                            { $inc: { usedCount: 1 } }
                        ).catch(err => console.error("Error updating coupon usage:", err));
                    }
                }

                await sendPaymentConfirmation(booking).catch(err => console.error("Error sending receipt:", err));

                // Notify Owner
                await sendOwnerNotification('Payment Received', {
                    BookingId: booking._id.toString().slice(-8),
                    Customer: booking.customerName,
                    Amount: `${booking.currency || 'LKR'} ${((booking.currency && booking.currency !== 'LKR' && booking.displayPaidAmount) ? booking.displayPaidAmount : (booking.paidAmount || 0)).toLocaleString()}`,
                    Reference: verification.data.txnId || reqid,
                    Type: booking.type || 'Transfer'
                }).catch(console.error);

                // Log to Discord
                await logPaymentReceived(booking, {
                    method: 'Sampath Bank',
                    transactionId: verification.data.txnId || reqid
                }).catch(err => console.error("Discord Log Error:", err));

                return NextResponse.redirect(`${baseUrl}/payment/success?bookingId=${booking._id}&provider=sampath&txnId=${verification.data.txnId || reqid}`);
            }

            if (transaction) {
                // ... Transaction Logic ...
                // Prevent double crediting
                if (transaction.status === 'completed') {
                    return NextResponse.redirect(`${baseUrl}/driver?topup=success`);
                }

                transaction.status = 'completed';
                transaction.paymentReference = verification.data.txnId || reqid;
                await transaction.save();

                // Credit Driver Wallet
                const { default: Driver } = await import('@/models/Driver');
                const driver = await Driver.findById(transaction.driver);
                if (driver) {
                    driver.walletBalance += transaction.amount;
                    await driver.save();
                    // Update transaction snapshot
                    transaction.balanceAfter = driver.walletBalance;
                    await transaction.save();
                }

                // If tip, redirect to customer booking page
                if (transaction.performedBy === 'Customer' && transaction.referenceId) {
                    // Update the booking tip info
                    const booking = await import('@/models/Booking').then(m => m.default).findById(transaction.referenceId);
                    if (booking) {
                        booking.tipAmount = transaction.amount;
                        booking.tipTransactionId = transaction._id;
                        await booking.save();
                    }
                    return NextResponse.redirect(`${baseUrl}/booking/${transaction.referenceId}?tip=success`);
                }

                return NextResponse.redirect(`${baseUrl}/driver?topup=success`);
            }
        } else {
            // Payment Failed
            const responseCode = verification.responseCode;
            console.error(`Payment Verification Failed. Code: ${responseCode}, Message: ${verification.message}`);

            if (booking) {
                const isCancelled = responseCode === '0R';

                booking.paymentStatus = 'failed';
                booking.gatewayResponse = JSON.stringify(verification.data);
                booking.gatewayReason = verification.message;
                await booking.save();

                // Import logging utilities
                const { logError, logPaymentCancelled } = await import('@/lib/discord');

                if (isCancelled) {
                    await logPaymentCancelled(booking, "User cancelled or session timed out (0R)").catch(err => console.error("Discord Log Error:", err));
                    return NextResponse.redirect(`${baseUrl}/payment/failed?bookingId=${booking._id}&reason=cancelled`);
                } else {
                    // Log Error to Discord
                    await logError(new Error(`Sampath Payment Failed: ${responseCode} - ${verification.message}`), `Booking: ${booking._id}`).catch(err => console.error("Discord Log Error:", err));

                    // Notify Owner
                    await sendOwnerNotification('Payment Failed', {
                        BookingId: booking._id.toString().slice(-8),
                        Customer: booking.customerName,
                        Amount: booking.totalPrice,
                        Error: verification.message,
                        Code: responseCode
                    }).catch(console.error);

                    return NextResponse.redirect(`${baseUrl}/payment/failed?bookingId=${booking._id}&reason=${encodeURIComponent(verification.message || 'payment_failed')}`);
                }
            }

            if (transaction) {
                transaction.status = 'failed';
                await transaction.save();
                return NextResponse.redirect(`${baseUrl}/driver?topup=failed`);
            }
        }

    } catch (error) {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://taxi-admin-dash.vercel.app/';
        return NextResponse.redirect(`${baseUrl}/payment/failed?reason=callback_system_error`);
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
            // Sampath background notification (if any)
            bookingId = data.order_id || data.clientRef;
            status = (data.status_code === '2' || data.status_code === '200' || data.response_code === '00') ? 'success' : 'failed';
            transactionId = data.transaction_id || data.txnId || `SAMPATH-${Date.now()}`;
            isValid = verifySampathSignature(data);
        } else if (gateway === 'payhere') {
            // PayHere background notification (POST)
            bookingId = data.order_id;
            status = data.status_code === '2' ? 'success' : 'failed';
            transactionId = data.payment_id;

            const { verifyPayHereSignature } = require('@/lib/payment');
            isValid = verifyPayHereSignature(data);

            console.log(`PayHere Callback: status_code=${data.status_code}, bookingId=${bookingId}, isValid=${isValid}`);
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
        const prevStatus = booking.paymentStatus;
        if (status === 'success') {
            booking.paymentStatus = booking.paymentType === 'partial' ? 'partial' : 'paid';
        } else {
            booking.paymentStatus = 'failed';
        }
        booking.paymentReference = transactionId;
        booking.paymentTimestamp = new Date();
        booking.gatewayResponse = JSON.stringify(data); // Save raw response for audit
        await booking.save();

        // Increment Coupon Usage if status changed to paid/partial for the first time
        if ((booking.paymentStatus === 'paid' || booking.paymentStatus === 'partial') && (prevStatus === 'pending' || prevStatus === 'failed')) {
            if (booking.appliedCoupons && booking.appliedCoupons.length > 0) {
                await Coupon.updateMany(
                    { code: { $in: booking.appliedCoupons } },
                    { $inc: { usedCount: 1 } }
                ).catch(err => console.error("Error updating coupon usage:", err));
            }
        }

        // Send Receipt if successful
        if (status === 'success') {
            await sendPaymentConfirmation(booking).catch(err => console.error("Error sending receipt:", err));

            // Notify Owner
            await sendOwnerNotification('Background Payment Success', {
                BookingId: booking._id.toString().slice(-8),
                Customer: booking.customerName,
                Status: booking.paymentStatus
            }).catch(console.error);
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
