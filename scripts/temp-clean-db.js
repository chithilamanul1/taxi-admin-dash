require('dotenv').config({ path: '.env.local' }); // Load .env.local
const mongoose = require('mongoose');

async function cleanTours() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { dbName: 'taxiadmindash' });
        console.log("Connected to DB");

        const toursCol = mongoose.connection.collection('tours');

        // Find tours without an image, heroImage, and images array is empty or missing
        const noImageQuery = {
            $and: [
                { $or: [{ image: { $exists: false } }, { image: null }, { image: "" }] },
                { $or: [{ heroImage: { $exists: false } }, { heroImage: null }, { heroImage: "" }] },
                { $or: [{ images: { $exists: false } }, { images: { $size: 0 } }, { images: null }] }
            ]
        };

        const fakeTours = await toursCol.find(noImageQuery).toArray();
        console.log(`Found ${fakeTours.length} tours/day-trips with NO images.`);
        fakeTours.forEach(t => console.log(`- ${t.title} (${t.category})`));

        const result = await toursCol.deleteMany(noImageQuery);
        console.log(`Deleted ${result.deletedCount} tours.`);

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

cleanTours();
