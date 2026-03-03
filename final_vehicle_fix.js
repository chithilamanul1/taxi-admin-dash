const mongoose = require('mongoose');
require('dotenv').config();

const pricingSchema = new mongoose.Schema({
    vehicleType: String,
    category: String,
    name: String,
    image: String,
    tiers: Array,
    features: Array,
    capacity: Number,
    luggage: Number,
    handLuggage: Number,
    basePrice: Number,
    perKmRate: Number,
    baseKm: Number,
    isActive: { type: Boolean, default: true }
}, { strict: false });

const Pricing = mongoose.models.Pricing || mongoose.model('Pricing', pricingSchema);

const vehicles = [
    {
        type: 'mini-car',
        name: 'Mini Car',
        image: '/vehicles/minicar.png',
        capacity: 2, luggage: 2, handLuggage: 2,
        basePrice: 9000, perKmRate: 60, baseKm: 0,
        features: ['Air Conditioned', 'Economic']
    },
    {
        type: 'sedan',
        name: 'Sedan',
        image: '/vehicles/sedancar.png',
        capacity: 3, luggage: 3, handLuggage: 3,
        basePrice: 12000, perKmRate: 75, baseKm: 0,
        features: ['Air Conditioned', 'Comfortable']
    },
    {
        type: 'suv',
        name: 'SUV',
        image: '/vehicles/Hondavezel.png', // Placeholder from earlier script
        capacity: 3, luggage: 3, handLuggage: 3,
        basePrice: 18000, perKmRate: 110, baseKm: 0,
        features: ['Air Conditioned', 'Luxury Interior']
    },
    {
        type: 'mini-van-every',
        name: 'Mini Van Every',
        image: '/vehicles/susukievery.png',
        capacity: 3, luggage: 3, handLuggage: 3,
        basePrice: 12000, perKmRate: 85, baseKm: 0,
        features: ['Air Conditioned', 'Economic']
    },
    {
        type: 'mini-van-05',
        name: 'Mini Van (4 Seat)',
        image: '/vehicles/minivan5seat.png',
        capacity: 4, luggage: 4, handLuggage: 4,
        basePrice: 15000, perKmRate: 90, baseKm: 0,
        features: ['Air Conditioned', 'Bluetooth Sound-System']
    },
    {
        type: 'normal-kdh',
        name: 'Van (KDH Flat Roof)',
        image: '/vehicles/van.png',
        capacity: 6, luggage: 7, handLuggage: 7,
        basePrice: 21000, perKmRate: 120, baseKm: 0,
        features: ['Air Conditioned', 'Dual AC']
    },
    {
        type: 'kdh-van',
        name: 'Mini Bus (KDH High Roof)',
        image: '/vehicles/toyota highroof.png',
        capacity: 8, luggage: 8, handLuggage: 6,
        basePrice: 24000, perKmRate: 130, baseKm: 0,
        features: ['Air Conditioned', 'Dual AC', 'High Roof']
    },
    {
        type: 'mini-bus',
        name: 'Coaster Bus',
        image: '/vehicles/costerbus.png',
        capacity: 25, luggage: 25, handLuggage: 15,
        basePrice: 20000, perKmRate: 400, baseKm: 0,
        features: ['Air Conditioned', 'Mic', 'TV/DVD']
    },
    {
        type: 'coach-bus',
        name: 'Couch Bus',
        image: '/vehicles/couch bus.png',
        capacity: 45, luggage: 45, handLuggage: 25,
        basePrice: 25000, perKmRate: 450, baseKm: 0,
        features: ['Air Conditioned', 'Mic', 'TV/DVD', 'Reclining Seats']
    }
];

const CATEGORIES = ['airport-transfer', 'ride-now', 'rentals', 'tours'];

async function runFix() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // 1. CLEAN DELETE ALL
        console.log('Deleting all existing pricing records...');
        await Pricing.deleteMany({});
        console.log('Deleted.');

        // 2. INSERT 9 VEHICLES FOR EACH CATEGORY
        for (const cat of CATEGORIES) {
            console.log(`Seeding category: ${cat}`);
            const docs = vehicles.map(v => ({
                ...v,
                vehicleType: v.type,
                category: cat,
                isActive: true,
                tiers: [{ min: 0, max: 9999, type: 'per_km', price: 0, rate: v.perKmRate }]
            }));
            await Pricing.insertMany(docs);
        }

        console.log('Migration complete. 9 vehicles seeded for all categories.');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

runFix();
