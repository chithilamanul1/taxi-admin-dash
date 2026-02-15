import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Review from '@/models/Review';

export async function GET(req) {
    try {
        await dbConnect();
        const apiKey = process.env.TRIPADVISOR_API_KEY;
        const locationId = process.env.TRIPADVISOR_LOCATION_ID;

        // Fallback Stats
        let tripAdvisorStats = { rating: 5.0, totalReviews: 0 };

        // 1. Check Cache (Smart Sync)
        const lastSyncReview = await Review.findOne({ source: 'tripadvisor' }).sort({ updatedAt: -1 });
        const lastSyncTime = lastSyncReview ? new Date(lastSyncReview.updatedAt).getTime() : 0;
        const twelveHours = 12 * 60 * 60 * 1000;
        // Force refresh if cache is old OR if the latest review is missing the real 'reviewDate'
        const isStale = (Date.now() - lastSyncTime) > twelveHours || (lastSyncReview && !lastSyncReview.reviewDate);

        // 2. Fetch from TripAdvisor API if Key Exists AND Cache is Stale
        if (apiKey && locationId && (isStale || !lastSyncReview)) {
            console.log('TripAdvisor: Cache stale or legacy data. Fetching from API...');
            try {
                // Fetch Location Details (Rating & Count)
                const locationUrl = `https://api.content.tripadvisor.com/api/v1/location/${locationId}/details?key=${apiKey}&language=en`;

                // Add 8s timeout for external API
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), 8000);

                try {
                    const locationRes = await fetch(locationUrl, {
                        headers: { accept: 'application/json' },
                        signal: controller.signal
                    });

                    if (locationRes.ok) {
                        const locationData = await locationRes.json();
                        if (locationData && locationData.rating) {
                            tripAdvisorStats.rating = Number(locationData.rating);
                            tripAdvisorStats.totalReviews = Number(locationData.num_reviews);
                        }
                    }
                } finally {
                    clearTimeout(timeout);
                }

                // Fetch Recent Reviews (Limit increased to 20 to sync all)
                const reviewsUrl = `https://api.content.tripadvisor.com/api/v1/location/${locationId}/reviews?key=${apiKey}&language=en&limit=20`;
                const controller2 = new AbortController();
                const timeout2 = setTimeout(() => controller2.abort(), 8000);

                try {
                    const reviewsRes = await fetch(reviewsUrl, {
                        headers: { accept: 'application/json' },
                        signal: controller2.signal
                    });

                    if (reviewsRes.ok) {
                        const reviewsData = await reviewsRes.json();

                        if (reviewsData && reviewsData.data) {
                            // Sync to MongoDB (Upsert)
                            for (const review of reviewsData.data) {
                                // TripAdvisor API provides: id, published_date, rating, text, title, url, user { username }
                                await Review.findOneAndUpdate(
                                    {
                                        externalUrl: review.url, // Unique identifier
                                        source: 'tripadvisor'
                                    },
                                    {
                                        userName: review.user?.username || 'TripAdvisor User',
                                        userEmail: `tripadvisor-${review.id}@placeholder.com`, // Dummy email
                                        userImage: review.user?.avatar?.small?.url || null, // Avatar might differ based on API version
                                        rating: Number(review.rating),
                                        comment: review.text,
                                        source: 'tripadvisor',
                                        externalUrl: review.url,
                                        isApproved: true, // Auto-approve fetched reviews
                                        showOnHomepage: true,
                                        reviewDate: new Date(review.published_date), // Original TripAdvisor Date
                                        createdAt: new Date(review.published_date) // Match sorting
                                        // updatedAt updated automatically
                                    },
                                    { upsert: true, new: true, setDefaultsOnInsert: true }
                                );
                            }
                        }
                    }

                } finally {
                    clearTimeout(timeout2);
                }
            } catch (err) {
                console.error('TripAdvisor Fetch Warning:', err);
                // Continue to serve cached/DB reviews if API fails
            }
        } else {
            console.log('TripAdvisor: Serving from Cache (DB)');
        }

        // 3. Fetch Synced Reviews from DB
        const syncedReviews = await Review.find({
            source: 'tripadvisor',
            isApproved: true
        }).sort({ createdAt: -1 }).limit(20);

        // If fetch was skipped or failed, attempt to get real stats from database records
        if (tripAdvisorStats.totalReviews === 0) {
            const count = await Review.countDocuments({ source: 'tripadvisor', isApproved: true });
            if (count > 0) {
                const result = await Review.aggregate([
                    { $match: { source: 'tripadvisor', isApproved: true } },
                    { $group: { _id: null, avgRating: { $avg: "$rating" } } }
                ]);
                tripAdvisorStats.rating = result[0]?.avgRating?.toFixed(1) || 5.0;
                tripAdvisorStats.totalReviews = count;
            } else {
                // Utmost fallback to match User's latest feedback
                tripAdvisorStats.rating = 5.0;
                tripAdvisorStats.totalReviews = 100; // Minimum known
            }
        }

        // Format to match Google Reviews structure
        const formattedReviews = syncedReviews.map(r => ({
            _id: r._id,
            author_name: r.userName,
            rating: r.rating,
            text: r.comment,
            profile_photo_url: r.userImage,
            relative_time_description: new Date(r.reviewDate || r.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }),
            source: r.source,
            externalUrl: r.externalUrl
        }));

        return NextResponse.json({
            success: true,
            data: {
                rating: tripAdvisorStats.rating,
                num_reviews: tripAdvisorStats.totalReviews,
                reviews: formattedReviews
            }
        });

    } catch (error) {
        console.error('TripAdvisor API Error:', error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
