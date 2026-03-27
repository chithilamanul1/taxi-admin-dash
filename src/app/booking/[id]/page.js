import dbConnect from '@/lib/db';
import Booking from '@/models/Booking';
import User from '@/models/User'; // Ensure User is registered
import Driver from '@/models/Driver'; // Ensure Driver is registered
import { notFound } from 'next/navigation';
import { CheckCircle, MapPin, Calendar, Clock, Car, Star, Phone, MessageSquare, ArrowRight, ShieldCheck, Zap, AlertCircle, Info, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import BookingActions from '@/components/BookingActions';
import TrackingMap from '@/components/TrackingMap';
import RatingSystem from '@/components/RatingSystem';
import BookingStatusClient from '@/components/BookingStatusClient';

export const dynamic = 'force-dynamic';

export default async function BookingStatusPage({ params }) {
    await dbConnect();

    // Fix: Await params (Next.js 15)
    const { id } = await params;

    let booking;
    try {
        booking = await Booking.findById(id).populate('driver').lean();

        if (!booking) {
            notFound();
        }

        // Serialize
        booking._id = booking._id.toString();
        if (booking.customer) booking.customer = booking.customer.toString();
        if (booking.driver) booking.driver = JSON.parse(JSON.stringify(booking.driver));
        booking = JSON.parse(JSON.stringify(booking));

    } catch (e) {
        console.error(`Error loading booking ${id}:`, e);
        notFound();
    }

    return <BookingStatusClient booking={booking} />;
}
