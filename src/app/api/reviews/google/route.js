import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Review from '@/models/Review';

export const revalidate = 3600; // Cache for 1 hour

export async function GET(req) {
    try {
        await dbConnect();
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        const placeId = process.env.GOOGLE_PLACE_ID;
        if (!placeId) {
            console.error('GOOGLE_PLACE_ID is not defined in .env');
        }

        let googleStats = { rating: 5.0, totalReviews: 300 }; // Fallback defaults
        let latestGoogleReviews = [];

        // 1. Check Cache Status (Smart Sync)
        const lastSyncReview = await Review.findOne({ source: 'google' }).sort({ updatedAt: -1 });
        const lastSyncTime = lastSyncReview ? new Date(lastSyncReview.updatedAt).getTime() : 0;
        const oneHour = 1 * 60 * 60 * 1000; // Reduced to 1 hour for fresher data
        // Force refresh if cache is old OR if the latest review is missing the real 'reviewDate' (legacy data fix)
        const isStale = (Date.now() - lastSyncTime) > oneHour || (lastSyncReview && !lastSyncReview.reviewDate);

        // 2. Fetch from Google if Key exists AND Cache is Stale
        if (apiKey && (isStale || !lastSyncReview)) {
            console.log('Google Reviews: Cache stale or legacy data. Fetching from API...');
            const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,reviews&key=${apiKey}`;
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
                const response = await fetch(url, { signal: controller.signal });
                clearTimeout(timeoutId);
                const data = await response.json();

                if (data.status === 'OK' && data.result) {
                    const place = data.result;
                    googleStats.rating = place.rating;
                    googleStats.totalReviews = place.user_ratings_total;
                    latestGoogleReviews = place.reviews || [];

                    // Save to Settings for persistence
                    try {
                        const Settings = (await import('@/models/Settings')).default;
                        await Settings.findOneAndUpdate(
                            { key: 'google_review_stats' },
                            { 
                                key: 'google_review_stats', 
                                value: { rating: googleStats.rating, totalReviews: googleStats.totalReviews },
                                group: 'stats'
                            },
                            { upsert: true }
                        );
                    } catch (err) {
                        console.error('Failed to save Google stats to DB:', err);
                    }

                    // Sync to MongoDB (Upsert)
                    for (const review of latestGoogleReviews) {
                        await Review.findOneAndUpdate(
                            {
                                userName: review.author_name,
                                comment: review.text,
                                source: 'google'
                            },
                            {
                                userName: review.author_name,
                                userEmail: `google-${review.time}@placeholder.com`,
                                userImage: review.profile_photo_url,
                                rating: review.rating,
                                comment: review.text,
                                source: 'google',
                                isApproved: true,
                                showOnHomepage: true,
                                reviewDate: new Date(review.time * 1000),
                                createdAt: new Date(review.time * 1000)
                                // updatedAt will be auto-updated, serving as our sync timestamp
                            },
                            { upsert: true, new: true, setDefaultsOnInsert: true }
                        );
                    }
                }
            } catch (err) {
                console.error('Google Fetch Warning:', err);
            }
        } else {
            console.log('Google Reviews: Serving from Cache (DB)');
            // Try to load last saved stats from DB
            try {
                const Settings = (await import('@/models/Settings')).default;
                const savedStats = await Settings.findOne({ key: 'google_review_stats' });
                if (savedStats && savedStats.value) {
                    googleStats = savedStats.value;
                }
            } catch (err) {
                console.error('Failed to load saved Google stats:', err);
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
