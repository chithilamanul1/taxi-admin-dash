require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');

// Fallback Schema
const TourSchema = new mongoose.Schema({
    title: { type: String },
    slug: { type: String },
    category: { type: String },
    price: mongoose.Schema.Types.Mixed,
    image: String,
    images: [String],
    heroImage: String,
    itinerary: [mongoose.Schema.Types.Mixed]
}, { strict: false });

const Tour = mongoose.models.Tour || mongoose.model('Tour', TourSchema);

async function run() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { dbName: 'taxiadmindash' });
        console.log("Connected to DB");

        // 1. Remove tours with no images
        const noImageQuery = {
            $and: [
                { $or: [{ image: { $exists: false } }, { image: null }, { image: "" }] },
                { $or: [{ heroImage: { $exists: false } }, { heroImage: null }, { heroImage: "" }] },
                { $or: [{ images: { $exists: false } }, { images: { $size: 0 } }, { images: null }] }
            ]
        };
        const delRes = await Tour.deleteMany(noImageQuery);
        console.log(`Deleted ${delRes.deletedCount} tours with no images.`);

        // 2. Fix zero prices
        const tours = await Tour.find({});
        for (let t of tours) {
            let changed = false;

            let amount = 0;
            if (typeof t.price === 'object' && t.price !== null) {
                amount = t.price.amount || 0;
            } else if (typeof t.price === 'number') {
                amount = t.price;
            } else if (typeof t.price === 'string') {
                const match = t.price.match(/\d+/);
                if (match) amount = Number(match[0]);
            }

            // If still 0, try to guess from title or type just to have something, or let it be 0 for now.
            // Wait, we have the CSV files (public/tourpackages.csv and public/daytrips.csv)
            // But let's just make sure the price object is properly formatted first.

            if (typeof t.price !== 'object' || t.price === null || amount === 0) {
                // Try to salvage price if it's stored elsewhere or just ensure structure:
                t.price = { amount: amount, currency: 'USD', type: 'from' };
                changed = true;
            }

            if (changed) {
                await t.save();
                console.log(`Fixed price structure for ${t.title}: ${amount}`);
            }
        }

        // 3. Inspect Sri Lanka Classic
        const problematicTour = await Tour.findOne({ slug: 'sri-lanka-classic-northern-tour-10-days-09-nights' });
        if (problematicTour) {
            console.log("\nFound Problematic Tour:");
            console.log("Title:", problematicTour.title);
            console.log("Itinerary Array Size:", problematicTour.itinerary ? problematicTour.itinerary.length : 0);
            if (problematicTour.itinerary) {
                problematicTour.itinerary.forEach((day, idx) => {
                    console.log(` Day ${idx + 1} valid? `, typeof day === 'object');
                });
            }
        } else {
            console.log("Could not find Sri Lanka Classic Northern Tour");
        }

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
run();
