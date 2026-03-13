const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const updates = [
    {
        vehicleType: 'normal-kdh',
        tiers: [
            { min: 0, max: 20, type: 'flat', price: 6000, rate: 0 },
            { min: 20, max: 40, type: 'flat', price: 8500, rate: 0 },
            { min: 40, max: 100, type: 'per_km', price: 0, rate: 200 },
            { min: 100, max: 140, type: 'per_km', price: 0, rate: 180 },
            { min: 140, max: 200, type: 'per_km', price: 0, rate: 145 },
            { min: 200, max: 9999, type: 'per_km', price: 0, rate: 135 }
        ],
        perKmRate: 135,
        basePrice: 6000
    },
    {
        vehicleType: 'mini-van-05',
        tiers: [
            { min: 0, max: 20, type: 'flat', price: 6000, rate: 0 },
            { min: 20, max: 40, type: 'flat', price: 8500, rate: 0 },
            { min: 40, max: 100, type: 'per_km', price: 0, rate: 200 },
            { min: 100, max: 140, type: 'per_km', price: 0, rate: 176 },
            { min: 140, max: 200, type: 'per_km', price: 0, rate: 143 },
            { min: 200, max: 9999, type: 'per_km', price: 0, rate: 132 }
        ],
        perKmRate: 132,
        basePrice: 6000
    },
    {
        vehicleType: 'vezel',
        tiers: [
            { min: 0, max: 20, type: 'flat', price: 6500, rate: 0 },
            { min: 20, max: 40, type: 'flat', price: 9500, rate: 0 },
            { min: 40, max: 100, type: 'per_km', price: 0, rate: 150 },
            { min: 100, max: 140, type: 'per_km', price: 0, rate: 145 },
            { min: 140, max: 200, type: 'per_km', price: 0, rate: 140 },
            { min: 200, max: 9999, type: 'per_km', price: 0, rate: 135 }
        ],
        perKmRate: 135,
        basePrice: 6500
    },
    {
        vehicleType: 'mini-bus',
        tiers: [
            { min: 0, max: 20, type: 'flat', price: 7500, rate: 0 },
            { min: 20, max: 40, type: 'flat', price: 12000, rate: 0 },
            { min: 40, max: 100, type: 'per_km', price: 0, rate: 220 },
            { min: 100, max: 140, type: 'per_km', price: 0, rate: 220 },
            { min: 140, max: 200, type: 'per_km', price: 0, rate: 175 },
            { min: 200, max: 9999, type: 'per_km', price: 0, rate: 155 }
        ],
        perKmRate: 155,
        basePrice: 7500
    },
    {
        vehicleType: 'bus',
        tiers: [
            { min: 0, max: 20, type: 'flat', price: 20000, rate: 0 },
            { min: 20, max: 40, type: 'flat', price: 30000, rate: 0 },
            { min: 40, max: 100, type: 'flat', price: 50000, rate: 0 },
            { min: 100, max: 140, type: 'flat', price: 70000, rate: 0 },
            { min: 140, max: 200, type: 'flat', price: 85000, rate: 0 },
            { min: 200, max: 300, type: 'flat', price: 120000, rate: 0 },
            { min: 300, max: 9999, type: 'per_km', price: 0, rate: 400 }
        ],
        perKmRate: 400,
        basePrice: 20000
    },
    {
        vehicleType: 'coach-bus',
        tiers: [
            { min: 0, max: 20, type: 'flat', price: 25000, rate: 0 },
            { min: 20, max: 40, type: 'flat', price: 45000, rate: 0 },
            { min: 40, max: 100, type: 'flat', price: 60000, rate: 0 },
            { min: 100, max: 140, type: 'flat', price: 85000, rate: 0 },
            { min: 140, max: 200, type: 'flat', price: 95000, rate: 0 },
            { min: 200, max: 300, type: 'flat', price: 135000, rate: 0 },
            { min: 300, max: 9999, type: 'per_km', price: 0, rate: 450 }
        ],
        perKmRate: 450,
        basePrice: 25000
    }
];

async function update() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { dbName: 'taxiadmindash' });
        console.log('Connected to DB');

        const Pricing = mongoose.model('Pricing', new mongoose.Schema({}, { strict: false, collection: 'pricings' }));

        for (const update of updates) {
            const result = await Pricing.updateOne(
                { vehicleType: update.vehicleType, category: 'airport-transfer' },
                { 
                    $set: { 
                        tiers: update.tiers,
                        perKmRate: update.perKmRate,
                        basePrice: update.basePrice
                    } 
                }
            );
            console.log(`Updated ${update.vehicleType}: ${result.modifiedCount} modified`);
        }

        console.log('Update complete');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

update();
