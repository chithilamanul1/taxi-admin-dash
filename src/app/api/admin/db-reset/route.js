import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import AirportRoundTour from '../../../../models/AirportRoundTour';
import NormalRoundTour from '../../../../models/NormalRoundTour';

export async function GET(request) {
    try {
        await dbConnect();
        
        // Wipe broken cross-wired entries
        await AirportRoundTour.deleteMany({});
        await NormalRoundTour.deleteMany({});

        return NextResponse.json({ success: true, message: 'Database schema tear-down complete. Seed data wiped.' });
    } catch (error) {
        console.error('DB Reset Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
