import dbConnect from '@/lib/db';
import Booking from '@/models/Booking';
import { NextResponse } from 'next/server';

export async function DELETE(req) {
    try {
        await dbConnect();
        
        // Purge all bookings
        const result = await Booking.deleteMany({});
        
        return NextResponse.json({ 
            success: true, 
            message: `Successfully purged ${result.deletedCount} test bookings. System is now ready for production.`,
            count: result.deletedCount
        });

    } catch (error) {
        console.error('Data Purge Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
