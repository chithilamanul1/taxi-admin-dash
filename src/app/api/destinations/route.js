import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Destination from '@/models/Destination';

export async function GET(req) {
    try {
        await dbConnect();
        
        // Return all destinations sorted by order/title
        const destinations = await Destination.find({}).sort({ sortOrder: 1, title: 1 });
        return NextResponse.json({ success: true, data: destinations });
    } catch (error) {
        console.error('[API/Destinations] GET Public Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
