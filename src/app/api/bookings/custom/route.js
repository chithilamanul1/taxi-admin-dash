import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
// 1. Create a Support Ticket / Inquiry
import Ticket from '@/models/Ticket';
import { sendEmail } from '@/lib/email'; // Assuming this exists, or we mock it

export async function POST(req) {
    try {
        await dbConnect();

        const data = await req.json();
        const {
            name, email, phone,
            pickup, dropoff, waypoints,
            distance, duration,
            passengerCount, vehicleType, message
        } = data;

        // 1. Create a Support Ticket / Inquiry
        const ticket = await Ticket.create({
            subject: `Custom Trip Request: ${pickup?.address?.split(',')[0]} to ${dropoff?.address?.split(',')[0]}`,
            messages: [{
                sender: 'user',
                message: `
                Customer: ${name} (${email}, ${phone})
                Route: ${pickup?.address} -> ${waypoints?.map(w => w.address).join(' -> ')} -> ${dropoff?.address}
                Est. Distance: ${distance} km
                Est. Duration: ${duration} mins
                Passengers: ${passengerCount}
                Vehicle Pref: ${vehicleType}
                Notes: ${message}
            `
            }],
            priority: 'medium',
            status: 'open',
            category: 'booking_inquiry',
            userEmail: email, // If user is logged in, or just track by email logic
            metadata: {
                type: 'custom_trip',
                routeData: data
            },
            lastUpdated: new Date()
        });

        // 2. Send Email Notification (Optional/Mock)
        // await sendEmail({ ... }); 

        return NextResponse.json({ success: true, ticketId: ticket._id });

    } catch (error) {
        console.error("Custom Trip API Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
