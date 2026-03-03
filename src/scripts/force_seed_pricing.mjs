import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve paths for .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../../.env');

// Load Env
dotenv.config({ path: envPath });

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!MONGODB_URI) {
    console.error('❌ CRITICAL: No MONGODB_URI found in .env.local');
    console.error('   Path tried:', envPath);
    process.exit(1);
}

// Define Schema Inline to avoid import issues
const PricingSchema = new mongoose.Schema({
    vehicleType: { type: String, required: true }, // e.g., 'sedan', 'van'
    name: { type: String, required: true },
    category: { type: String, required: true }, // 'airport-transfer', 'city-tour'
    basePrice: { type: Number, required: true }, // LKR
    baseKm: { type: Number, default: 0 },
    perKmRate: { type: Number, required: true },
    capacity: { type: Number, default: 4 },
    luggage: { type: Number, default: 2 },
    image: { type: String },
    tiers: [
        {
            min: Number,
            max: Number,
            rate: Number,
            type: { type: String, default: 'per_km' }, // 'per_km' or 'flat'
            price: Number // Only for flat
        }
    ],
    waitingCharges: [Number], // Hourly rates for 1st, 2nd... hour
    features: [String]
});

// Prevent Overwrite Error
const Pricing = mongoose.models.Pricing || mongoose.model('Pricing', PricingSchema);

const commonFeatures = ['Air Conditioning', 'Bluetooth', 'USB Charging'];

