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
    perKmRate: Number,
    basePrice: Number,
    baseKm: Number
});

const Pricing = mongoose.models.Pricing || mongoose.model('Pricing', PricingSchema);

async function run() {
    await mongoose.connect(MONGODB_URI);
    const v = await Pricing.findOne({ vehicleType: 'mini-car', category: 'ride-now' });
    if (v) {
        console.log(`Vehicle: ${v.vehicleType}`);
        console.log(`Per KM Rate: ${v.perKmRate}`);
        console.log(`Base Price: ${v.basePrice} for ${v.baseKm} KM`);
        console.log('Tiers:');
        v.tiers.forEach(t => console.log(`  ${t.min}-${t.max} | ${t.type} | ${t.rate || t.price}`));
    } else {
        console.log('Not found');
    }
    await mongoose.disconnect();
    process.exit(0);
}

run();
