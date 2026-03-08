const mongoose = require('mongoose');

const MONGO_URI = "mongodb+srv://chithilamanul1_db_user:chithila123@taxiadmindash.l9tttdj.mongodb.net/?appName=taxiadmindash";

async function inspectTourViaDirectDB() {
    try {
        await mongoose.connect(MONGO_URI);
        const tour = await mongoose.connection.db.collection('tours').findOne({
            slug: 'polonnaruwa-ancient-city-tour-with-minneriya-elephant-safari'
        });

        if (!tour) {
            console.log('Tour not found by slug: polonnaruwa-ancient-city-tour-with-minneriya-elephant-safari');
        } else {
            console.log('Tour Found:', tour.title);
            console.log('--- INCLUSIONS ---');
            console.log('type:', typeof tour.inclusions);
            console.log('isArray:', Array.isArray(tour.inclusions));
            console.log('content:', tour.inclusions);

            console.log('\n--- EXCLUSIONS ---');
            console.log('type:', typeof tour.exclusions);
            console.log('isArray:', Array.isArray(tour.exclusions));
            console.log('content:', tour.exclusions);
        }

        // Also check if there's any other tour with a SIMILAR slug
        const similar = await mongoose.connection.db.collection('tours').find({
            slug: { $regex: /polonnaruwa/i }
        }).toArray();
        console.log('\n--- SIMILAR SLUGS FOUND ---');
        similar.forEach(t => console.log(`- ${t.slug} (Inclusions: ${t.inclusions?.length || 0}, Exclusions: ${t.exclusions?.length || 0})`));

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

inspectTourViaDirectDB();
