import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Booking from '@/models/Booking';
import { sendEmail, templates } from '@/lib/email';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        
        // Strict Admin Authentication
        if (!session || !session.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
        }

        await dbConnect();
        
        const { id } = params;
        const booking = await Booking.findById(id);

        if (!booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        if (!booking.customerEmail) {
            return NextResponse.json({ error: 'Customer email is missing for this booking' }, { status: 400 });
        }

        // Send Email using existing template
        const emailResult = await sendEmail({
            to: booking.customerEmail,
            subject: 'Invoice & Booking Confirmation - Airport Taxis Sri Lanka',
            html: templates.bookingConfirmation(booking)
        });

        if (!emailResult.success) {
            return NextResponse.json({ error: 'Failed to send email invoice' }, { status: 500 });
        }

        return NextResponse.json({ 
            success: true, 
            message: 'Invoice successfully sent to ' + booking.customerEmail 
        });

    } catch (error) {
        console.error('Error resending invoice:', error);
        return NextResponse.json({ error: 'Failed to resend invoice' }, { status: 500 });
    }
}
