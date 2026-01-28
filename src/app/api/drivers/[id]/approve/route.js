import dbConnect from '@/lib/db';
import Driver from '@/models/Driver';
import User from '@/models/User';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(req, { params }) {
    try {
        await dbConnect();
        const { id } = params;
        const { action } = await req.json(); // 'approve' or 'reject'

        const driver = await Driver.findById(id);
        if (!driver) {
            return NextResponse.json({ success: false, message: 'Driver not found' }, { status: 404 });
        }

        if (action === 'reject') {
            driver.verificationStatus = 'rejected';
            await driver.save();
            // TODO: Send rejection email/whatsapp
            return NextResponse.json({ success: true, message: 'Driver application rejected' });
        }

        if (action === 'approve') {
            // 1. Create User Account
            const tempPassword = 'Driver@2025'; // Default password for new drivers
            const hashedPassword = await bcrypt.hash(tempPassword, 10);

            // Check if user exists
            let user = await User.findOne({ email: driver.email });
            if (!user) {
                user = await User.create({
                    name: driver.name,
                    email: driver.email,
                    password: hashedPassword,
                    role: 'driver',
                    phone: driver.phone
                });
            } else {
                // If user exists, upgrade role to driver
                user.role = 'driver';
                user.phone = driver.phone; // key field for syncing
                await user.save();
            }

            // 2. Link User to Driver & Verify
            driver.user = user._id;
            driver.verificationStatus = 'verified';
            driver.status = 'free'; // Ready to take rides
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
