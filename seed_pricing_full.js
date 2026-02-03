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
        // --- TIER DEFINITIONS (Ride Now) ---
        const miniCarTiers = [
            { min: 0, max: 20, type: 'flat', price: 3500 },
            { min: 21, max: 40, type: 'flat', price: 4000 },
            { min: 41, max: 130, type: 'per_km', rate: 100 },
            { min: 131, max: 9999, type: 'per_km', rate: 102 }
        ];

        const sedanTiers = [
            { min: 0, max: 20, type: 'flat', price: 4500 },
            { min: 21, max: 40, type: 'flat', price: 6000 },
            { min: 41, max: 50, type: 'per_km', rate: 150 },
            { min: 51, max: 100, type: 'per_km', rate: 130 },
            { min: 101, max: 140, type: 'per_km', rate: 130 },
            { min: 141, max: 200, type: 'per_km', rate: 127 },
            { min: 201, max: 9999, type: 'per_km', rate: 122 }
        ];

        const miniVanEveryTiers = [
            { min: 0, max: 20, type: 'flat', price: 4500 },
            { min: 21, max: 40, type: 'flat', price: 6000 },
            { min: 41, max: 50, type: 'per_km', rate: 150 },
            { min: 51, max: 100, type: 'per_km', rate: 130 },
            { min: 101, max: 140, type: 'per_km', rate: 129 },
            { min: 141, max: 200, type: 'per_km', rate: 127 },
            { min: 201, max: 9999, type: 'per_km', rate: 122 }
        ];

        const miniVanSeat05Tiers = [
            { min: 0, max: 20, type: 'flat', price: 6000 },
            { min: 21, max: 40, type: 'flat', price: 8500 },
            { min: 41, max: 100, type: 'per_km', rate: 200 },
            { min: 101, max: 140, type: 'per_km', rate: 176 },
            { min: 141, max: 200, type: 'per_km', rate: 143 },
            { min: 201, max: 9999, type: 'per_km', rate: 132 }
        ];

        const kdhVanTiers = [
            { min: 0, max: 20, type: 'flat', price: 6000 },
            { min: 21, max: 40, type: 'flat', price: 8500 },
            { min: 41, max: 100, type: 'per_km', rate: 200 },
            { min: 101, max: 140, type: 'per_km', rate: 180 },
            { min: 141, max: 200, type: 'per_km', rate: 145 },
            { min: 201, max: 9999, type: 'per_km', rate: 135 }
        ];

        // --- VEHICLE TEMPLATES ---
        const vehicles = {
            miniCar: {
                vehicleType: 'mini-car',
                name: 'Mini Car (Budget)',
                image: '/vehicles/minicar.jpeg', // Updated
                capacity: 3, luggage: 2, handLuggage: 2,
                basePrice: 3500, baseKm: 20, perKmRate: 100,
                features: commonFeatures,
                tiers: []
            },
            sedan: {
                vehicleType: 'sedan',
                name: 'Sedan Car',
                image: '/vehicles/sedan.png',
                capacity: 4, luggage: 3, handLuggage: 3,
                basePrice: 4500, baseKm: 20, perKmRate: 130,
                features: commonFeatures,
                tiers: []
            },
            vezel: {
                vehicleType: 'vezel',
                name: 'Honda Vezel',
                image: '/vehicles/vezel.jpg',
                capacity: 4, luggage: 3, handLuggage: 2,
                basePrice: 5500, baseKm: 20, perKmRate: 130,
                features: [...commonFeatures, 'Hybrid']
            },
            miniVan4: {
                vehicleType: 'mini-van-05',
                name: 'Mini Van (Seat 05)',
                image: '/vehicles/minivan-4.jpg',
                capacity: 5, luggage: 4, handLuggage: 2,
                basePrice: 6000, baseKm: 20, perKmRate: 200,
                features: commonFeatures,
                tiers: []
            },
            miniVanEvery: {
                vehicleType: 'mini-van-every',
                name: 'Mini Van (Every)',
                image: '/vehicles/every.jpg', // Updated
                capacity: 4, luggage: 4, handLuggage: 2,
                basePrice: 4500, baseKm: 20, perKmRate: 150,
                features: commonFeatures,
                tiers: []
            },
            suv: {
                vehicleType: 'suv',
                name: 'SUV (Luxury)',
                image: '/vehicles/suv.jpg',
                capacity: 4, luggage: 4, handLuggage: 3,
                basePrice: 8000, baseKm: 20, perKmRate: 160,
                features: [...commonFeatures, 'Leather Seats']
            },
            kdhVan: {
                vehicleType: 'kdh-van',
                name: 'KDH High Roof Van',
                image: '/vehicles/Van.jpg', // Updated (Normal KDH usually mapped to Van.jpg based on context)
                capacity: 9, luggage: 8, handLuggage: 5,
                basePrice: 8500, baseKm: 40, perKmRate: 180,
                features: commonFeatures,
                tiers: []
            },
            bus: {
                vehicleType: 'bus',
                name: 'Mini Bus (26-Seater)',
                image: '/vehicles/minibus.jpg',
                capacity: 16, luggage: 10, handLuggage: 10,
                basePrice: 15000, baseKm: 40, perKmRate: 250,
                features: [...commonFeatures, 'TV', 'Microphone']
            },
            coach: {
                vehicleType: 'coach-bus',
                name: 'Luxury Coach Bus',
                image: '/vehicles/couch_bus.jpg', // Updated spelling to matched file if needed, but couch_bus.jpg (couch vs coach)
                capacity: 45, luggage: 50, handLuggage: 45,
                basePrice: 25000, baseKm: 40, perKmRate: 450,
                features: [...commonFeatures, 'TV', 'Reclining Seats']
            }
        };

        // --- 1. SEED AIRPORT TRANSFER ---
        // (Keeping default pricing logic for airport for now, unless instructed otherwise. 
        //  The user said 'rates for ride now', so applying explicitly there is safer.)
        await Pricing.deleteMany({ category: 'airport-transfer' });
        console.log('Cleared Airport Transfer.');

        await Pricing.insertMany([
            { ...vehicles.miniCar, category: 'airport-transfer' },
            { ...vehicles.sedan, category: 'airport-transfer' },
            { ...vehicles.vezel, category: 'airport-transfer' },
            { ...vehicles.miniVan4, category: 'airport-transfer' },
            { ...vehicles.miniVanEvery, category: 'airport-transfer', tiers: miniVanEveryTiers }, // Applying generic tiers if useful
            { ...vehicles.suv, category: 'airport-transfer' },
            { ...vehicles.kdhVan, category: 'airport-transfer' },
            { ...vehicles.bus, category: 'airport-transfer' },
            { ...vehicles.coach, category: 'airport-transfer' }
        ]);
        console.log('Seeded Airport Transfer (Full Fleet).');


        // --- 2. SEED RIDE NOW ---
        await Pricing.deleteMany({ category: 'ride-now' });
        console.log('Cleared Ride Now.');

        await Pricing.insertMany([
            { ...vehicles.miniCar, category: 'ride-now', tiers: miniCarTiers },
            { ...vehicles.sedan, category: 'ride-now', tiers: sedanTiers },
            { ...vehicles.vezel, category: 'ride-now' },
            { ...vehicles.miniVan4, category: 'ride-now', tiers: miniVanSeat05Tiers },
            { ...vehicles.miniVanEvery, category: 'ride-now', tiers: miniVanEveryTiers },
            { ...vehicles.suv, category: 'ride-now' },
            { ...vehicles.kdhVan, category: 'ride-now', tiers: kdhVanTiers },
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
