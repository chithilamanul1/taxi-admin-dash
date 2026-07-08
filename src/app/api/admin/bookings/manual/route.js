import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Booking from '@/models/Booking';
import { isAdmin } from '@/lib/admin-check';

export async function POST(req) {
    try {
        const adminCheck = await isAdmin();
        if (!adminCheck) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const body = await req.json();

        const {
            customerName,
            customerEmail,
            customerPhone,
            pickupAddress,
            dropoffAddress,
            amount,
            currency = 'LKR',
            paymentType = 'full',
            customAmount,
            notes,
            scheduledDate,
            scheduledTime,
            passengerCount,
            vehicleType
        } = body;

        if (!customerName || !amount) {
            return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
        }

        const totalLkr = currency === 'LKR' ? Number(amount) : Number(amount) * 330;
        let paidAmountLkr = 0;
        let displayPaidAmount = 0;

        if (paymentType === 'full') {
            displayPaidAmount = Number(amount);
            paidAmountLkr = totalLkr;
        } else if (paymentType === 'partial') {
            displayPaidAmount = Number(amount) * 0.5;
            paidAmountLkr = totalLkr * 0.5;
        } else if (paymentType === 'custom') {
            displayPaidAmount = Number(customAmount);
            paidAmountLkr = currency === 'LKR' ? Number(customAmount) : Number(customAmount) * 330;
        }

        const bookingData = {
            customerName,
            customerEmail,
            guestPhone: customerPhone,
            pickupLocation: { address: pickupAddress || 'Manual Payment' },
            dropoffLocation: { address: dropoffAddress || 'Manual Payment' },
            totalPrice: totalLkr,
            paidAmount: paidAmountLkr,
            balanceAmount: Math.max(0, totalLkr - paidAmountLkr),
            currency,
            displayPrice: Number(amount),
            displayPaidAmount: displayPaidAmount,
            displayBalanceAmount: Math.max(0, Number(amount) - displayPaidAmount),
            paymentType: (paymentType === 'custom' || paymentType === 'partial') ? 'partial' : 'full',
            status: 'pending',
            paymentStatus: 'pending',
            paymentMethod: 'card',
            scheduledDate,
            scheduledTime,
            passengerCount,
            vehicleType,
            notes: notes || 'Manual Payment Link Generated',
            isManual: true,
            type: 'transfer'
        };

        const booking = await Booking.create(bookingData);

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL || 'https://airporttaxis.lk';
        const paymentLink = `${baseUrl}/checkout/${booking._id}`;

        // Send Automated Email Notification
        const { sendManualInvoice } = require('@/lib/email-service');
        try {
            await sendManualInvoice({
                ...booking.toObject(),
                paymentLink
            });
        } catch (emailErr) {
            console.error('[Email] Manual invoice trigger failed:', emailErr);
        }

        return NextResponse.json({
            success: true,
            bookingId: booking._id,
            paymentLink,
            message: 'Manual booking created and email sent successfully'
        });

    } catch (error) {
        console.error('[Admin] Manual booking error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
