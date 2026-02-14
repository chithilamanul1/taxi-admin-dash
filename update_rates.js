require('dotenv').config();
const mongoose = require('mongoose');
const dbConnect = require('./src/lib/db');
const Pricing = require('./src/models/Pricing');

async function run() {
    try {
        await dbConnect();
        const result = await Pricing.updateOne(
            { vehicleType: 'mini-car' },
            {
                $set: {
                    'tiers.2.rate': 102,
                    'tiers.3.rate': 102,
                    'perKmRate': 102
                }
            }
        );
        console.log('Update Result:', result);
    } catch (error) {
        console.error('Error updating rates:', error);
    } finally {
        process.exit(0);
    }
}

run();
