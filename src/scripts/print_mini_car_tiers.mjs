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

const PricingSchema = new mongoose.Schema({
    vehicleType: String,
    category: String,
    tiers: [{
        min: Number,
        max: Number,
        rate: Number,
        price: Number,
        type: { type: String }
    }],
    perKmRate: Number
});

const Pricing = mongoose.models.Pricing || mongoose.model('Pricing', PricingSchema);

async function run() {
    try {
        await mongoose.connect(MONGODB_URI);
        const vehicles = await Pricing.find({ vehicleType: 'mini-car' });
        vehicles.forEach(v => {
            console.log(`--- ${v.vehicleType} (${v.category}) ---`);
            console.log(`Default Rate: ${v.perKmRate}`);
            v.tiers.forEach(t => {
                console.log(`Tier: ${t.min}-${t.max} | ${t.type} | Rate/Price: ${t.rate || t.price}`);
            });
        });
    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

run();
