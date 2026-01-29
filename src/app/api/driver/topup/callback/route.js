import dbConnect from '@/lib/db';
import Driver from '@/models/Driver';
import Transaction from '@/models/Transaction';
import { NextResponse } from 'next/server';

// GET /api/driver/topup/callback
// Handles return from PayCorp
export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const data = Object.fromEntries(searchParams.entries());
        console.log('Top-up Callback:', data);

        // Params: clientRef (TransactionID), responseCode
        const transactionId = data.clientRef;
        const responseCode = data.responseCode;

        if (!transactionId) {
            return NextResponse.json({ message: "Invalid Callback" }, { status: 400 });
        }

        const transaction = await Transaction.findById(transactionId);
        if (!transaction) return NextResponse.json({ message: "Transaction not found" }, { status: 404 });

        if (transaction.status === 'completed') {
            // Already processed
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/driver/wallet?status=success`);
        }

        // Logic: Verify Payment Success
        // Assuming success if redirected back with ID (Mock/Dev) or ResponseCode=00
        const isSuccess = !responseCode || responseCode === '00' || responseCode === '0';

        if (isSuccess) {
            // Update Driver Balance
            const driver = await Driver.findById(transaction.driver);
            if (driver) {
                driver.walletBalance += transaction.amount;
                await driver.save();

                // Update Transaction
                transaction.status = 'completed';
                transaction.balanceAfter = driver.walletBalance;
                transaction.description = 'Wallet Top-up (Success)';
                await transaction.save();
            }

            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/driver/wallet?status=success`);
        } else {
            transaction.status = 'failed';
            await transaction.save();
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/driver/wallet?status=failed`);
        }

    } catch (error) {
        console.error("Top-up Callback Error:", error);
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/driver/wallet?status=error`);
    }
}
