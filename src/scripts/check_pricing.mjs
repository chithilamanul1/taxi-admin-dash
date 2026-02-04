import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '../../');

const envLocalPath = path.join(rootDir, '.env.local');
const envPath = path.join(rootDir, '.env');

if (fs.existsSync(envLocalPath)) {
    dotenv.config({ path: envLocalPath });
    console.log('Loaded .env.local');
} else if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    console.log('Loaded .env');
} else {
    console.log('No .env file found');
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('MONGODB_URI is missing');
    process.exit(1);
}

const PricingSchema = new mongoose.Schema({
    vehicleType: { type: String, required: true },
    category: { type: String, required: true }, // 'airport-transfer', 'ride-now', 'rental'
    basePrice: { type: Number, required: true },
    baseKm: { type: Number, default: 0 },
    perKmRate: { type: Number, required: true },
    tiers: [{
        min: Number,
        max: Number,
        rate: Number,
        price: Number, // For flat rates
        type: { type: String, enum: ['per-km', 'flat'], default: 'per-km' }
    }],
    waitingCharges: [Number], // Hourly rates: [1st hr, 2nd hr...]
    hourlyRate: Number, // Fallback hourly rate
    // Metadata
    name: String,
    image: String,
    description: String,
    capacity: Number,
    luggage: Number,
    handLuggage: Number,
}, { timestamps: true });

// Prevent overwrite
const Pricing = mongoose.models.Pricing || mongoose.model('Pricing', PricingSchema);

async function check() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to DB');

        const count = await Pricing.countDocuments({});
        console.log(`Total Pricing Documents: ${count}`);

        const vehicles = await Pricing.find({});
        console.log('Vehicles:', vehicles.map(v => `${v.vehicleType} (${v.category})`));

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

check();
