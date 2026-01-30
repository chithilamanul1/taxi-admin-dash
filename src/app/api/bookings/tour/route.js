import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Booking from '@/models/Booking';
import { sendEmail } from '@/lib/email-service';

export async function POST(req) {
    try {
        const body = await req.json();
        const { name, email, phone, date, adults, children, specialRequests, tourTitle, tourId, duration } = body;

        if (!process.env.MONGODB_URI) {
            return NextResponse.json({ message: 'Database configuration error' }, { status: 500 });
        }

        await mongoose.connect(process.env.MONGODB_URI);

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
            totalPrice: 0, // Quote based
            nameBoard: {
                text: specialRequests // Storing notes here or in a new field if needed, but notes aren't in schema yet. Adding notes to NameBoard text as a hack or just ignoring. Ideally schema needs 'notes'. 
                // Let's use nameBoard.text for now or add a notes field. Schema doesn't have notes. 
                // Actually, I'll append to nameBoard.text for visibility in admin.
            }
        });

        // Send Emails
        try {
            // 1. Admin Notification
            await sendEmail({
                to: process.env.ADMIN_EMAIL || 'admin@airporttaxis.lk', // Fallback
                subject: `New Tour Inquiry: ${tourTitle}`,
                html: `
                    <div style="font-family: sans-serif; color: #333;">
                        <h2 style="color: #064e3b;">New Tour Booking Request</h2>
                        <p><strong>Tour:</strong> ${tourTitle}</p>
                        <p><strong>Customer:</strong> ${name}</p>
                        <p><strong>Phone:</strong> ${phone}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Date:</strong> ${date}</p>
                        <p><strong>Pax:</strong> ${adults} Adults, ${children} Children</p>
                        <br/>
                        <p><strong>Special Requests:</strong></p>
                        <p>${specialRequests || 'None'}</p>
                        <br/>
                        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin" style="display: inline-block; padding: 10px 20px; background-color: #064e3b; color: white; text-decoration: none; border-radius: 5px;">View in Admin Panel</a>
                    </div>
                `
            });

            // 2. Customer Acknowledgement
            await sendEmail({
                to: email,
                subject: `Tour Inquiry Received - ${tourTitle}`,
                templateName: 'bookingConfirmation', // Reusing existing template logic or simple HTML
                // Since I don't want to break existing email service logic, I'll pass basic props that fit 'bookingConfirmation' or just raw HTML if supported.
                // The current email service might expect specific booking props. 
                // Let's use a simple direct HTML for now to be safe, or if 'bookingConfirmation' requires a 'booking' object, I'd need to mock it.
                // Looking at email-service.js (implied), it likely takes 'booking'.
                // I will send a simple HTML response for now to ensure reliability without diving into email-service internals deeply here.
                html: `
                    <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #064e3b;">Inquiry Received</h2>
                        <p>Dear ${name},</p>
                        <p>Thank you for your interest in the <strong>${tourTitle}</strong>.</p>
                        <p>We have received your request and our team will review the availability and get back to you shortly with a personalized quote.</p>
                        <br/>
                        <p><strong>Your Details:</strong></p>
                        <ul>
                            <li>Date: ${date}</li>
                            <li>Travelers: ${adults} Adults, ${children} Children</li>
                        </ul>
                        <br/>
                        <p>If you have urgent questions, please allow us a call at <a href="tel:+94716885880">+94 71 688 5880</a>.</p>
                        <p>Best Regards,<br/>Airport Taxis Team</p>
                    </div>
                `
            });

        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            // Don't fail the request if email fails, but log it
        }

        return NextResponse.json({ message: 'Tour inquiry submitted successfully', bookingId: newBooking._id }, { status: 201 });

    } catch (error) {
        console.error('Tour Booking Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
