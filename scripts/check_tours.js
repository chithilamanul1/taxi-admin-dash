
require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    title: String,
    price: Number,
    category: String,
    duration: String
}, { strict: false });

const Tour = mongoose.models.Tour || mongoose.model('Tour', tourSchema);

async function checkTours() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const tours = await Tour.find({});
        console.log(`Found ${tours.length} tours.`);

        tours.forEach(t => {
            console.log(`Tour: ${t.title} | Price: ${t.price} | Category: ${t.category} | Duration: ${t.duration}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkTours();
