import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Tour from './src/models/Tour.js';

dotenv.config();

async function checkTours() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const tours = await Tour.find({}).limit(5).lean();
        console.log("Sample Tours Data:");
        tours.forEach(t => {
            console.log(`- Title: ${t.title}`);
            console.log(`  Destinations: ${JSON.stringify(t.destinations)}`);
        });
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkTours();
