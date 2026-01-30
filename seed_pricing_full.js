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

        // Drop legacy index if exists
        try {
            await Pricing.collection.dropIndex('vehicleType_1');
            console.log('Dropped legacy index: vehicleType_1');
        } catch (e) {
            console.log('Index vehicleType_1 not found or already dropped (safe to ignore).');
        }

        // 1. Seed Airport Transfer
        const airportCount = await Pricing.countDocuments({ category: 'airport-transfer' });
        console.log(`Existing Airport Transfer entries: ${airportCount}`);

        if (airportCount === 0) {
            console.log('Seeding Airport Transfer...');
            await Pricing.insertMany([
                {
                    vehicleType: 'car',
                    category: 'airport-transfer',
                    name: 'Comfort Car',
                    basePrice: 50, // USD essentially (or LKR base)
                    baseKm: 0,
                    perKmRate: 0.60, // USD/km approx
                    maxPassengers: 3,
                    maxLuggage: 2,
                    image: 'https://i.ibb.co/cyGjk85/sedan.png',
                    isActive: true
                },
                {
                    vehicleType: 'van',
                    category: 'airport-transfer',
                    name: 'Mini Van',
                    basePrice: 60,
                    baseKm: 0,
                    perKmRate: 0.80,
                    maxPassengers: 6,
                    maxLuggage: 4,
                    image: 'https://i.ibb.co/hR0K00y/van.png',
                    isActive: true
                },
                {
                    vehicleType: 'minibus',
                    category: 'airport-transfer',
                    name: 'Mini Bus',
                    basePrice: 100,
                    baseKm: 0,
                    perKmRate: 1.20,
                    maxPassengers: 12,
                    maxLuggage: 10,
                    image: 'https://i.ibb.co/5L00H1K/minibus.png',
                    isActive: true
                }
            ]);
            console.log('Seeded Airport Transfer.');
        } else {
            console.log('Airport Transfer already seeded.');
        }

        // 2. Seed Ride Now - Force Update
        await Pricing.deleteMany({ category: 'ride-now' });
        console.log('Cleared existing Ride Now entries.');

        console.log('Seeding Ride Now...');
        await Pricing.insertMany([
            {
                vehicleType: 'mini-car',
                category: 'ride-now',
                name: 'Mini Car (Ride Now)',
                basePrice: 500, // LKR
                baseKm: 1,
                perKmRate: 150,
                maxPassengers: 2,
                maxLuggage: 1,
                image: '/vehicles/wagon-r.jpeg',
                isActive: true
            },
            {
                vehicleType: 'sedan',
                category: 'ride-now',
                name: 'Sedan (Ride Now)',
                basePrice: 600,
                baseKm: 1,
                perKmRate: 180,
                maxPassengers: 4,
                maxLuggage: 2,
                image: '/vehicles/sedan.png',
                isActive: true
            },
            {
                vehicleType: 'van',
                category: 'ride-now',
                name: 'Mini Van (Ride Now)',
                basePrice: 1000,
                baseKm: 1,
                perKmRate: 250,
                maxPassengers: 7,
                maxLuggage: 4,
                image: '/vehicles/kdh.png',
                isActive: true
            }
        ]);
        console.log('Seeded Ride Now with local images.');

        process.exit(0);
    } catch (e) {
        console.error('Error:', e);
        process.exit(1);
    }
}

seed();
