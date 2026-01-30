
import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const format = searchParams.get('format') || 'json';
    const limit = searchParams.get('limit') || '5';
    const countrycodes = searchParams.get('countrycodes') || 'lk';

    // Support Reverse Geocoding params
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    let url;
    if (lat && lon) {
        url = `https://nominatim.openstreetmap.org/reverse?format=${format}&lat=${lat}&lon=${lon}`;
    } else if (q) {
        url = `https://nominatim.openstreetmap.org/search?format=${format}&q=${encodeURIComponent(q)}&limit=${limit}&countrycodes=${countrycodes}`;
    } else {
        return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    try {
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'AirportTaxiTours/1.0 (contact@airporttaxitours.lk)', // Required by Nominatim
                'Accept-Language': 'en-US,en;q=0.9'
            }
        });

        if (!res.ok) {
            return NextResponse.json({ error: 'Nominatim Error' }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
