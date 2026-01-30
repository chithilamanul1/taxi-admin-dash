import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Driver from '@/models/Driver';

export async function POST(req, { params }) {
    try {
        await dbConnect();
        // Await params if Next.js version requires it (Next 15+ async params)
        const { id } = await params;
        const body = await req.json();

        const { action, amount, remarks } = body;

        if (!amount || isNaN(amount) || amount <= 0) {
            return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
        }

        const driver = await Driver.findById(id);
        if (!driver) {
            return NextResponse.json({ error: 'Driver not found' }, { status: 404 });
        }

        if (action === 'topup') {
            const { default: Transaction } = await import('@/models/Transaction');

            // Update Driver
            driver.walletBalance = (driver.walletBalance || 0) + Number(amount);
            await driver.save();

            // Create Transaction
            await Transaction.create({
                driver: driver._id,
                type: 'credit',
                amount: Number(amount),
                balanceAfter: driver.walletBalance,
                description: remarks || 'Wallet Top-up by Admin',
                receiptUrl: body.receiptUrl,
                status: 'completed',
                performedBy: 'Admin'
            });

            return NextResponse.json({
                success: true,
                message: `Wallet topped up by Rs ${amount}`,
                balance: driver.walletBalance
            });
        }

        // Future: Handle 'deduct' or other actions if needed manually

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (error) {
        console.error('Wallet Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
