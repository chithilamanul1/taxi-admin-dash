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
        const commonFeatures = ['Air Conditioning', 'Bluetooth', 'USB Charging'];

        await Pricing.insertMany([
            {
                vehicleType: 'mini-car',
                category: 'ride-now',
                name: 'Mini Car (Budget)',
                basePrice: 500,
                baseKm: 1,
                perKmRate: 150,
                maxPassengers: 2,
                maxLuggage: 2,
                handLuggage: 2,
                features: commonFeatures,
                image: '/vehicles/wagon-r.jpeg',
                isActive: true
            },
            {
                vehicleType: 'sedan',
                category: 'ride-now',
                name: 'Sedan Car',
                basePrice: 600,
                baseKm: 1,
                perKmRate: 180,
                maxPassengers: 3,
                maxLuggage: 3,
                handLuggage: 3,
                features: commonFeatures,
                image: '/vehicles/sedan.png',
                isActive: true
            },
            {
                vehicleType: 'mini-van-every',
                category: 'ride-now',
                name: 'Mini Van (Every)',
                basePrice: 800,
                baseKm: 1,
                perKmRate: 200,
                maxPassengers: 3,
                maxLuggage: 3,
                handLuggage: 3,
                features: commonFeatures,
                image: '/vehicles/every.jpg',
                isActive: true
            },
            {
                vehicleType: 'mini-van-05', // Using as "Mini Van 4 Seat"
                category: 'ride-now',
                name: 'Mini Van (4-5 Seat)',
                basePrice: 900,
                baseKm: 1,
                perKmRate: 220,
                maxPassengers: 4,
                maxLuggage: 4,
                handLuggage: 4,
                features: commonFeatures,
                image: '/vehicles/minivan-4.jpg',
                isActive: false // User didn't strictly ask for this but implied by list order, keeping safer fallback
            },
            {
                vehicleType: 'van', // Mapping standard VAN
                category: 'ride-now',
                name: 'KDH Van',
                basePrice: 1000,
                baseKm: 1,
                perKmRate: 250,
                maxPassengers: 6,
                maxLuggage: 7,
                handLuggage: 7,
                features: commonFeatures,
                image: '/vehicles/kdh.png',
                isActive: true
            },
            {
                vehicleType: 'suv',
                category: 'ride-now',
                name: 'SUV (Luxury)',
                basePrice: 1500,
                baseKm: 1,
                perKmRate: 350,
                maxPassengers: 3,
                maxLuggage: 3,
                handLuggage: 3,
                features: [...commonFeatures, 'Leather Seats'],
                image: '/vehicles/suv.jpg',
                isActive: true
            },
            {
                vehicleType: 'mini-bus',
                category: 'ride-now',
                name: 'Bus',
                basePrice: 2000,
                baseKm: 1,
                perKmRate: 450,
                maxPassengers: 16, // 10-16
                maxLuggage: 20,
                handLuggage: 20,
                features: [...commonFeatures, 'TV', 'Microphone'],
                image: '/vehicles/minibus.jpg',
                isActive: true
            },
            {
                vehicleType: 'coach',
                category: 'ride-now',
                name: 'Coach Bus',
                basePrice: 3000,
                baseKm: 1,
                perKmRate: 600,
                maxPassengers: 45, // 16-45
                maxLuggage: 45,
                handLuggage: 50,
                features: [...commonFeatures, 'TV', 'Microphone', 'Reclining Seats'],
                image: '/vehicles/coach.jpg', // Placeholder, user might need to upload
                isActive: true
            }
        ]);
        console.log('Seeded Ride Now with detailed specs including Coach.');

        process.exit(0);
    } catch (e) {
        console.error('Error:', e);
        process.exit(1);
    }
}

seed();
