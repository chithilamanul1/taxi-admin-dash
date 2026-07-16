const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

const sigiriyaTiers = {
    'mini-car': [
        { minKm: 0, maxKm: 20, type: 'flat', value: 7000 },
        { minKm: 21, maxKm: 40, type: 'flat', value: 9000 },
        { minKm: 41, maxKm: 60, type: 'per-km', value: 150 },
        { minKm: 61, maxKm: 100, type: 'per-km', value: 150 },
        { minKm: 100, maxKm: 9999, type: 'per-km', value: 135 }
    ],
    'sedan': [
        { minKm: 0, maxKm: 20, type: 'flat', value: 9000 },
        { minKm: 21, maxKm: 40, type: 'flat', value: 11000 },
        { minKm: 41, maxKm: 60, type: 'per-km', value: 180 },
        { minKm: 61, maxKm: 100, type: 'per-km', value: 170 },
        { minKm: 100, maxKm: 9999, type: 'per-km', value: 155 }
    ]
};

const ellaTiers = {
    'mini-car': [
        { minKm: 0, maxKm: 20, type: 'flat', value: 7000 },
        { minKm: 21, maxKm: 40, type: 'flat', value: 9000 },
        { minKm: 41, maxKm: 60, type: 'per-km', value: 150 },
        { minKm: 61, maxKm: 100, type: 'per-km', value: 150 },
        { minKm: 100, maxKm: 9999, type: 'per-km', value: 135 }
    ],
    'sedan': [
        { minKm: 0, maxKm: 20, type: 'flat', value: 9000 },
        { minKm: 21, maxKm: 40, type: 'flat', value: 11000 },
        { minKm: 41, maxKm: 60, type: 'per-km', value: 180 },
        { minKm: 61, maxKm: 100, type: 'per-km', value: 170 },
        { minKm: 100, maxKm: 9999, type: 'per-km', value: 155 }
    ]
};

async function addRates() {
    try {
        await mongoose.connect(MONGODB_URI, { dbName: 'taxiadmindash' });
        console.log('Connected to MongoDB.');

        const db = mongoose.connection.db;
        const destinationsCollection = db.collection('destinations');

        // Update Sigiriya
        const sigiriya = await destinationsCollection.findOne({ name: /Sigiriya/i, pickupLocation: '' });
        if (sigiriya) {
            await destinationsCollection.updateOne(
                { _id: sigiriya._id },
                { $set: { vehicleTiers: sigiriyaTiers, applicableRideType: 'all' } }
            );
            console.log('Updated Sigiriya rates.');
        } else {
            await destinationsCollection.insertOne({
                name: 'Sigiriya, Sri Lanka',
                pickupLocation: '',
                applicableRideType: 'all',
                vehicleTiers: sigiriyaTiers,
                route_id: `route_global_sigiriya_${Date.now().toString().slice(-6)}`,
                title: 'Airport to Sigiriya, Sri Lanka'
            });
            console.log('Created Sigiriya destination.');
        }

        // Update Ella
        const ella = await destinationsCollection.findOne({ name: /Ella/i, pickupLocation: '' });
        if (ella) {
            await destinationsCollection.updateOne(
                { _id: ella._id },
                { $set: { vehicleTiers: ellaTiers, applicableRideType: 'all' } }
            );
            console.log('Updated Ella rates.');
        } else {
            await destinationsCollection.insertOne({
                name: 'Ella, Sri Lanka',
                pickupLocation: '',
                applicableRideType: 'all',
                vehicleTiers: ellaTiers,
                route_id: `route_global_ella_${Date.now().toString().slice(-6)}`,
                title: 'Airport to Ella, Sri Lanka'
            });
            console.log('Created Ella destination.');
        }

        await mongoose.connection.close();
    } catch (err) {
        console.error('Error:', err);
    }
    process.exit(0);
}

addRates();
