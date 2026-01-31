
const TRIPADVISOR_API_KEY = process.env.TRIPADVISOR_API_KEY;
const LOCATION_ID = '33986804'; // From existing widget
const BASE_URL = 'https://api.content.tripadvisor.com/api/v1/location';

export async function getTripAdvisorData() {
    if (!TRIPADVISOR_API_KEY) {
        console.error('TRIPADVISOR_API_KEY is not defined');
        return null;
    }

    try {
        const res = await fetch(`${BASE_URL}/${LOCATION_ID}/details?key=${TRIPADVISOR_API_KEY}&language=en`, {
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!res.ok) {
            console.error('Failed to fetch TripAdvisor data:', res.status, res.statusText);
            return null;
        }

        const data = await res.json();
        return {
            rating: data.rating,
            num_reviews: data.num_reviews,
            ranking_data: data.ranking_data,
            web_url: data.web_url,
            reviews: [] // Content API 'details' might not return reviews list, might need separate call if needed.
        };

    } catch (error) {
        console.error('Error fetching TripAdvisor data:', error);
        return null;
    }
}
