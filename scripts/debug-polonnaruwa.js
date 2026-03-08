const mongoose = require('mongoose');

const MONGO_URI = "mongodb+srv://chithilamanul1_db_user:chithila123@taxiadmindash.l9tttdj.mongodb.net/?appName=taxiadmindash";

async function inspectTour() {
    try {
        await mongoose.connect(MONGO_URI);
        const tour = await mongoose.connection.db.collection('tours').findOne({
            slug: 'polonnaruwa-ancient-city-tour-with-minneriya-elephant-safari'
        });

        if (!tour) {
            console.log('Tour not found!');
        } else {
            console.log('Tour Found:', tour.title);
            console.log('--- Inclusions Fields ---');
            console.log('inclusions:', JSON.stringify(tour.inclusions, null, 2));
            console.log('included:', JSON.stringify(tour.included, null, 2));
            console.log('includes:', JSON.stringify(tour.includes, null, 2));

            console.log('\n--- Exclusions Fields ---');
            console.log('exclusions:', JSON.stringify(tour.exclusions, null, 2));
            console.log('excluded:', JSON.stringify(tour.excluded, null, 2));
            console.log('excludes:', JSON.stringify(tour.excludes, null, 2));
        }
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

inspectTour();
