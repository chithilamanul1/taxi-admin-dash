import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
    try {
        await connectDB();
        const count = await Booking.countDocuments();
        return NextResponse.json({ count });
    } catch (error) {
        console.error('Error fetching booking count:', error);
        return NextResponse.json({ count: 0 }); // Fallback to 0
    }
}
