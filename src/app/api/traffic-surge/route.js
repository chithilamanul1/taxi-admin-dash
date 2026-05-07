import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import TrafficSurge from '@/models/TrafficSurge';

export async function GET() {
    try {
        await dbConnect();
        const rules = await TrafficSurge.find({ isActive: true }).sort({ startTime: 1 });
        return NextResponse.json({ success: true, data: rules });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
