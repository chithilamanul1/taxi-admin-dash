const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

async function checkSigiriya() {
    try {
        await mongoose.connect(MONGODB_URI, { dbName: 'taxiadmindash' });
        console.log('Connected to MongoDB.');

        const db = mongoose.connection.db;
        const destinationsCollection = db.collection('destinations');
        const sigiriya = await destinationsCollection.findOne({ name: /Sigiriya/i });

        if (sigiriya) {
            console.log('Sigiriya Destination Found:');
            console.log('Name:', sigiriya.name);
            console.log('Pickup Location:', sigiriya.pickupLocation);
            console.log('Applicable Ride Type:', sigiriya.applicableRideType);
            console.log('Vehicle Tiers:', JSON.stringify(sigiriya.vehicleTiers, null, 2));
        } else {
            console.log('Sigiriya Destination NOT Found.');
        }

        await mongoose.connection.close();
    } catch (err) {
        console.error('Error:', err);
    }
    process.exit(0);
}

checkSigiriya();
