
import { NextResponse } from 'next/server';

export async function GET() {
    // START: Real API Implementation (Use this when you have a valid Places API (New) Key)
    /*
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const placeId = process.env.GOOGLE_PLACE_ID; // Your Business Place ID

    if (!apiKey || !placeId) {
        return NextResponse.json({ error: 'Missing API Key or Place ID' }, { status: 500 });
    }

    try {
        const url = `https://places.googleapis.com/v1/places/${placeId}?fields=reviews,rating,userRatingCount&key=${apiKey}`;
        const res = await fetch(url);
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }
    */
    // END: Real API Implementation

    // FALLBACK MOCK DATA (For testing without API Key)
    const mockReviews = {
        rating: 4.9,
        userRatingCount: 128,
        reviews: [
            {
                name: 'places/ChIJ.../reviews/1',
                relativePublishTimeDescription: '2 weeks ago',
                rating: 5,
                text: { text: 'Excellent service from start to finish. The driver was waiting for us at the airport with a name board. The car was clean and comfortable. The drive to Kandy was smooth. Highly recommend!' },
                authorAttribution: {
                    displayName: 'Sarah Jenkins',
                    photoUri: 'https://lh3.googleusercontent.com/a-/ALV-UjW...',
                }
            },
            {
                name: 'places/ChIJ.../reviews/2',
                relativePublishTimeDescription: '1 month ago',
                rating: 5,
                text: { text: 'We used Airport Taxi Tours for a 7-day trip around Sri Lanka. Our driver, Kamal, was fantastic. He knew all the best spots and was very safe. The van was spacious for our family of 5.' },
                authorAttribution: {
                    displayName: 'David Miller',
                    photoUri: null,
                }
            },
            {
                name: 'places/ChIJ.../reviews/3',
                relativePublishTimeDescription: '3 days ago',
                rating: 5,
                text: { text: 'Very professional. Booking online was easy, and the communication via WhatsApp was great. Pricing is transparent with no hidden fees. Will use again.' },
                authorAttribution: {
                    displayName: 'Emily Chen',
                    photoUri: null,
                }
            },
            {
                name: 'places/ChIJ.../reviews/4',
                relativePublishTimeDescription: '2 months ago',
                rating: 4,
                text: { text: 'Good reliable service. Driver was a bit late due to traffic but communicated well. Car was nice.' },
                authorAttribution: {
                    displayName: 'Mark Thompson',
                    photoUri: null,
                }
            },
            {
                name: 'places/ChIJ.../reviews/5',
                relativePublishTimeDescription: '1 week ago',
                rating: 5,
                text: { text: 'Best way to travel in Sri Lanka! The airport transfer was seamless. Thank you for the great hospitality.' },
                authorAttribution: {
                    displayName: 'Jessica Brown',
                    photoUri: null,
                }
            }
        ]
    };

    return NextResponse.json(mockReviews);
}
