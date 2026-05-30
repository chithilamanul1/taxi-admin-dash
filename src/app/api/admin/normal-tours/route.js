import dbConnect from '@/lib/db';
import NormalRoundTour from '@/models/NormalRoundTour';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// GET all packages
export async function GET(req) {
    try {
        await dbConnect();
        const packages = await NormalRoundTour.find({}).sort({ hours: 1 });
        return NextResponse.json({ success: true, data: packages });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// PUT (Upsert/Replace) all packages
export async function PUT(req) {
    try {
        await dbConnect();
        const body = await req.json();
        
        if (!Array.isArray(body.packages)) {
            return NextResponse.json({ success: false, error: "Invalid data format. Expected 'packages' array." }, { status: 400 });
        }

        await NormalRoundTour.deleteMany({});
        const inserted = await NormalRoundTour.insertMany(body.packages);

        return NextResponse.json({ success: true, data: inserted });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
