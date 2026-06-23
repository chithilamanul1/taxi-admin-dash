import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import QuickLink from '@/models/QuickLink';
import Booking from '@/models/Booking';

export async function GET(req, { params }) {
    try {
        const { id } = params;
        await dbConnect();

        let link;
        if (/^[0-9a-fA-F]{24}$/.test(id)) {
            link = await QuickLink.findOne({
                $or: [{ _id: id }, { slug: id }],
                isActive: true
            });

            if (!link) {
                const booking = await Booking.findById(id);
                // Allow verification if it's tagged manual OR if it has the 'Manual Payment' placeholder addresses
                const isLikelyManual = booking?.isManual ||
                    booking?.pickupLocation?.address === 'Manual Payment' ||
                    booking?.dropoffLocation?.address === 'Manual Payment';

                if (booking && isLikelyManual && booking.paymentStatus === 'pending') {
                    link = {
                        _id: booking._id,
                        title: `Invoice Ref: ${booking._id.toString().slice(-6).toUpperCase()}`,
                        price: booking.totalPrice,
                        currency: booking.currency || 'LKR',
                        img: '/logo.png',
                        allowedPaymentMode: 'both',
                        isBookingInvoice: true,
                        customerName: booking.customerName,
                        customerEmail: booking.customerEmail,
                        customerPhone: booking.guestPhone,
                        notes: booking.notes
                    };
                }
            }
        } else {
            link = await QuickLink.findOne({ slug: id, isActive: true });
        }

        if (!link) {
            return NextResponse.json({ success: false, error: 'Link not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: link });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
