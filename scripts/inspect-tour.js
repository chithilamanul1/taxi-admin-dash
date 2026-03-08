const mongoose = require('mongoose');

const MONGO_URI = "mongodb+srv://chithilamanul1_db_user:chithila123@taxiadmindash.l9tttdj.mongodb.net/?appName=taxiadmindash";

async function inspectTour() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const Tour = mongoose.connection.db.collection('tours');
        const tour = await Tour.findOne({ slug: "polonnaruwa-ancient-city-tour-with-minneriya-elephant-safari" });

        console.log('--- Tour Data ---');
        console.log(JSON.stringify(tour, null, 2));

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

inspectTour();
