import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import Booking from '@/models/Booking';
import { sendOwnerNotification } from '@/lib/email-service';

export async function POST(req) {
    try {
        const body = await req.json();
        const { name, email, phone, date, adults, children, specialRequests, tourTitle, tourId, duration, totalPrice, currency } = body;

        await dbConnect();

        // Create Booking Record
        const newBooking = await Booking.create({
            type: 'tour',
            customerName: name,
            customerEmail: email,
            guestPhone: phone,
            scheduledDate: date,
            passengerCount: {
                adults: adults || 0,
                children: children || 0
            },
            vehicleType: 'Tour Vehicle', // Placeholder
            status: 'pending',
            paymentStatus: 'pending',
            tourDetails: {
                tourId,
                tourTitle,
                duration,
                inclusions: [] // Can add if passed from frontend
            },
            waypoints: [], // Not applicable for fixed tours usually
            pickupLocation: { address: 'Tour Pickup (TBD)', lat: 0, lng: 0 }, // Placeholder
            dropoffLocation: { address: 'Tour Dropoff (TBD)', lat: 0, lng: 0 }, // Placeholder
            distanceKm: 0,
            totalPrice: totalPrice || 0, // Saved from frontend calculation
            currency: currency || 'USD',
            nameBoard: {
                text: specialRequests
            }
        });

        // Notify Owner
        await sendOwnerNotification('New Tour Inquiry', {
            Tour: tourTitle,
            Customer: name,
            Phone: phone,
            Email: email,
            Date: date,
            Passengers: `${adults} Adults, ${children} Children`,
            SpecialRequests: specialRequests || 'None',
            EstimatedTotal: `${currency} ${totalPrice.toLocaleString()}`
        });

        return NextResponse.json({ message: 'Tour inquiry submitted successfully', bookingId: newBooking._id }, { status: 201 });

    } catch (error) {
        console.error('Tour Booking Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
