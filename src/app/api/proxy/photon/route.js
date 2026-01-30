
import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');

    if (!q) {
        return NextResponse.json({ error: 'Missing query' }, { status: 400 });
    }

    try {
        // Use Photon API (Komoot)
        // bbox=79.5,5.8,82.0,9.9 for Sri Lanka bias
        const response = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=5&lang=en&bbox=79.5,5.8,82.0,9.9`);
        const data = await response.json();

        // Transform Photon GeoJSON to Nominatim-like flat format for frontend compatibility
        const transformed = data.features.map(f => {
            const props = f.properties;
            // Construct a display address
            const parts = [
                props.name,
                props.street,
                props.district,
                props.city,
                props.state,
                props.country
            ].filter(Boolean); // Remove null/undefined

            // Deduplicate parts (e.g. if name and city are duplicate)
            const uniqueParts = [...new Set(parts)];

            return {
                place_id: props.osm_id || Math.random(),
                display_name: uniqueParts.join(', '),
                lat: f.geometry.coordinates[1].toString(), // Photon uses [lon, lat]
                lon: f.geometry.coordinates[0].toString()
            };
        });

        return NextResponse.json(transformed);

    } catch (error) {
        console.error('Photon Proxy Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
