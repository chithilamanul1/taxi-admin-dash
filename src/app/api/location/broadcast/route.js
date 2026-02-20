import { pusher } from '@/lib/pusher';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { driverId, lat, lng } = await req.json();

        if (!driverId || !lat || !lng) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        if (pusher) {
            await pusher.trigger(`driver-${driverId}`, 'location-update', {
                lat,
                lng,
                timestamp: new Date()
            });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Broadcast Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
