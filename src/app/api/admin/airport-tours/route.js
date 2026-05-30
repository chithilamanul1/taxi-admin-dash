import dbConnect from '@/lib/db';
import AirportRoundTour from '@/models/AirportRoundTour';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// GET all packages
export async function GET(req) {
    try {
        await dbConnect();
        const packages = await AirportRoundTour.find({}).sort({ hours: 1 });
        return NextResponse.json({ success: true, data: packages });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// PUT (Upsert/Replace) all packages
// The frontend will send the full array of packages. We will replace all existing ones to keep it synced.
export async function PUT(req) {
    try {
        await dbConnect();
        const body = await req.json();
        
        if (!Array.isArray(body.packages)) {
            return NextResponse.json({ success: false, error: "Invalid data format. Expected 'packages' array." }, { status: 400 });
        }

        // We can use a transaction or simply delete all and insert.
        // For simplicity and to ensure sync with the frontend array:
        await AirportRoundTour.deleteMany({});
        const inserted = await AirportRoundTour.insertMany(body.packages);

        return NextResponse.json({ success: true, data: inserted });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
