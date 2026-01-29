import dbConnect from '@/lib/db';
import Driver from '@/models/Driver';
import Transaction from '@/models/Transaction';
import { NextResponse } from 'next/server';
import { initiatePayCorpTransaction } from '@/lib/payment';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// POST /api/driver/topup
export async function POST(req) {
    try {
        await dbConnect();

        // 1. Auth Check
        const session = await getServerSession(authOptions);
        if (!session || !session.user || session.user.role !== 'driver') {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const { amount } = await req.json();
        if (!amount || amount < 500) {
            return NextResponse.json({ success: false, message: 'Minimum top-up is 500 LKR' }, { status: 400 });
        }

        // 2. Find Driver
        // Assuming session.user.id links to User, which links to Driver?
        // Or if session.user.id IS the driver's User ID, we need to find the Driver record.
        // For simplicity, let's assume we find Driver by userId or email.
        const driver = await Driver.findOne({ user: session.user.id });
        if (!driver) {
            return NextResponse.json({ success: false, message: 'Driver profile not found' }, { status: 404 });
        }

        // 3. Create Pending Transaction
        const transaction = await Transaction.create({
            driver: driver._id,
            type: 'deposit',
            amount: amount,
            balanceAfter: driver.walletBalance, // Unchanged yet
            description: 'Wallet Top-up (Pending)',
            status: 'pending'
        });

        // 4. Mock Booking Object for Payment Lib
        // The initiatePayCorpTransaction expects a { _id, paidAmount ... } object
        const paymentPayload = {
            _id: transaction._id, // Use Transaction ID as Order Ref
            paidAmount: amount,
            totalPrice: amount,
            customerEmail: session.user.email,
        };

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const returnUrl = `${baseUrl}/api/driver/topup/callback`;

        // 5. Initiate Payment
        const result = await initiatePayCorpTransaction(paymentPayload, returnUrl);

        if (result.success) {
            return NextResponse.json({
                success: true,
                paymentUrl: result.paymentUrl
            });
        } else {
            // Mark transaction failed
            transaction.status = 'failed';
            await transaction.save();
            return NextResponse.json({ success: false, message: result.message }, { status: 500 });
        }

    } catch (error) {
        console.error('Top-up Init Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