const vehicles = [
    {
        name: 'Mini Car',
        vehicleType: 'mini-car',
        category: 'airport-transfer',
        capacity: 4,
        luggage: 2,
        basePrice: 3500,
        baseKm: 0,
        perKmRate: 100,
        image: '/vehicles/minicar.png',
        features: commonFeatures,
        tiers: [
            { min: 0, max: 20, type: 'flat', price: 3500 },
            { min: 21, max: 40, type: 'flat', price: 4000 },
            { min: 41, max: 130, type: 'per_km', rate: 100 },
            { min: 131, max: 9999, type: 'per_km', rate: 102 }
        ]
    },
    {
        name: 'Standard Sedan',
        vehicleType: 'sedan',
        category: 'airport-transfer',
        capacity: 4,
        luggage: 3,
        basePrice: 4500,
        baseKm: 0,
        perKmRate: 130,
        image: '/vehicles/sedancar.png',
        features: commonFeatures,
        tiers: [
            { min: 0, max: 20, type: 'flat', price: 4500 },
            { min: 21, max: 40, type: 'flat', price: 6000 },
            { min: 41, max: 100, type: 'per_km', rate: 130 },
            { min: 101, max: 9999, type: 'per_km', rate: 125 }
        ]
    },
    {
        name: 'Honda Vezel (Hybrid/Similar)',
        vehicleType: 'vezel',
        category: 'airport-transfer',
        capacity: 4,
        luggage: 3,
        basePrice: 5500,
        baseKm: 0,
        perKmRate: 135,
        image: '/vehicles/Hondavezel.png',
        features: [...commonFeatures, 'Hybrid'],
        tiers: [
            { min: 0, max: 20, type: 'flat', price: 5500 },
            { min: 21, max: 40, type: 'flat', price: 7500 },
            { min: 41, max: 100, type: 'per_km', rate: 145 },
            { min: 101, max: 9999, type: 'per_km', rate: 135 }
        ]
    },
    {
        name: 'Mini Van (Suzuki Every/Similar)',
        vehicleType: 'mini-van-every',
        category: 'airport-transfer',
        capacity: 4,
        luggage: 4,
        basePrice: 4500,
        baseKm: 0,
        perKmRate: 110,
        image: '/vehicles/susukievery.png',
        features: commonFeatures,
        tiers: [
            { min: 0, max: 20, type: 'flat', price: 4500 },
            { min: 21, max: 40, type: 'flat', price: 6000 },
            { min: 41, max: 100, type: 'per_km', rate: 130 },
            { min: 101, max: 9999, type: 'per_km', rate: 120 }
        ]
    },
    {
        name: 'Mini Van (5 Seater)',
        vehicleType: 'mini-van-05',
        category: 'airport-transfer',
        capacity: 5,
        luggage: 5,
        basePrice: 6000,
        baseKm: 0,
        perKmRate: 130,
        image: '/vehicles/minivan5seat.png',
        features: commonFeatures,
        tiers: [
            { min: 0, max: 20, type: 'flat', price: 6000 },
            { min: 21, max: 40, type: 'flat', price: 8500 },
            { min: 41, max: 100, type: 'per_km', rate: 200 },
            { min: 101, max: 9999, type: 'per_km', rate: 130 }
        ]
    },
    {
        name: 'SUV (Luxury)',
        vehicleType: 'suv',
        category: 'airport-transfer',
        capacity: 4,
        luggage: 4,
        basePrice: 8000,
        baseKm: 0,
        perKmRate: 160,
        image: '/vehicles/Hondavezel.png',
        features: [...commonFeatures, 'Leather Seats'],
        tiers: [
            { min: 0, max: 20, type: 'flat', price: 8000 },
            { min: 21, max: 40, type: 'flat', price: 12000 },
            { min: 41, max: 100, type: 'per_km', rate: 250 },
            { min: 101, max: 9999, type: 'per_km', rate: 180 }
        ]
    },
    {
        name: 'KDH Van',
        vehicleType: 'kdh-van',
        category: 'airport-transfer',
        capacity: 10,
        luggage: 8,
        basePrice: 8500,
        baseKm: 0,
        perKmRate: 180,
        image: '/vehicles/toyota-highroof.png',
        features: commonFeatures,
        tiers: [
            { min: 0, max: 20, type: 'flat', price: 8500 },
            { min: 21, max: 40, type: 'flat', price: 12000 },
            { min: 41, max: 100, type: 'per_km', rate: 200 },
            { min: 101, max: 9999, type: 'per_km', rate: 180 }
        ]
    },
    {
        name: 'Mini Bus (Coster)',
        vehicleType: 'mini-bus',
        category: 'airport-transfer',
        capacity: 20,
        luggage: 15,
        basePrice: 15000,
        baseKm: 0,
        perKmRate: 250,
        image: '/vehicles/costerbus.png',
        features: [...commonFeatures, 'TV', 'Microphone'],
        tiers: [
            { min: 0, max: 40, type: 'flat', price: 15000 },
            { min: 41, max: 100, type: 'per_km', rate: 250 },
            { min: 101, max: 9999, type: 'per_km', rate: 220 }
        ]
    },
    {
        name: 'Luxury Coach Bus',
        vehicleType: 'coach-bus',
        category: 'airport-transfer',
        capacity: 45,
        luggage: 50,
        basePrice: 25000,
        baseKm: 0,
        perKmRate: 450,
        image: '/vehicles/coach-bus.png',
        features: [...commonFeatures, 'TV', 'Reclining Seats'],
        tiers: [
            { min: 0, max: 40, type: 'flat', price: 25000 },
            { min: 41, max: 100, type: 'per_km', rate: 450 },
            { min: 101, max: 9999, type: 'per_km', rate: 400 }
        ]
    }
];

// Duplicate for city-tour/ride-now if needed or just use current
const rideNowVehicles = vehicles.map(v => ({ ...v, category: 'ride-now' }));

async function seed() {
    try {
        console.log('🔌 Connecting to DB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected.');

        // 1. Clear existing
        console.log('🧹 Clearing old pricing data...');
        await Pricing.deleteMany({});

        // 2. Insert
        console.log('🌱 Seeding new data...');
        const result = await Pricing.insertMany([...vehicles, ...rideNowVehicles]);
        console.log(`✅ Successfully seeded ${result.length} vehicles!`);

        // 3. Verify
        const count = await Pricing.countDocuments();
        console.log(`📊 Total Documents in Checking: ${count}`);

        await mongoose.disconnect();
        console.log('👋 Done.');
        process.exit(0);

    } catch (e) {
        console.error('❌ Error Seeding:', e);
        process.exit(1);
    }
}

seed();
