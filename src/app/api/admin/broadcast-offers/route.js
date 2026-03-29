import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Booking from '@/models/Booking';
import Coupon from '@/models/Coupon';
import MarketingBroadcast from '@/models/MarketingBroadcast';
import { sendBroadcast, templates } from '@/lib/email';
import { getToken } from 'next-auth/jwt';

export async function POST(req) {
    try {
        await dbConnect();

        // 1. Auth Check (Admin Only)
        // Note: Using next-auth/jwt getToken which works in Next.js App Router API routes
        const token = await getToken({ 
            req, 
            secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET 
        });

        if (!token || token.role !== 'admin') {
            console.log('Unauthorized broadcast attempt', { token });
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Fetch Active Coupons
        const activeCoupons = await Coupon.find({ isActive: true });
        if (!activeCoupons || activeCoupons.length === 0) {
            return NextResponse.json({ error: 'No active coupons found to broadcast' }, { status: 400 });
        }

        // 3. Aggregate Unique Emails
        // From Users (who haven't opted out)
        const users = await User.find({ 
            marketingConsent: { $ne: false }, 
            role: { $in: ['user', 'customer'] } 
        }, 'email');
        const userEmails = users.map(u => u.email);

        // From Bookings (Guest emails)
        const bookings = await Booking.find({ 
            customerEmail: { $exists: true, $ne: '' } 
        }, 'customerEmail');
        const guestEmails = bookings.map(b => b.customerEmail);

        // Combine and cleanup unique email list
        const allEmails = [...new Set([...userEmails, ...guestEmails])]
            .filter(email => email && email.includes('@') && email.length > 5)
            .map(e => e.toLowerCase().trim());

        if (allEmails.length === 0) {
            return NextResponse.json({ error: 'No recipients found' }, { status: 400 });
        }

        // 4. Create Broadcast Log
        const broadcast = await MarketingBroadcast.create({
            subject: '🔥 Exclusive Travel Deals from Airport Taxis!',
            recipientCount: allEmails.length,
            couponCodes: activeCoupons.map(c => c.code),
            sentBy: token.sub || token.id, // ID from the JWT token
            status: 'sending'
        });

        // 5. Trigger Broadcast
        const emailHtml = templates.marketingOffer(activeCoupons);
        const result = await sendBroadcast({
            recipients: allEmails,
            subject: broadcast.subject,
            html: emailHtml
        });

        if (result.success) {
            broadcast.status = 'completed';
            await broadcast.save();
            return NextResponse.json({ 
                success: true, 
                message: `Broadcast successfully sent to ${allEmails.length} recipients`,
                broadcastId: broadcast._id
            });
        } else {
            broadcast.status = 'failed';
            broadcast.error = result.error;
            await broadcast.save();
            return NextResponse.json({ error: 'Broadcast failed', details: result.error }, { status: 500 });
        }

    } catch (error) {
        console.error('API Error in Marketing Broadcast:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
