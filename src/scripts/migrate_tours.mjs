import 'dotenv/config';
import mongoose from 'mongoose';
import { dayTrips, tourPackages } from '../data/tours-data.js';
import Tour from '../models/Tour.js';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable');
    process.exit(1);
}

async function runMigration() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected.');

        const toursAndTrips = [...dayTrips, ...tourPackages];
        console.log(`Found ${toursAndTrips.length} tours in static data.`);

        let count = 0;
        let errors = 0;

        for (const staticTour of toursAndTrips) {
            try {
                // Parse duration "1 Day" -> days: 1, nights: 0
                // "2 Days / 1 Night" -> days: 2, nights: 1
                let days = 1;
                let nights = 0;

                if (typeof staticTour.duration === 'string') {
                    const dMatch = staticTour.duration.match(/(\d+)\s*Day/i);
                    const nMatch = staticTour.duration.match(/(\d+)\s*Night/i);
                    if (dMatch) days = parseInt(dMatch[1]);
                    if (nMatch) nights = parseInt(nMatch[1]);
                }

                // Parse category "Day Trips" -> "day-trip"
                // "Tour Packages" -> "tour-package"
                let category = 'tour-package';
                if (staticTour.category === 'Day Trips' || staticTour.duration === '1 Day') {
                    category = 'day-trip';
                }

                const tourData = {
                    title: staticTour.title,
                    slug: staticTour.id, // Using existing ID as slug
                    category: category,
                    duration: { days, nights },
                    description: staticTour.description || 'Description not provided.',
                    shortDescription: staticTour.description ? staticTour.description.substring(0, 150) + '...' : '',
                    heroImage: staticTour.image,
                    images: [staticTour.image],
                    price: {
                        amount: typeof staticTour.price === 'object' ? (staticTour.price.amount || 0) : (staticTour.price || 0),
                        currency: 'USD',
                        type: 'from'
                    },
                    destinations: staticTour.tags || [],
                    inclusions: staticTour.includes || [],
                    exclusions: [],
                    itinerary: staticTour.itinerary ? staticTour.itinerary.map((it, index) => ({
                        day: index + 1,
                        title: it.title,
                        description: it.description || '',
                        activities: [] // We don't have detailed activities in the static structure currently
                    })) : [],
                    isFeatured: staticTour.isFeatured || false,
                    isActive: true,
                    sortOrder: count // Persist original order
                };

                // Upsert to prevent duplicates if run twice
                await Tour.findOneAndUpdate(
                    { slug: tourData.slug },
                    { $set: tourData },
                    { upsert: true, new: true }
                );

                console.log(` migrated: ${staticTour.title}`);
                count++;
            } catch (err) {
                console.error(`Error migrating ${staticTour.title}:`, err.message);
                errors++;
            }
        }

        console.log(`\nMigration Complete: ${count} successful, ${errors} errors.`);
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

runMigration();
