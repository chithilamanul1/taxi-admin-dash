import dbConnect from '@/lib/db';
import Transaction from '@/models/Transaction';
import Driver from '@/models/Driver';
import { NextResponse } from 'next/server';
import { getActiveGateway } from '@/lib/payment';

export async function POST(req) {
    try {
        await dbConnect();
        const body = await req.json();
        const { amount, driverId, description } = body;

        if (!amount || !driverId) {
            return NextResponse.json({ error: 'Amount and Driver ID are required' }, { status: 400 });
        }

        const gateway = getActiveGateway();
        console.log("PAYMENT DEBUG: Active Gateway is:", gateway, "Env Var:", process.env.PAYMENT_GATEWAY);

        // 1. Create a Pending Transaction Record
        const transaction = await Transaction.create({
            driver: driverId,
            type: 'credit', // Money coming IN to the system (Driver pays us)
            amount: parseFloat(amount),
            balanceAfter: 0, // Will update on completion
            description: description || 'Wallet Top-up',
            status: 'pending',
            performedBy: 'Driver',
        });

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://taxi-admin-dash.vercel.app/';

        // 2. Initiate Payment based on Gateway
        let paymentUrl;

        if (gateway === 'mock') {
            // Updated Mock URL to include transactionId
            // Note: Use transaction._id so callback can find it
            paymentUrl = `${baseUrl}/payment/mock-gateway?amount=${amount}&driverId=${driverId}&transactionId=${transaction._id}&ref=${Date.now()}`;
        } else if (gateway === 'sampath') {
            const { initiatePayCorpTransaction } = require('@/lib/payment');
            const returnUrl = `${baseUrl}/api/payment/callback`;

            // Make a "Booking-like" object for the payment utility
            const paymentContext = {
                _id: transaction._id,
                totalPrice: transaction.amount,
                paidAmount: transaction.amount, // Full amount for top-up
                currency: 'LKR', // Default for Wallet
                customerName: 'Driver Topup',
            };

            const result = await initiatePayCorpTransaction(paymentContext, returnUrl);

            if (result.success) {
                // Save reqId to transaction.paymentReference for callback matching
                transaction.paymentReference = result.reqId;
                await transaction.save();

                paymentUrl = result.paymentUrl;
            } else {
                // If init failed, mark transaction as failed
                transaction.status = 'failed';
                transaction.description += ` (Init Failed: ${result.message})`;
                await transaction.save();
                throw new Error(result.message || 'Payment initiation failed');
            }
        }

        return NextResponse.json({
            success: true,
            url: paymentUrl,
            transactionId: transaction._id
        });

    } catch (error) {
        console.error('Create Session Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
