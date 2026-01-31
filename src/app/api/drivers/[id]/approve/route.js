import dbConnect from '@/lib/db';
import Driver from '@/models/Driver';
import User from '@/models/User';
import WalletTransaction from '@/models/WalletTransaction';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(req, { params }) {
    try {
        await dbConnect();
        const { id } = params;
        const body = await req.json();
        const { action } = body;

        console.log(`[APPROVE] Processing driver ${id} action: ${action}`);

        const driver = await Driver.findById(id);
        if (!driver) {
            return NextResponse.json({ success: false, message: 'Driver not found' }, { status: 404 });
        }

        if (action === 'reject') {
            driver.verificationStatus = 'rejected';
            await driver.save();
            return NextResponse.json({ success: true, message: 'Driver application rejected' });
        }

        if (action === 'approve') {
            // 1. Create User Account
            const tempPassword = 'Driver@2025';

            // Safety check for bcrypt
            const hasher = bcrypt.hash || (bcrypt.default && bcrypt.default.hash);
            if (typeof hasher !== 'function') {
                throw new Error('bcrypt hashing function not found');
            }

            const hashedPassword = await hasher(tempPassword, 10);

            // Check if user exists
            let user = await User.findOne({ email: driver.email });
            if (!user) {
                // If phone exists but email doesn't?
                user = await User.findOne({ phone: driver.phone });
            }

            if (!user) {
                user = await User.create({
                    name: driver.name,
                    email: driver.email || `driver.${driver.phone}@airporttaxitours.lk`,
                    password: hashedPassword,
                    role: 'driver',
                    phone: driver.phone
                });
            } else {
                user.role = 'driver';
                user.phone = driver.phone;
                await user.save();
            }

            // 2. Link User to Driver & Verify
            driver.user = user._id;
            driver.verificationStatus = 'verified';
            driver.status = 'free'; // Ready to take rides

            // Process Initial Deposit (Credit Wallet)
            if (driver.initialDeposit && driver.initialDeposit.amount > 0 && driver.initialDeposit.status === 'pending') {
                const amount = driver.initialDeposit.amount;

                // Create Transaction Record
                await WalletTransaction.create({
                    driver: driver._id,
                    type: 'deposit',
                    amount: amount,
                    status: 'completed',
                    description: 'Initial Registration Deposit',
                    reference: 'REG-INIT-' + driver._id.toString().slice(-6),
                    receiptUrl: driver.initialDeposit.receipt
                });

                // Update Driver Balance
                driver.walletBalance = (driver.walletBalance || 0) + amount;
                driver.initialDeposit.status = 'verified';
                console.log(`[WALLET] Credited initial deposit of ${amount} to driver ${driver._id}`);
            }

            await driver.save();

            // 3. Send WhatsApp Notification (Mock/Actual)
            // Ideally, import sendWhatsApp from lib/twilio
            console.log(`[NOTIFICATION] Sending Driver Approval WhatsApp to ${driver.phone}`);

            return NextResponse.json({
                success: true,
                message: 'Driver approved and account created',
                credentials: { email: driver.email, password: tempPassword }
            });
        }

        return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });

    } catch (error) {
        console.error('Driver Approval Error:', error);
        return NextResponse.json(
            { success: false, message: error.message || 'Server error' },
            { status: 500 }
        );
    }
}
