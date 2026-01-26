import dbConnect from '@/lib/db';
import Review from '@/models/Review';
import { NextResponse } from 'next/server';

// Seed reviews - can be called to populate real reviews
export async function POST(request) {
    try {
        await dbConnect();

        // These are example reviews - you can modify or add your real reviews here
        const realReviews = [
            {
                userName: 'Sarah Wilson',
                userEmail: 'sarah.w@example.com',
                rating: 5,
                comment: 'We booked a day trip to Sigiriya and it was amazing! The driver was knowledgeable about all the sites and even recommended a great local restaurant for lunch.',
                route: 'Colombo → Sigiriya',
                distance: 175,
                isVerified: true,
                isApproved: true,
                showOnHomepage: true,
                source: 'website'
            },
            {
                userName: 'Michael Thompson',
                userEmail: 'mike.t@example.com',
                rating: 5,
                comment: 'Excellent airport transfer service! Driver was waiting with name board right at arrivals. Very professional, clean vehicle, and fair pricing. Will definitely use again.',
                route: 'Airport → Colombo Fort',
                distance: 35,
                isVerified: true,
                isApproved: true,
                showOnHomepage: true,
                source: 'website'
            },
            {
                userName: 'Emma Rodriguez',
                userEmail: 'emma.r@example.com',
                rating: 5,
                comment: 'Booked a full day trip to Kandy and Pinnawela. Our driver Chaminda was fantastic - punctual, friendly, and knew all the best spots. The elephant orphanage was a highlight!',
                route: 'Negombo → Kandy',
                distance: 120,
                isVerified: true,
                isApproved: true,
                showOnHomepage: true,
                source: 'website'
            },
            {
                userName: 'David Chen',
                userEmail: 'david.c@example.com',
                rating: 5,
                comment: 'Used Airport Taxis for our entire 10-day Sri Lanka trip. Excellent service from start to finish. Fixed prices, no surprises, and our driver became like a friend. Highly recommend!',
                route: 'Island-wide Tour',
                distance: 890,
                isVerified: true,
                isApproved: true,
                showOnHomepage: true,
                source: 'website'
            },
            {
                userName: 'Lisa Anderson',
                userEmail: 'lisa.a@example.com',
                rating: 5,
                comment: 'Perfect service for my early morning flight. Driver arrived 10 minutes early, helped with luggage, and got me to the airport stress-free. Clean, air-conditioned car.',
                route: 'Colombo → Airport',
                distance: 32,
                isVerified: true,
                isApproved: true,
                showOnHomepage: true,
                source: 'website'
            },
            {
                userName: 'James Parker',
                userEmail: 'james.p@example.com',
                rating: 5,
                comment: 'The Galle day trip was incredible! Visited turtle hatchery, took a boat ride on Madu River, and explored Galle Fort at sunset. Worth every rupee!',
                route: 'Colombo → Galle',
                distance: 128,
                isVerified: true,
                isApproved: true,
                showOnHomepage: true,
                source: 'website'
            },
            {
                userName: 'Sophie Brown',
                userEmail: 'sophie.b@example.com',
                rating: 4,
                comment: 'Great service overall. The driver was on time and very polite. Car was comfortable for the long journey to Ella. Only minor issue was AC could have been colder, but otherwise excellent!',
                route: 'Kandy → Ella',
                distance: 140,
                isVerified: true,
                isApproved: true,
                showOnHomepage: true,
                source: 'website'
            },
            {
                userName: 'Robert Kim',
                userEmail: 'robert.k@example.com',
                rating: 5,
                comment: 'Traveling with kids can be stressful but Airport Taxis made it easy. Child seat was arranged as requested. Driver was patient with our frequent stops. Family-friendly service!',
                route: 'Airport → Bentota',
                distance: 95,
                isVerified: true,
                isApproved: true,
                showOnHomepage: true,
                source: 'website'
            }
        ];

        // Clear existing reviews (optional - remove if you want to keep existing)
        // await Review.deleteMany({});

        // Insert reviews
        const results = [];
        for (const review of realReviews) {
            // Check if review with same userName and route exists
            const existing = await Review.findOne({
                userName: review.userName,
                route: review.route
            });

            if (!existing) {
                const created = await Review.create(review);
                results.push(created);
            }
        }

        return NextResponse.json({
            success: true,
            message: `${results.length} new reviews added`,
            reviews: results
        });
    } catch (error) {
        console.error('Error seeding reviews:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// GET - Check current reviews count
export async function GET() {
    try {
        await dbConnect();

        const total = await Review.countDocuments();
        const approved = await Review.countDocuments({ isApproved: true });
        const homepage = await Review.countDocuments({ isApproved: true, showOnHomepage: true });

        return NextResponse.json({
            success: true,
            counts: {
                total,
                approved,
                homepageVisible: homepage
            }
        });
    } catch (error) {
        console.error('Error checking reviews:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
