import mongoose from 'mongoose';
import dbConnect from './src/lib/db.js';
import Pricing from './src/models/Pricing.js';

async function updateMiniBus() {
    try {
        await dbConnect();
        console.log('Connected to DB');

        const result = await Pricing.updateMany(
            { vehicleType: 'mini-bus' },
            { $set: { image: '/vehicles/kdh.png' } }
        );

        console.log(`Updated ${result.modifiedCount} entries`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

updateMiniBus();
