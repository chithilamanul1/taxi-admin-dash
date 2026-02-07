
require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');

// Define Schema roughly matching app schema to ensure compatibility
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
        name: 'Mini Car (Alto/WagonR)',
        image: '/vehicles/minicar.png',
        tiers: [{ min: 0, max: 999, type: 'per_km', price: 0, rate: 60 }],
        features: ['Air Conditioned', 'Economic'],
        capacity: 2,
        luggage: 2,
        handLuggage: 0,
        basePrice: 9000, // Scaled from $30
        perKmRate: 60,   // Scaled from 0.30
        baseKm: 0
    },
    {
        type: 'sedan',
        name: 'Sedan Car (Prius/Axio)',
        image: '/vehicles/sedancar.png',
        tiers: [{ min: 0, max: 999, type: 'per_km', price: 0, rate: 75 }],
        features: ['Air Conditioned', 'Comfortable'],
        capacity: 3,
        luggage: 2,
        handLuggage: 2,
        basePrice: 12000, // Scaled from $40
        perKmRate: 75,    // Scaled from 0.40
        baseKm: 0
    },
    {
        type: 'mini-van-every',
        name: 'Suzuki Every',
        image: '/vehicles/susukievery.png',
        tiers: [{ min: 0, max: 999, type: 'per_km', price: 0, rate: 85 }],
        features: ['Air Conditioned', 'Economic'],
        capacity: 3,
        luggage: 3,
        handLuggage: 4,
        basePrice: 12000,
        perKmRate: 85,
        baseKm: 0
    },
    {
        type: 'mini-van-05',
        name: 'Minivan (5 Seat)',
        image: '/vehicles/minivan5seat.png',
        tiers: [{ min: 0, max: 999, type: 'per_km', price: 0, rate: 90 }],
        features: ['Air Conditioned', 'Bluetooth Sound-System'],
        capacity: 5,
        luggage: 3,
        handLuggage: 4,
        basePrice: 15000,
        perKmRate: 90,
        baseKm: 0
    },
    {
        type: 'vezel',
        name: 'Honda Vezel',
        image: '/vehicles/Hondavezel.png',
        tiers: [{ min: 0, max: 999, type: 'per_km', price: 0, rate: 100 }],
        features: ['Air Conditioned', 'Bluetooth Sound-System'],
        capacity: 3,
        luggage: 2,
        handLuggage: 2,
        basePrice: 13500,
        perKmRate: 100,
        baseKm: 0
    },
    {
        type: 'suv',
        name: 'SUV',
        image: '/vehicles/Hondavezel.png', // Placeholder
        tiers: [{ min: 0, max: 999, type: 'per_km', price: 0, rate: 110 }],
        features: ['Air Conditioned', 'Luxury Interior'],
        capacity: 3,
        luggage: 2,
        handLuggage: 2,
        basePrice: 18000,
        perKmRate: 110,
        baseKm: 0
    },
    {
        type: 'normal-kdh',
        name: 'Van (9 Pax)',
        image: '/vehicles/van.png',
        tiers: [{ min: 0, max: 999, type: 'per_km', price: 0, rate: 120 }],
        features: ['Air Conditioned', 'Dual AC'],
        capacity: 9,
        luggage: 7,
        handLuggage: 5,
        basePrice: 21000,
        perKmRate: 120,
        baseKm: 0
    },
    {
        type: 'kdh-van',
        name: 'Minibus (Highroof)',
        image: '/vehicles/toyota highroof.png',
        tiers: [{ min: 0, max: 999, type: 'per_km', price: 0, rate: 130 }],
        features: ['Air Conditioned', 'Dual AC', 'High Roof'],
        capacity: 9,
        luggage: 7,
        handLuggage: 5,
        basePrice: 24000,
        perKmRate: 130,
        baseKm: 0
    },
    {
        type: 'mini-bus',
        name: 'Bus (Coaster)',
        image: '/vehicles/costerbus.png',
        tiers: [{ min: 0, max: 999, type: 'per_km', price: 0, rate: 180 }],
        features: ['Air Conditioned', 'Mic', 'TV/DVD'],
        capacity: 12,
        luggage: 10,
        handLuggage: 12,
        basePrice: 36000,
        perKmRate: 180,
        baseKm: 0
    },
    {
        type: 'coach-bus',
        name: 'Coach Bus (Big One)',
        image: '/vehicles/couch bus.png',
        tiers: [{ min: 0, max: 999, type: 'per_km', price: 0, rate: 250 }],
        features: ['Air Conditioned', 'Mic', 'TV/DVD', 'Reclining Seats'],
        capacity: 45,
        luggage: 30,
        handLuggage: 45,
        basePrice: 60000,
        perKmRate: 250,
        baseKm: 0
    }
];

// Categories to populate
const CATEGORIES = ['airport-transfer', 'ride-now', 'rentals', 'tours'];

async function updateFleet() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        for (const cat of CATEGORIES) {
            console.log(`Processing category: ${cat}`);
            for (const v of vehicles) {
                // Determine update vs insert
                await Pricing.findOneAndUpdate(
                    { vehicleType: v.type, category: cat },
                    {
                        $set: {
                            name: v.name,
                            image: v.image,
                            tiers: v.tiers,
                            features: v.features,
                            capacity: v.capacity,
                            luggage: v.luggage,
                            handLuggage: v.handLuggage,
                            basePrice: v.basePrice,
                            perKmRate: v.perKmRate,
                            baseKm: v.baseKm,
                            isActive: true
                        }
                    },
                    { upsert: true, new: true }
                );
            }
        }

        console.log('Fleet updated successfully for all categories');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

updateFleet();
