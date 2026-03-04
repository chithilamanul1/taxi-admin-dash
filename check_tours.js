const mongoose = require('mongoose');
require('dotenv').config();

async function checkTours() {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const tours = await db.collection('tours').find({}).toArray();
    console.log("Total tours:", tours.length);
    const categories = tours.map(t => t.category);
    console.log("Categories:", Array.from(new Set(categories)));
    if (tours.length > 0) {
        console.log("First tour:", JSON.stringify(tours[0], null, 2));
    }
    mongoose.disconnect();
}
checkTours();
