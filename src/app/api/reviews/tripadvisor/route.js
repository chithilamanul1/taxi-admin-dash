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

        // 1. Fetch from TripAdvisor API if Key Exists
        if (apiKey && locationId) {
            try {
                // Fetch Location Details (Rating & Count)
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

                // Fetch Recent Reviews
                const reviewsUrl = `https://api.content.tripadvisor.com/api/v1/location/${locationId}/reviews?key=${apiKey}&language=en&limit=5`;
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
                            // 2. Sync to MongoDB (Upsert)
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
                                    },
                                    { upsert: true, new: true, setDefaultsOnInsert: true }
                                );
                            }
                        }

                    } finally {
                        clearTimeout(timeout2);
                    }
                } catch (err) {
                    console.error('TripAdvisor Fetch Warning:', err);
                    // Continue to serve cached/DB reviews if API fails
                }
            }

        // 3. Fetch Synced Reviews from DB
        const syncedReviews = await Review.find({
                source: 'tripadvisor',
                isApproved: true
            }).sort({ createdAt: -1 }).limit(10);

            // If no reviews found (and API failed/missing), return empty structure but success
            // This allows the widget to fallback gracefully

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
