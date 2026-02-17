import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import Booking from '../../../../models/Booking';
import mongoose from 'mongoose';

export async function GET() {
    try {
        await dbConnect();

        const dbName = mongoose.connection.db.databaseName;
        const collections = await mongoose.connection.db.listCollections().toArray();
        const bookingCount = await Booking.countDocuments();
        const firstBooking = await Booking.findOne();

        return NextResponse.json({
            success: true,
            database: dbName,
            collections: collections.map(c => c.name),
            bookingCount,
            sample: firstBooking ? { id: firstBooking._id, name: firstBooking.customerName } : null,
            envSource: process.env.MONGO_URI ? 'MONGO_URI' : 'MONGODB_URI'
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
