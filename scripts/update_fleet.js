
require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');

// Define Schema EXACTLY as in your application
const pricingSchema = new mongoose.Schema({
    type: String, // helper field
    vehicleType: String,
    name: String,
    image: String,
    tiers: Array,
    features: Array,
    capacity: Number,
    luggage: Number,
    handLuggage: Number, // Added hand luggage field
    basePrice: Number,
    perKmRate: Number,
    baseKm: Number
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
        handLuggage: 0, // Not verified
        basePrice: 30,
        perKmRate: 0.30,
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
        basePrice: 40,
        perKmRate: 0.40,
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
        basePrice: 40,
        perKmRate: 0.40,
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
        basePrice: 50,
        perKmRate: 0.50,
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
        basePrice: 45,
        perKmRate: 0.45,
        baseKm: 0
    },
    {
        type: 'suv',
        name: 'SUV',
        image: '/vehicles/Hondavezel.png', // Placeholder as SUV image missing in provided list
        tiers: [{ min: 0, max: 999, type: 'per_km', price: 0, rate: 110 }],
        features: ['Air Conditioned', 'Luxury Interior'],
        capacity: 3,
        luggage: 2,
        handLuggage: 2,
        basePrice: 60,
        perKmRate: 0.60,
        baseKm: 0
    },
    {
        type: 'van',
        name: 'Van (9 Pax)',
        image: '/vehicles/van.png',
        tiers: [{ min: 0, max: 999, type: 'per_km', price: 0, rate: 120 }],
        features: ['Air Conditioned', 'Dual AC'],
        capacity: 9,
        luggage: 7,
        handLuggage: 5,
        basePrice: 70,
        perKmRate: 0.70,
        baseKm: 0
    },
    {
        type: 'kdh-van', // Mapping highroof to kdh-van type for consistency
        name: 'Minibus (Highroof)',
        image: '/vehicles/toyota highroof.png',
        tiers: [{ min: 0, max: 999, type: 'per_km', price: 0, rate: 130 }],
        features: ['Air Conditioned', 'Dual AC', 'High Roof'],
        capacity: 9,
        luggage: 7,
        handLuggage: 5,
        basePrice: 80,
        perKmRate: 0.80,
        baseKm: 0
    },
    {
        type: 'mini-bus',
        name: 'Bus (Coaster)',
        image: '/vehicles/costerbus.png',
        tiers: [{ min: 0, max: 999, type: 'per_km', price: 0, rate: 180 }],
        features: ['Air Conditioned', 'Mic', 'TV/DVD'],
        capacity: 12, // User specified 12
        luggage: 10,
        handLuggage: 12,
        basePrice: 120,
        perKmRate: 1.20,
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
        basePrice: 200,
        perKmRate: 2.00,
        baseKm: 0
    }
];

async function updateFleet() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // First clean up old entries to avoid duplicates with different types
        // await Pricing.deleteMany({}); // Optional: decided to upsert instead to be safe? 
        // User wants SPECIFIC list. Let's upsert by vehicleType.

        for (const v of vehicles) {
            console.log(`Updating ${v.name}...`);
            await Pricing.findOneAndUpdate(
                { vehicleType: v.type },
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
                        baseKm: v.baseKm
                    }
                },
                { upsert: true, new: true }
            );
        }

        console.log('Fleet updated successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

updateFleet();
