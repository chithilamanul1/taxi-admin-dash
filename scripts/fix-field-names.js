/**
 * Database Migration Script
 * Fixes field name inconsistencies:
 * - Merges `included` → `inclusions` (canonical schema field)
 * - Merges `excluded` → `exclusions` (canonical schema field)
 * - Ensures `description` is populated from scraped data
 * - Cleans up orphan fields
 */
const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb+srv://chithilamanul1_db_user:chithila123@taxiadmindash.l9tttdj.mongodb.net/?appName=taxiadmindash';

async function fix() {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;
    const collection = db.collection('tours');

    const tours = await collection.find({}).toArray();
    console.log(`Found ${tours.length} tours to check.`);

    let fixed = 0;
    for (const tour of tours) {
        const updates = {};
        const unsets = {};

        // Fix inclusions: merge `included` into `inclusions` if inclusions is empty/short
        if (tour.included && tour.included.length > 0) {
            const currentInclusions = tour.inclusions || [];
            // Use whichever has more detailed data
            if (currentInclusions.length === 0 || tour.included.length > currentInclusions.length) {
                updates.inclusions = tour.included;
            }
            unsets.included = "";
        }

        // Fix exclusions: merge `excluded` into `exclusions` if exclusions is empty/short
        if (tour.excluded && tour.excluded.length > 0) {
            const currentExclusions = tour.exclusions || [];
            if (currentExclusions.length === 0 || tour.excluded.length > currentExclusions.length) {
                updates.exclusions = tour.excluded;
            }
            unsets.excluded = "";
        }

        // Fix description: ensure it's not null/empty
        if (!tour.description || tour.description.trim() === '') {
            // Generate a description from itinerary if available
            if (tour.itinerary && tour.itinerary.length > 0) {
                const destinations = tour.itinerary.map(d => d.title).filter(Boolean);
                updates.description = `Explore Sri Lanka with our ${tour.title}. This tour covers ${destinations.join(', ')}. Experience the rich culture, breathtaking landscapes, and warm hospitality of Sri Lanka with our professional chauffeur-guided service.`;
            } else {
                updates.description = `Discover Sri Lanka with ${tour.title}. A premium guided tour experience with comfortable transportation and expert local knowledge.`;
            }
        }

        // Apply updates
        const updateOps = {};
        if (Object.keys(updates).length > 0) updateOps.$set = updates;
        if (Object.keys(unsets).length > 0) updateOps.$unset = unsets;

        if (Object.keys(updateOps).length > 0) {
            await collection.updateOne({ _id: tour._id }, updateOps);
            fixed++;
            console.log(`Fixed: ${tour.title}`);
            if (updates.inclusions) console.log(`  → inclusions: ${updates.inclusions.length} items`);
            if (updates.exclusions) console.log(`  → exclusions: ${updates.exclusions.length} items`);
            if (updates.description) console.log(`  → description: added`);
        }
    }

    console.log(`\nDone. Fixed ${fixed} of ${tours.length} tours.`);
    await mongoose.connection.close();
}

fix().catch(err => { console.error(err); process.exit(1); });
