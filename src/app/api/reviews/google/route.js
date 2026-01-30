import { NextResponse } from 'next/server';

export async function GET(req) {
    try {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

        // AirportCab.lk / Airport Taxis Sri Lanka Place ID
        // You can find your Place ID at: https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder
        const placeId = process.env.GOOGLE_PLACE_ID || 'ChIJN1t_tDeuEmsRUsoyG83frY4'; // Replace with actual place ID

        if (!apiKey) {
            return NextResponse.json({
                success: false,
                error: 'Missing Google Maps API Key'
            }, { status: 500 });
        }

        // Fetch place details including reviews
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,reviews&key=${apiKey}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.status !== 'OK') {
            console.error('Google Places API Error:', data.status, data.error_message);
            return NextResponse.json({
                success: false,
                error: data.error_message || data.status
            }, { status: 400 });
        }

        const place = data.result;

        return NextResponse.json({
            success: true,
            data: {
                name: place.name,
                rating: place.rating,
                totalReviews: place.user_ratings_total,
                reviews: (place.reviews || []).map(review => ({
                    author_name: review.author_name,
                    rating: review.rating,
                    text: review.text,
                    relative_time_description: review.relative_time_description,
                    profile_photo_url: review.profile_photo_url,
                    time: review.time
                }))
            }
        });

    } catch (error) {
        console.error('Google Reviews API Error:', error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
