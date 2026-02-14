import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '../../');

// Try various env files
['.env.local', '.env'].forEach(f => {
    const p = path.join(rootDir, f);
    if (fs.existsSync(p)) {
        dotenv.config({ path: p });
    }
});

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!MONGODB_URI) {
    console.error('MONGODB_URI is missing');
    process.exit(1);
}

const PricingSchema = new mongoose.Schema({
    vehicleType: String,
    category: String,
    basePrice: Number,
    baseKm: Number,
    perKmRate: Number,
    tiers: [{
        min: Number,
        max: Number,
        rate: Number,
        price: Number,
        type: { type: String }
    }]
});

const Pricing = mongoose.models.Pricing || mongoose.model('Pricing', PricingSchema);

async function run() {
    try {
        await mongoose.connect(MONGODB_URI);
        const miniCarPricing = await Pricing.find({ vehicleType: 'mini-car' });
        console.log(JSON.stringify(miniCarPricing, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

run();
