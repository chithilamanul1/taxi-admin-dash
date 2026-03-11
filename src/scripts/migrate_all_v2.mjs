import 'dotenv/config';
import mongoose from 'mongoose';
import { dayTrips } from '../data/tours-data.js';
import { seoBlogPosts } from '../data/seo-blog-posts.js';
import Tour from '../models/Tour.js';
import Post from '../models/Post.js';

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable');
    process.exit(1);
}

async function runMigration() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected.');

        // --- 1. Migrate Tours (Day Trips & Packages) ---
        console.log(`Found ${dayTrips.length} day trips in static data.`);
        
        let tourCount = 0;
        for (const staticTour of dayTrips) {
            try {
                // Determine category and duration
                let days = 1;
                let nights = 0;
                if (typeof staticTour.duration === 'string') {
                    const dMatch = staticTour.duration.match(/(\d+)\s*Day/i);
                    const nMatch = staticTour.duration.match(/(\d+)\s*Night/i);
                    if (dMatch) days = parseInt(dMatch[1]);
                    if (nMatch) nights = parseInt(nMatch[1]);
                }

                const category = (staticTour.type === 'day trip' || days === 1) ? 'day-trip' : 'tour-package';

                const tourData = {
                    title: staticTour.title,
                    slug: staticTour.id,
                    category: category,
                    duration: { days, nights },
                    description: staticTour.description || '',
                    shortDescription: staticTour.description ? staticTour.description.substring(0, 160) + '...' : '',
                    heroImage: staticTour.image,
                    images: [staticTour.image],
                    price: {
                        amount: typeof staticTour.price === 'object' ? staticTour.price.amount : (staticTour.price || 0),
                        currency: typeof staticTour.price === 'object' ? staticTour.price.currency : 'USD',
                        type: 'from'
                    },
                    destinations: staticTour.destinations || staticTour.tags || [],
                    inclusions: staticTour.includes || [],
                    exclusions: staticTour.excludes || [],
                    highlights: staticTour.highlights || [],
                    itinerary: staticTour.itinerary ? staticTour.itinerary.map((it, idx) => ({
                        day: it.day || (idx + 1),
                        title: it.title,
                        description: it.description || it.desc || '',
                        location: it.location || '',
                        lat: it.lat,
                        lng: it.lng,
                        activities: it.activities || []
                    })) : [],
                    experience: staticTour.experience ? staticTour.experience.map(exp => ({
                        heading: exp.heading || exp.time || '',
                        text: exp.text || exp.activity || '',
                        lat: exp.lat,
                        lng: exp.lng
                    })) : [],
                    notSuitableFor: staticTour.notSuitable || [],
                    notAllowed: staticTour.notAllowed || [],
                    isFeatured: staticTour.isFeatured || false,
                    isActive: true,
                    sortOrder: tourCount
                };

                await Tour.findOneAndUpdate(
                    { slug: tourData.slug },
                    { $set: tourData },
                    { upsert: true, new: true }
                );
                console.log(` Migrated Tour: ${staticTour.title}`);
                tourCount++;
            } catch (err) {
                console.error(` Error migrating tour ${staticTour.title}:`, err.message);
            }
        }

        // --- 2. Migrate Blog Posts ---
        console.log(`Found ${seoBlogPosts.length} blog posts in static data.`);
        let postCount = 0;
        for (const staticPost of seoBlogPosts) {
            try {
                const postData = {
                    title: staticPost.title,
                    slug: staticPost.slug,
                    content: staticPost.content,
                    excerpt: staticPost.excerpt,
                    imageUrl: staticPost.imageUrl,
                    tags: staticPost.tags || [],
                    isPublished: staticPost.isPublished ?? true,
                    seo: staticPost.seo || {},
                    author: 'Admin'
                };

                await Post.findOneAndUpdate(
                    { slug: postData.slug },
                    { $set: postData },
                    { upsert: true, new: true }
                );
                console.log(` Migrated Post: ${staticPost.title}`);
                postCount++;
            } catch (err) {
                console.error(` Error migrating post ${staticPost.title}:`, err.message);
            }
        }

        console.log(`\nMigration Complete: ${tourCount} tours, ${postCount} posts.`);
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

runMigration();
