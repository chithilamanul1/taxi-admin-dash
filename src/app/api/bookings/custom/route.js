import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Booking from '@/models/Booking';
import emailService from '@/lib/email-service';

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

        // Send inquiry email to owner
        await emailService.sendCustomTripInquiry(data);

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
