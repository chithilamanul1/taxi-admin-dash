require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');

async function fixDB() {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: 'taxiadmindash' });
    const col = mongoose.connection.collection('tours');

    // 1. Delete no image tours
    const delRes = await col.deleteMany({
        $and: [
            { $or: [{ image: { $exists: false } }, { image: null }, { image: "" }] },
            { $or: [{ heroImage: { $exists: false } }, { heroImage: null }, { heroImage: "" }] },
            { $or: [{ images: { $exists: false } }, { images: { $size: 0 } }, { images: null }] }
        ]
    });
    console.log(`Deleted ${delRes.deletedCount} items missing images.`);

    // 2. Fix Pricing
    const tours = await col.find({}).toArray();
    for (const t of tours) {
        let changed = false;
        let p = t.price;
        let amount = 0;

        if (typeof p === 'object' && p !== null) {
            amount = p.amount || 0;
            if (p.currency !== 'USD') {
                p.currency = 'USD';
                changed = true;
            }
        } else if (typeof p === 'number') {
            amount = p;
            p = { amount: amount, currency: 'USD', type: 'from' };
            changed = true;
        } else if (typeof p === 'string') {
            const match = p.match(/\d+/);
            if (match) amount = Number(match[0]);
            p = { amount: amount, currency: 'USD', type: 'from' };
            changed = true;
        } else {
            p = { amount: 0, currency: 'USD', type: 'from' };
            changed = true;
        }

        // If amount is 0, let's try to pull from CSV data or just ensure format
        // The issue is the UI expects an object or falls back to Number
        if (changed) {
            await col.updateOne({ _id: t._id }, { $set: { price: p } });
            console.log(`Updated price for ${t.title} to ${amount}`);
        }
    }

    // 3. Inspect the problematic tour
    const badTour = await col.findOne({ slug: 'sri-lanka-classic-northern-tour-10-days-09-nights' });
    if (badTour) console.log("Found Bad Tour - Itinerary Array Size:", badTour.itinerary?.length);
    else console.log("Bad tour not found");

    process.exit(0);
}
fixDB();
