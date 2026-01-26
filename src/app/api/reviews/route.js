import dbConnect from '@/lib/db';
import Review from '@/models/Review';
import Booking from '@/models/Booking';
import { NextResponse } from 'next/server';
import { logNewReview } from '@/lib/discord';
import { sendReviewThankYou } from '@/lib/email-service';

// GET - Fetch reviews (for homepage and admin)
export async function GET(request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const approved = searchParams.get('approved');
        const homepage = searchParams.get('homepage');
        const limit = parseInt(searchParams.get('limit')) || 10;
        const all = searchParams.get('all'); // For admin

        let query = {};

        // For homepage - only approved reviews marked for homepage
        if (homepage === 'true') {
            query = { isApproved: true, showOnHomepage: true };
        } else if (approved === 'true') {
            query = { isApproved: true };
        } else if (approved === 'false') {
            query = { isApproved: false };
        }
        // If 'all' is set, return all reviews (for admin)

        const reviews = await Review.find(query)
            .sort({ createdAt: -1 })
            .limit(all ? 100 : limit)
            .lean();

        return NextResponse.json({
            success: true,
            reviews,
            count: reviews.length
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// POST - Create new review (from customer)
export async function POST(request) {
    try {
        await dbConnect();

        const body = await request.json();
        const {
            bookingId,
            userName,
            userEmail,
            userImage,
            rating,
            comment,
            route,
            distance
        } = body;

        // Validation
        if (!userName || !rating || !comment) {
            return NextResponse.json(
                { success: false, error: 'Name, rating, and comment are required' },
                { status: 400 }
            );
        }

        // If bookingId provided, verify it exists and is completed
        let booking = null;
        let isVerified = false;
        let tripRoute = route;
        let tripDistance = distance;

        if (bookingId) {
            booking = await Booking.findById(bookingId);
            if (booking) {
                isVerified = booking.status === 'completed';
                // Auto-fill route and distance from booking if not provided
                if (!tripRoute && booking.pickupLocation && booking.dropoffLocation) {
                    const pickup = booking.pickupLocation.address?.split(',')[0] || 'Pickup';
                    const dropoff = booking.dropoffLocation.address?.split(',')[0] || 'Dropoff';
                    tripRoute = `${pickup} → ${dropoff}`;
                }
                if (!tripDistance && booking.distance) {
                    tripDistance = booking.distance;
                }
            }
        }

        // Create review
        const review = await Review.create({
            bookingId: booking?._id || null,
            userName,
            userEmail: userEmail || '',
            userImage: userImage || null,
            rating: Math.min(5, Math.max(1, parseInt(rating))),
            comment: comment.substring(0, 500),
            route: tripRoute || 'Unknown Route',
            distance: tripDistance || 0,
            isVerified,
            isApproved: false, // Requires admin approval
            showOnHomepage: true,
            source: 'website'
        });

        // Log to Discord
        await logNewReview({
            customerName: userName,
            rating,
            route: tripRoute,
            distance: tripDistance,
            text: comment
        });

        // Send thank you email
        if (userEmail) {
            await sendReviewThankYou(review);
        }

        return NextResponse.json({
            success: true,
            message: 'Review submitted! It will be visible after admin approval.',
            review: {
                _id: review._id,
                rating: review.rating,
                isVerified: review.isVerified
            }
        });
    } catch (error) {
        console.error('Error creating review:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// PATCH - Update review (admin approval)
export async function PATCH(request) {
    try {
        await dbConnect();

        const body = await request.json();
        const { reviewId, isApproved, showOnHomepage } = body;

        if (!reviewId) {
            return NextResponse.json(
                { success: false, error: 'Review ID is required' },
                { status: 400 }
            );
        }

        const update = {};
        if (typeof isApproved === 'boolean') update.isApproved = isApproved;
        if (typeof showOnHomepage === 'boolean') update.showOnHomepage = showOnHomepage;

        const review = await Review.findByIdAndUpdate(
            reviewId,
            update,
            { new: true }
        );

        if (!review) {
            return NextResponse.json(
                { success: false, error: 'Review not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            review
        });
    } catch (error) {
        console.error('Error updating review:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// DELETE - Remove review
export async function DELETE(request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const reviewId = searchParams.get('id');

        if (!reviewId) {
            return NextResponse.json(
                { success: false, error: 'Review ID is required' },
                { status: 400 }
            );
        }

        await Review.findByIdAndDelete(reviewId);

        return NextResponse.json({
            success: true,
            message: 'Review deleted'
        });
    } catch (error) {
        console.error('Error deleting review:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
