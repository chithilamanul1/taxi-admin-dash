require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');

const pricingSchema = new mongoose.Schema({
    vehicleType: String,
    category: String,
    name: String,
    tiers: Array,
    price: Number,
    rate: Number,
    basePrice: Number,
    perKmRate: Number,
    baseKm: Number,
    isActive: Boolean
}, { strict: false });

const Pricing = mongoose.models.Pricing || mongoose.model('Pricing', pricingSchema);

const busUpdates = [
    {
        type: 'mini-bus',
        name: 'Bus (Coaster)',
        basePrice: 20000,
        perKmRate: 400,
        tiers: [
            { min: 0, max: 20, type: 'flat', price: 20000 },
            { min: 21, max: 40, type: 'flat', price: 30000 },
            { min: 41, max: 100, type: 'flat', price: 50000 },
            { min: 101, max: 150, type: 'flat', price: 70000 },
            { min: 151, max: 200, type: 'flat', price: 85000 },
            { min: 201, max: 300, type: 'flat', price: 120000 },
            { min: 301, max: 9999, type: 'per_km', rate: 400 }
        ]
    },
    {
        type: 'coach-bus',
        name: 'Coach Bus (Big One)',
        basePrice: 25000,
        perKmRate: 450,
        tiers: [
            { min: 0, max: 20, type: 'flat', price: 25000 },
            { min: 21, max: 40, type: 'flat', price: 45000 },
            { min: 41, max: 100, type: 'flat', price: 60000 },
            { min: 101, max: 150, type: 'flat', price: 85000 },
            { min: 151, max: 200, type: 'flat', price: 95000 },
            { min: 201, max: 300, type: 'flat', price: 135000 },
            { min: 301, max: 9999, type: 'per_km', rate: 450 }
        ]
    }
];

const CATEGORIES = ['airport-transfer', 'ride-now', 'rentals', 'tours'];

async function updateBuses() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in .env');
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        for (const cat of CATEGORIES) {
            console.log(`Processing category: ${cat}`);
            for (const bus of busUpdates) {
                const result = await Pricing.updateMany(
                    { vehicleType: bus.type, category: cat },
                    {
                        $set: {
                            basePrice: bus.basePrice,
                            perKmRate: bus.perKmRate,
                            tiers: bus.tiers,
                            isActive: true
                        }
                    }
                );
                console.log(`Updated ${bus.name} (${cat}): ${result.modifiedCount} docs modified`);
            }
        }

        console.log('Bus pricing updated successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

updateBuses();
