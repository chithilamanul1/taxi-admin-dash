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
    name: String,
    image: String,
    capacity: Number,
    luggage: Number,
    handLuggage: Number,
    features: [String],
    basePrice: Number,
    baseKm: Number,
    perKmRate: Number,
    tiers: [tierSchema]
});

const Pricing = mongoose.models.Pricing || mongoose.model('Pricing', PricingSchema);

const commonFeatures = ['Air Conditioning', 'Bluetooth', 'USB Charging'];

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

const kdhVanTiers = [
    { min: 0, max: 20, type: 'flat', price: 6000 },
    { min: 21, max: 40, type: 'flat', price: 8500 },
    { min: 41, max: 100, type: 'per_km', rate: 200 },
    { min: 101, max: 140, type: 'per_km', rate: 180 },
    { min: 141, max: 200, type: 'per_km', rate: 145 },
    { min: 201, max: 9999, type: 'per_km', rate: 135 }
];

const vehicles = {
    miniCar: {
        vehicleType: 'mini-car',
        name: 'Mini Car (Budget)',
        image: '/vehicles/minicar.jpeg',
        capacity: 3, luggage: 2, handLuggage: 2,
        basePrice: 3500, baseKm: 20, perKmRate: 100,
        features: commonFeatures
    },
    sedan: {
        vehicleType: 'sedan',
        name: 'Sedan Car',
        image: '/vehicles/sedan.png',
        capacity: 4, luggage: 3, handLuggage: 3,
        basePrice: 4500, baseKm: 20, perKmRate: 130,
        features: commonFeatures
    },
    kdhVan: {
        vehicleType: 'kdh-van',
        name: 'KDH High Roof Van',
        image: '/vehicles/Van.jpg',
        capacity: 9, luggage: 8, handLuggage: 5,
        basePrice: 8500, baseKm: 40, perKmRate: 180,
        features: commonFeatures
    }
};

async function run() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to DB');

        // Update Airport Transfer
        await Pricing.findOneAndUpdate(
            { vehicleType: 'mini-car', category: 'airport-transfer' },
            { $set: { tiers: miniCarTiers } }
        );
        await Pricing.findOneAndUpdate(
            { vehicleType: 'sedan', category: 'airport-transfer' },
            { $set: { tiers: sedanTiers } }
        );
        await Pricing.findOneAndUpdate(
            { vehicleType: 'kdh-van', category: 'airport-transfer' },
            { $set: { tiers: kdhVanTiers } }
        );

        console.log('Applied tiers to airport-transfer');

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

run();
