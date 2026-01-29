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
    console.error('MONGODB_URI not found in .env.local');
    process.exit(1);
}

// Define Schema
const pricingSchema = new mongoose.Schema({
    vehicleType: String,
    category: { type: String, default: 'airport-transfer' },
    name: String,
    basePrice: Number,
    baseKm: Number,
    perKmRate: Number,
    image: String,
    isActive: Boolean
}, { strict: false });

const Pricing = mongoose.models.Pricing || mongoose.model('Pricing', pricingSchema);

async function seed() {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected.');

        const count = await Pricing.countDocuments({ category: 'ride-now' });
        console.log(`Existing Ride Now entries: ${count}`);

        if (count === 0) {
            console.log('Seeding Ride Now...');
            await Pricing.insertMany([
                {
                    vehicleType: 'mini-car',
                    category: 'ride-now',
                    name: 'Mini Car (Ride Now)',
                    basePrice: 500,
                    baseKm: 1,
                    perKmRate: 150,
                    image: '/images/mini-car.png',
                    isActive: true
                },
                {
                    vehicleType: 'sedan',
                    category: 'ride-now',
                    name: 'Sedan (Ride Now)',
                    basePrice: 600,
                    baseKm: 1,
                    perKmRate: 180,
                    image: '/images/sedan.png',
                    isActive: true
                }
            ]);
            console.log('Seeding Complete.');
        } else {
            console.log('Already seeded.');
        }

        process.exit(0);
    } catch (e) {
        console.error('Error:', e);
        process.exit(1);
    }
}

seed();
