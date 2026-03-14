const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Try fallback to .env if .env.local fails
if (!process.env.MONGODB_URI) {
    require('dotenv').config({ path: '.env' });
}

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!MONGODB_URI) {
    console.error('MONGODB_URI not found');
    process.exit(1);
}

async function checkPricing() {
    try {
        console.log('Connecting to:', MONGODB_URI.split('@')[1] || MONGODB_URI);
        await mongoose.connect(MONGODB_URI, {
            dbName: 'taxiadmindash',
            bufferCommands: false
        });
        console.log('Connected to MongoDB');

        // Try both pluralizations just in case
        let collection = mongoose.connection.db.collection('pricings');
        let vehicles = await collection.find({}).toArray();
        
        if (vehicles.length === 0) {
            console.log('No records in "pricings", trying "pricing"...');
            collection = mongoose.connection.db.collection('pricing');
            vehicles = await collection.find({}).toArray();
        }

        console.log(`Found ${vehicles.length} pricing records`);

        vehicles.forEach(v => {
            console.log(`Vehicle: ${v.name} (${v.vehicleType}) | Category: ${v.category}`);
            console.log(`  Image: ${v.image || 'EMPTY'}`);
            console.log(`  _id: ${v._id}`);
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

checkPricing();
