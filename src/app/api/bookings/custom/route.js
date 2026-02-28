import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Booking from '@/models/Booking';
import { sendBookingEmail } from '@/lib/email';

export async function POST(req) {
    try {
        await dbConnect();
        const data = await req.json();

        // Create the booking record
        const booking = await Booking.create({
            type: 'custom',
            customerDetails: {
                name: data.name,
                email: data.email,
                phone: data.phone
            },
            tripDetails: {
                pickup: data.pickup,
                dropoff: data.dropoff,
                waypoints: data.waypoints,
                distance: data.distance,
                duration: data.duration,
                date: new Date(data.date),
                passengers: data.passengers,
                vehicleType: data.vehicleType,
                message: data.message
            },
            pricing: {
                amount: data.estimatedPrice,
                currency: data.currency || 'LKR'
            },
            status: 'pending'
        });

        // Send email notification to owner
        await sendBookingEmail(booking, 'owner');
        // Send confirmation email to customer
        await sendBookingEmail(booking, 'customer');

        return NextResponse.json({
            success: true,
            message: 'Custom booking request received',
            bookingId: booking._id
        });

    } catch (error) {
        console.error('Custom booking error:', error);
        return NextResponse.json({
            success: false,
            message: error.message || 'Internal Server Error'
        }, { status: 500 });
    }
}
