import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Driver from '@/models/Driver';
import Transaction from '@/models/Transaction';

export async function POST(req) {
    try {
        await dbConnect();
        const body = await req.json();
        const { driverId, amount, status, transactionId } = body;

        if (status !== 'success') {
            return NextResponse.json({ error: 'Payment failed' }, { status: 400 });
        }

        const driver = await Driver.findById(driverId);
        if (!driver) {
            return NextResponse.json({ error: 'Driver not found' }, { status: 404 });
        }

        // Crediting wallet
        driver.walletBalance = (driver.walletBalance || 0) + Number(amount);
        await driver.save();

        // Record Transaction
        await Transaction.create({
            driver: driverId,
            type: 'credit',
            amount: Number(amount),
            balanceAfter: driver.walletBalance,
            description: `Card Top-up`,
            referenceId: null, // Could be IPG Ref ID if we had one
            status: 'completed',
            performedBy: 'Driver (Card)'
        });

        return NextResponse.json({ success: true, newBalance: driver.walletBalance });

    } catch (error) {
        console.error('Payment Webhook Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
