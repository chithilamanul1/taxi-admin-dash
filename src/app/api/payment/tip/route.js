import dbConnect from '@/lib/db';
import Transaction from '@/models/Transaction';
import Booking from '@/models/Booking';
import { NextResponse } from 'next/server';
import { getActiveGateway } from '@/lib/payment';

export async function POST(req) {
    try {
        await dbConnect();
        const body = await req.json();
        const { amount, bookingId, driverId } = body;

        if (!amount || !bookingId || !driverId) {
            return NextResponse.json({ error: 'Amount, Booking ID, and Driver ID are required' }, { status: 400 });
        }

        const gateway = getActiveGateway();

        // 1. Create a Pending Transaction Record for the Tip
        const transaction = await Transaction.create({
            driver: driverId,
            type: 'credit', // Money coming IN to the driver's wallet
            amount: parseFloat(amount),
            balanceAfter: 0, // Will update on completion
            description: `Tip from Booking #${bookingId.toString().slice(-6)}`,
            referenceId: bookingId,
            status: 'pending',
            performedBy: 'Customer',
        });

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://taxi-admin-dash.vercel.app/';

        // 2. Initiate Payment based on Gateway
        let paymentUrl;

        if (gateway === 'mock') {
            paymentUrl = `${baseUrl}/payment/mock-gateway?amount=${amount}&bookingId=${bookingId}&transactionId=${transaction._id}&type=tip&ref=${Date.now()}`;
        } else if (gateway === 'sampath') {
            const { initiatePayCorpTransaction } = require('@/lib/payment');
            const returnUrl = `${baseUrl}/api/payment/callback`;

            const paymentContext = {
                _id: transaction._id,
                totalPrice: transaction.amount,
                paidAmount: transaction.amount,
                currency: 'LKR',
                customerName: 'Customer Tip',
            };

            const result = await initiatePayCorpTransaction(paymentContext, returnUrl);

            if (result.success) {
                transaction.paymentReference = result.reqId;
                await transaction.save();
                paymentUrl = result.paymentUrl;
            } else {
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
        console.error('Tip Session Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
