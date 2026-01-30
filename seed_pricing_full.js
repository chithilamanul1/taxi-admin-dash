const fs = require('fs');
const mongoose = require('mongoose');

// Manual Env Load
try {
    const envPath = '.env';
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf8');
        envConfig.split(/\r?\n/).forEach(line => {
            const parts = line.split('=');
            if (parts.length >= 2) {
                const key = parts[0].trim();
                const val = parts.slice(1).join('=').trim().replace(/^["'](.*)["']$/, '$1'); // Remove quotes
                if (key && val && !key.startsWith('#')) {
                    process.env[key] = val;
                }
            }
        });
    }
} catch (e) {
    console.error('Env load error:', e);
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.error('MONGODB_URI not found in .env');
    process.exit(1);
}

// Define Schema
const pricingSchema = new mongoose.Schema({
    vehicleType: String,
    category: { type: String, defaults: 'airport-transfer' },
    name: String,
    basePrice: Number,
    baseKm: Number,
    perKmRate: Number,
    image: String,
    isActive: Boolean,
    maxPassengers: Number,
    maxLuggage: Number
}, { strict: false });

const Pricing = mongoose.models.Pricing || mongoose.model('Pricing', pricingSchema);

async function seed() {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected.');

        const commonFeatures = ['Air Conditioning', 'Bluetooth', 'USB Charging'];

        // --- TIER DEFINITIONS ---
        // 'flat': Price is the TOTAL price for that range.
        // 'per_km': Price is Distance * Rate.
        const miniVanEveryAirportTiers = [
            { min: 0, max: 20, type: 'flat', price: 4500 },
            { min: 21, max: 40, type: 'flat', price: 6000 },
            { min: 41, max: 50, type: 'per_km', rate: 150 },
            { min: 51, max: 100, type: 'per_km', rate: 130 },
            { min: 101, max: 140, type: 'per_km', rate: 120 },
            { min: 141, max: 200, type: 'per_km', rate: 115 },
            { min: 201, max: 9999, type: 'per_km', rate: 110 }
        ];

        const miniVanEveryRideTiers = [
            { min: 0, max: 20, type: 'flat', price: 4501 }, // Distinct Rate for Ride Now
            { min: 21, max: 40, type: 'flat', price: 6000 },
            { min: 41, max: 50, type: 'per_km', rate: 150 },
            { min: 51, max: 100, type: 'per_km', rate: 130 },
            { min: 101, max: 140, type: 'per_km', rate: 120 },
            { min: 141, max: 200, type: 'per_km', rate: 115 },
            { min: 201, max: 9999, type: 'per_km', rate: 110 }
        ];

        // --- VEHICLE TEMPLATES ---
        const vehicles = {
            miniCar: {
                vehicleType: 'mini-car',
                name: 'Mini Car (Budget)',
                image: '/vehicles/wagon-r.jpeg', // Assuming local asset or can update if user provides
                capacity: 3, luggage: 2, handLuggage: 2,
                basePrice: 3500, baseKm: 20, perKmRate: 90,
                features: commonFeatures
            },
            sedan: {
                vehicleType: 'sedan',
                name: 'Sedan Car',
                image: '/vehicles/sedan.png',
                capacity: 4, luggage: 3, handLuggage: 3,
                basePrice: 4500, baseKm: 20, perKmRate: 110,
                features: commonFeatures
            },
            miniVanEvery: {
                vehicleType: 'mini-van-every',
                name: 'Mini Van (Every)',
                image: 'https://www.suzukicycles.org/photos/Every/1999_Every/1999_Every-Joypop-Turbo_brochure_450.jpg',
                capacity: 4, luggage: 4, handLuggage: 2,
                basePrice: 4500, baseKm: 20, perKmRate: 150,
                features: commonFeatures,
                tiers: [] // Set dynamically
            },
            kdhVan: {
                vehicleType: 'kdh-van',
                name: 'KDH High Roof Van',
                image: 'https://i.pinimg.com/736x/4f/7e/66/4f7e6653336f101ed31e3687810d12ab.jpg',
                capacity: 9, luggage: 8, handLuggage: 5,
                basePrice: 8500, baseKm: 40, perKmRate: 180,
                features: commonFeatures
            },
            suv: {
                vehicleType: 'suv',
                name: 'SUV (Luxury)',
                image: '/vehicles/suv.jpg',
                capacity: 4, luggage: 4, handLuggage: 3,
                basePrice: 8000, baseKm: 20, perKmRate: 160,
                features: [...commonFeatures, 'Leather Seats']
            },
            bus: {
                vehicleType: 'bus',
                name: 'Mini Bus (26-Seater)',
                image: 'https://i.pinimg.com/originals/cc/9b/87/cc9b87eebb1ad09c91649c8dc24f9164.png',
                capacity: 16, luggage: 10, handLuggage: 10,
                basePrice: 15000, baseKm: 40, perKmRate: 250,
                features: [...commonFeatures, 'TV', 'Microphone']
            },
            coach: {
                vehicleType: 'coach-bus',
                name: 'Luxury Coach Bus',
                image: 'https://img.freepik.com/premium-photo/white-bus-with-black-windows_1019429-43040.jpg?semt=ais_user_personalization&w=740&q=80',
                capacity: 45, luggage: 50, handLuggage: 45,
                basePrice: 25000, baseKm: 40, perKmRate: 450,
                features: [...commonFeatures, 'TV', 'Reclining Seats']
            }
        };

        // --- 1. SEED AIRPORT TRANSFER ---
        await Pricing.deleteMany({ category: 'airport-transfer' });
        console.log('Cleared Airport Transfer.');

        await Pricing.insertMany([
            { ...vehicles.miniCar, category: 'airport-transfer' },
            { ...vehicles.sedan, category: 'airport-transfer' },
            { ...vehicles.miniVanEvery, category: 'airport-transfer', tiers: miniVanEveryAirportTiers },
            { ...vehicles.kdhVan, category: 'airport-transfer' },
            { ...vehicles.suv, category: 'airport-transfer' },
            { ...vehicles.bus, category: 'airport-transfer' },
            { ...vehicles.coach, category: 'airport-transfer' }
        ]);
        console.log('Seeded Airport Transfer (Full Fleet).');


        // --- 2. SEED RIDE NOW ---
        await Pricing.deleteMany({ category: 'ride-now' });
        console.log('Cleared Ride Now.');

        await Pricing.insertMany([
            { ...vehicles.miniCar, category: 'ride-now' },
            { ...vehicles.sedan, category: 'ride-now' },
            { ...vehicles.miniVanEvery, category: 'ride-now', tiers: miniVanEveryRideTiers, basePrice: 4501 }, // Distinct base price just in case
            { ...vehicles.kdhVan, category: 'ride-now' },
            { ...vehicles.suv, category: 'ride-now' },
            { ...vehicles.bus, category: 'ride-now' },
            { ...vehicles.coach, category: 'ride-now' }
        ]);
        console.log('Seeded Ride Now (Full Fleet).');

        process.exit(0);
    } catch (e) {
        console.error('Error:', e);
        process.exit(1);
    }
}

seed();
