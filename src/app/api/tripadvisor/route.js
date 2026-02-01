import { NextResponse } from 'next/server';
import { getTripAdvisorData, getTripAdvisorReviews } from '@/lib/tripadvisor';
import dbConnect from '@/lib/db';
import Review from '@/models/Review';

export async function GET() {
    try {
        await dbConnect();

        // 1. Fetch Live Data from TripAdvisor Code Lib
        let taStats = { rating: 5.0, num_reviews: 292 }; // Default/Fallback based on user screenshot
        let latestReviews = [];

        // Fetch Stats
        const liveData = await getTripAdvisorData();
        if (liveData) {
            taStats.rating = liveData.rating || taStats.rating;
            taStats.num_reviews = liveData.num_reviews || taStats.num_reviews;
        }

        // Fetch Reviews
        latestReviews = await getTripAdvisorReviews();

        // 2. Sync to MongoDB (Upsert)
        if (latestReviews && latestReviews.length > 0) {
            for (const review of latestReviews) {
                // TripAdvisor Text + User is usually unique enough if ID is missing, but API returns ID
                const uniqueQuery = review.id
                    ? { externalUrl: review.id, source: 'tripadvisor' }
                    : {
                        userName: review.user.username,
                        comment: review.text,
                        source: 'tripadvisor'
                    };

                await Review.findOneAndUpdate(
                    uniqueQuery,
                    {
                        userName: review.user.username || 'Traveler',
                        userEmail: `ta-${review.published_date}@placeholder.com`, // Dummy email
                        userImage: review.user.avatar,
                        rating: Number(review.rating),
                        comment: review.text,
                        source: 'tripadvisor',
                        externalUrl: review.id, // ID from TripAdvisor
                        isApproved: true,
                        showOnHomepage: true,
                        createdAt: new Date(review.published_date)
                    },
                    { upsert: true, new: true, setDefaultsOnInsert: true }
                );
            }
        }

        // 3. Fetch ALL TripAdvisor reviews from DB
        const allReviews = await Review.find({
            source: 'tripadvisor',
            isApproved: true,
            showOnHomepage: true
        }).sort({ createdAt: -1 });

        // Map to frontend format (keeping consistent with Google route)
        const formattedReviews = allReviews.map(r => ({
            id: r.externalUrl || r._id, // Use external ID if available
            rating: r.rating,
            text: r.comment,
            user: {
                username: r.userName,
                avatar: r.userImage
            },
            published_date: r.createdAt.toISOString(),
            source: 'tripadvisor'
        }));

        return NextResponse.json({
            success: true,
            rating: taStats.rating,
            num_reviews: taStats.num_reviews,
            reviews: formattedReviews
        });

    } catch (error) {
        console.error('TripAdvisor Sync Error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
