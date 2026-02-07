import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Review from '@/models/Review';

export async function GET(req) {
    try {
        await dbConnect();
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        const placeId = process.env.GOOGLE_PLACE_ID;
        if (!placeId) {
            console.error('GOOGLE_PLACE_ID is not defined in .env');
        }

        let googleStats = { rating: 4.9, totalReviews: 128 }; // Fallbacks
        let latestGoogleReviews = [];

        // 1. Fetch from Google if Key exists
        if (apiKey) {
            const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,reviews&key=${apiKey}`;
            try {
                const response = await fetch(url);
                const data = await response.json();

                if (data.status === 'OK' && data.result) {
                    const place = data.result;
                    googleStats.rating = place.rating;
                    googleStats.totalReviews = place.user_ratings_total;
                    latestGoogleReviews = place.reviews || [];

                    // 2. Sync to MongoDB (Upsert)
                    // We generate a unique ID based on author + time to avoid duplicates
                    for (const review of latestGoogleReviews) {
                        await Review.findOneAndUpdate(
                            {
                                userName: review.author_name,
                                comment: review.text,
                                source: 'google'
                            },
                            {
                                userName: review.author_name,
                                userEmail: `google-${review.time}@placeholder.com`, // Dummy email for schema requirement
                                userImage: review.profile_photo_url,
                                rating: review.rating,
                                comment: review.text,
                                source: 'google',
                                isApproved: true, // Auto-approve Google reviews
                                showOnHomepage: true,
                                reviewDate: new Date(review.time * 1000), // Original Google Time
                                createdAt: new Date(review.time * 1000)
                            },
                            { upsert: true, new: true, setDefaultsOnInsert: true }
                        );
                    }
                }
            } catch (err) {
                console.error('Google Fetch Warning:', err);
                // Continue to serve DB reviews if Google fails
            }
        }

        // 3. Fetch ALL reviews from DB (Google + Website + Manual)
        // Sort by newest first
        const allReviews = await Review.find({
            isApproved: true,
            showOnHomepage: true
        }).sort({ createdAt: -1 });

        // Map to frontend format
        const formattedReviews = allReviews.map(r => ({
            _id: r._id,
            author_name: r.userName,
            rating: r.rating,
            text: r.comment,
            profile_photo_url: r.userImage,
            relative_time_description: new Date(r.reviewDate || r.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }),
            source: r.source,
            isVerified: r.isVerified
        }));

        return NextResponse.json({
            success: true,
            data: {
                name: 'Airport Taxi Tours',
                rating: googleStats.rating,
                totalReviews: googleStats.totalReviews, // Always use live count from Google
                reviews: formattedReviews
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
