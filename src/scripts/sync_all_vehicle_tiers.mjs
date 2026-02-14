import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '../../');

['.env.local', '.env'].forEach(f => {
    const p = path.join(rootDir, f);
    if (fs.existsSync(p)) dotenv.config({ path: p });
});

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

const tierSchema = new mongoose.Schema({
    min: Number,
    max: Number,
    type: String,
    price: Number,
    rate: Number
});

const PricingSchema = new mongoose.Schema({
    vehicleType: String,
    category: String,
    perKmRate: Number,
    tiers: [tierSchema]
});

const Pricing = mongoose.models.Pricing || mongoose.model('Pricing', PricingSchema);

const TIER_TEMPLATES = {
    'mini-car': [
        { min: 0, max: 20, type: 'flat', price: 3500 },
        { min: 21, max: 40, type: 'flat', price: 4000 },
        { min: 41, max: 130, type: 'per_km', rate: 100 },
        { min: 131, max: 9999, type: 'per_km', rate: 102 }
    ],
    'sedan': [
        { min: 0, max: 20, type: 'flat', price: 4500 },
        { min: 21, max: 40, type: 'flat', price: 6000 },
        { min: 41, max: 50, type: 'per_km', rate: 150 },
        { min: 51, max: 100, type: 'per_km', rate: 130 },
        { min: 101, max: 140, type: 'per_km', rate: 130 },
        { min: 141, max: 200, type: 'per_km', rate: 127 },
        { min: 201, max: 9999, type: 'per_km', rate: 122 }
    ],
    'kdh-van': [
        { min: 0, max: 20, type: 'flat', price: 6000 },
        { min: 21, max: 40, type: 'flat', price: 8500 },
        { min: 41, max: 100, type: 'per_km', rate: 200 },
        { min: 101, max: 140, type: 'per_km', rate: 180 },
        { min: 141, max: 200, type: 'per_km', rate: 145 },
        { min: 201, max: 9999, type: 'per_km', rate: 135 }
    ]
};

async function run() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to DB');

        const categories = ['airport-transfer', 'ride-now'];

        for (const cat of categories) {
            for (const [vehicle, tiers] of Object.entries(TIER_TEMPLATES)) {
                const res = await Pricing.findOneAndUpdate(
                    { vehicleType: vehicle, category: cat },
                    { $set: { tiers: tiers, perKmRate: tiers[tiers.length - 1].rate } },
                    { new: true }
                );
                if (res) {
                    console.log(`Updated ${vehicle} in ${cat}`);
                }
            }
        }
        console.log('Sync complete.');
    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

run();
