const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Manual Env Load
try {
    const envPath = path.join(__dirname, '.env');
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf8');
        envConfig.split(/\r?\n/).forEach(line => {
            const parts = line.split('=');
            if (parts.length >= 2) {
                const key = parts[0].trim();
                const val = parts.slice(1).join('=').trim().replace(/^["'](.*)["']$/, '$1');
                if (key && val && !key.startsWith('#')) {
                    process.env[key] = val;
                }
            }
        });
    }
} catch (e) { console.error('Env error:', e); }

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('No MONGODB_URI'); process.exit(1); }

const tierSchema = new mongoose.Schema({
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    type: { type: String, enum: ['flat', 'per_km'], required: true },
    price: { type: Number, default: 0 },
    rate: { type: Number, default: 0 }
}, { _id: false });

const pricingSchema = new mongoose.Schema({
    vehicleType: String,
    category: { type: String, default: 'airport-transfer' },
    name: String,
    basePrice: Number,
    baseKm: Number,
    perKmRate: Number,
    image: String,
    isActive: Boolean,
    tiers: [tierSchema]
}, { strict: false });

const Pricing = mongoose.models.Pricing || mongoose.model('Pricing', pricingSchema);

async function seed() {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(MONGODB_URI, { tls: true, tlsAllowInvalidCertificates: true });
        console.log('Connected.');
        console.log('Connected to DB');

        const count = await Pricing.countDocuments({ category: 'airport-transfer' });
        console.log(`Existing Airport Transfer entries: ${count}`);

        if (count === 0) {
            console.log('Seeding Airport Transfers...');
            const vehicles = [
                {
                    vehicleType: 'mini-car',
                    name: 'Mini Car (Suzuki Wagon R)',
                    basePrice: 4500,
                    baseKm: 35,
                    perKmRate: 110,
                    image: '/vehicles/wagon-r.jpeg',
                    tiers: []
                },
                {
                    vehicleType: 'sedan',
                    name: 'Sedan (Toyota Prius/Axio)',
                    basePrice: 5500,
                    baseKm: 35,
                    perKmRate: 140,
                    image: '/vehicles/sedan.jpg',
                    tiers: []
                },
                {
                    vehicleType: 'mini-van-every',
                    name: 'Mini Van (Suzuki Every)',
                    basePrice: 5000,
                    baseKm: 35,
                    perKmRate: 120,
                    image: '/vehicles/every.jpg',
                    tiers: []
                },
                {
                    vehicleType: 'kdh-van',
                    name: 'KDH Van',
                    basePrice: 7500,
                    baseKm: 35,
                    perKmRate: 180,
                    image: '/vehicles/Van.jpg',
                    tiers: []
                }
            ];

            await Pricing.insertMany(vehicles.map(v => ({ ...v, category: 'airport-transfer', isActive: true })));
            console.log('Seeding Done.');
        } else {
            console.log('Already seeded.');
        }
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

seed();
