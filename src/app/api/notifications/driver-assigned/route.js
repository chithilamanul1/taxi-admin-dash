import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Driver from '@/models/Driver';

// Notification: Driver assigned to booking
export async function POST(req) {
    try {
        await connectDB();
        const { bookingId, driverId } = await req.json();

        // Get booking and driver details
        const booking = await Booking.findById(bookingId);
        const driver = await Driver.findById(driverId).populate('user', 'name phone');

        if (!booking || !driver) {
            return NextResponse.json({ error: 'Booking or driver not found' }, { status: 404 });
        }

        // Format WhatsApp message for customer
        const customerMessage = encodeURIComponent(
            `🚕 *Airport Taxi Tours - Driver Assigned*\n\n` +
            `Your ride has been confirmed!\n\n` +
            `📍 *Pickup:* ${booking.pickupLocation?.address || 'Airport'}\n` +
            `📍 *Dropoff:* ${booking.dropoffLocation?.address || 'N/A'}\n` +
            `📅 *Date:* ${booking.scheduledDate}\n` +
            `⏰ *Time:* ${booking.scheduledTime}\n\n` +
            `🚗 *Driver:* ${driver.user?.name || 'Driver'}\n` +
            `📱 *Driver Phone:* ${driver.user?.phone || 'N/A'}\n` +
            `🚙 *Vehicle:* ${driver.vehicleType} - ${driver.vehicleNumber}\n\n` +
            `💰 *Total:* Rs ${booking.totalPrice?.toLocaleString()}\n\n` +
            `Thank you for choosing Airport Taxi Tours!`
        );

        // Generate WhatsApp link (customer notification)
        const customerPhone = booking.guestPhone?.replace(/[^0-9]/g, '') || '';
        const whatsappLink = customerPhone
            ? `https://wa.me/${customerPhone}?text=${customerMessage}`
            : null;

        // Format message for driver
        const driverMessage = encodeURIComponent(
            `🚕 *New Ride Assignment*\n\n` +
            `📍 *Pickup:* ${booking.pickupLocation?.address || 'Airport'}\n` +
            `📍 *Dropoff:* ${booking.dropoffLocation?.address || 'N/A'}\n` +
            `📅 *Date:* ${booking.scheduledDate}\n` +
            `⏰ *Time:* ${booking.scheduledTime}\n` +
            `👥 *Passengers:* ${booking.passengers?.adults || 1} Adults\n` +
            `💰 *Fare:* Rs ${booking.totalPrice?.toLocaleString()}\n\n` +
            `Open driver app to accept.`
        );

        const driverPhone = driver.user?.phone?.replace(/[^0-9]/g, '') || '';
        const driverWhatsappLink = driverPhone
            ? `https://wa.me/${driverPhone}?text=${driverMessage}`
            : null;

        // Log notification event
        console.log('[NOTIFICATION] Driver assigned:', {
            bookingId,
            driverId,
            customerPhone: booking.guestPhone,
            driverPhone: driver.user?.phone
        });

        // In production, you would integrate with:
        // - WhatsApp Business API (Twilio, MessageBird, etc.)
        // - Resend for email
        // - Firebase for push notifications

        return NextResponse.json({
            success: true,
            message: 'Notification prepared',
            whatsappLinks: {
                customer: whatsappLink,
                driver: driverWhatsappLink
            }
        });

    } catch (error) {
        console.error('Notification error:', error);
        return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
    }
}
