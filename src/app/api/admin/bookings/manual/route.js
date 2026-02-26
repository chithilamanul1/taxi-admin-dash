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
            notes,
            scheduledDate,
            scheduledTime
        } = body;

        if (!customerName || !amount) {
            return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
        }

        const bookingData = {
            customerName,
            customerEmail,
            guestPhone: customerPhone,
            pickupLocation: { address: pickupAddress || 'Manual Payment' },
            dropoffLocation: { address: dropoffAddress || 'Manual Payment' },
            totalPrice: currency === 'LKR' ? Number(amount) : Number(amount) * 330, // Base LKR for internal consistency
            paidAmount: currency === 'LKR'
                ? (paymentType === 'partial' ? Number(amount) * 0.5 : Number(amount))
                : (paymentType === 'partial' ? Number(amount) * 0.5 * 330 : Number(amount) * 330),
            currency,
            displayPrice: Number(amount), // The actual amount entered by admin
            displayPaidAmount: paymentType === 'partial' ? Number(amount) * 0.5 : Number(amount),
            paymentType,
            status: 'pending',
            paymentStatus: 'pending',
            paymentMethod: 'card',
            scheduledDate,
            scheduledTime,
            notes: notes || 'Manual Payment Link Generated',
            isManual: true,
            type: 'transfer'
        };

        const booking = await Booking.create(bookingData);

        const baseUrl = process.env.NEXTAUTH_URL || 'https://airporttaxis.lk';
        const paymentLink = `${baseUrl}/checkout/${booking._id}`;

        return NextResponse.json({
            success: true,
            bookingId: booking._id,
            paymentLink,
            message: 'Manual booking created successfully'
        });

    } catch (error) {
        console.error('[Admin] Manual booking error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
