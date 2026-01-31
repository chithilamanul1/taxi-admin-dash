import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Tour from '@/models/Tour';
import { dayTrips } from '@/data/tours-data';

export async function GET() {
    try {
        await dbConnect();

        // Clear existing? Or just upsert?
        // Let's upsert based on slug or ID.
        // Since ID in data is manual string, we can stick it in slug or separate ID field.
        // My Schema has `slug`. I can use that.

        let createdCount = 0;
        let updatedCount = 0;

        for (const trip of dayTrips) {
            const slug = trip.id; // Use the ID from data as slug

            const payload = {
                title: trip.title,
                slug: slug,
                description: trip.description,
                category: trip.type.includes('safari') ? 'Safari' : (trip.type.includes('city') ? 'City Tours' : 'Day Tours'),
                duration: parseInt(trip.duration) || 1, // Simple parse
                price: trip.price,
                image: trip.image,
                images: [], // Fallback
                rating: 4.8,
                highlights: trip.highlights || [],
                itinerary: trip.itinerary || [],
                inclusions: trip.includes || [],
                isActive: true
            };

            const existing = await Tour.findOne({ slug });
            if (existing) {
                // Update?
                // await Tour.updateOne({ slug }, payload);
                // updatedCount++;
            } else {
                await Tour.create(payload);
                createdCount++;
            }
        }

        return NextResponse.json({
            success: true,
            message: `Seeding complete. Created: ${createdCount}, Updated: ${updatedCount}`,
            totalProcessed: dayTrips.length
        });

    } catch (error) {
        return NextResponse.json({ success: false, error: "Seeding failed: " + error.message }, { status: 500 });
    }
}
