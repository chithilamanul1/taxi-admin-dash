import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../../.env');

dotenv.config({ path: envPath });

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!MONGODB_URI) {
    console.error('❌ No MONGODB_URI found');
    process.exit(1);
}

const PricingSchema = new mongoose.Schema({
    vehicleType: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    basePrice: { type: Number, required: true },
    baseKm: { type: Number, default: 0 },
    perKmRate: { type: Number, required: true },
    capacity: { type: Number, default: 4 },
    luggage: { type: Number, default: 2 },
    handLuggage: { type: Number, default: 2 },
    image: { type: String },
    tiers: [
        {
            min: Number,
            max: Number,
            rate: Number,
            type: { type: String, default: 'per_km' },
            price: Number
        }
    ],
    features: [String]
});

const Pricing = mongoose.models.Pricing || mongoose.model('Pricing', PricingSchema);

const commonFeatures = ['Air Conditioning', 'Bluetooth', 'USB Charging', 'GPS Tracked'];

const vehiclesToUpdate = [
    {
        vehicleType: 'mini-car',
        name: 'Mini Car',
        capacity: 2,
        luggage: 2,
        handLuggage: 2,
        features: ['1-2 Passenger', '2 Luggage', '2 Hand Luggage', 'Air - Conditioning']
    },
    {
        vehicleType: 'sedan',
        name: 'Sedan',
        capacity: 3,
        luggage: 3,
        handLuggage: 3,
        features: ['1-3 Passenger', '3 Luggage', '3 Hand Luggage', 'Air - Conditioning']
    },
    {
        vehicleType: 'suv',
        name: 'SUV',
        capacity: 3,
        luggage: 3,
        handLuggage: 3,
        features: ['1-3 Passenger', '3 Luggage', '3 Hand Luggage', 'Air - Conditioning']
    },
    {
        vehicleType: 'mini-van-every',
        name: 'Mini Van Every',
        capacity: 3,
        luggage: 3,
        handLuggage: 3,
        features: ['1-3 Passenger', '3 Luggage', '3 Hand Luggage', 'Air - Conditioning']
    },
    {
        vehicleType: 'mini-van-4seat',
        name: 'Mini Van (4 Seat)',
        capacity: 4,
        luggage: 4,
        handLuggage: 4,
        features: ['1-4 Passenger', '4 Luggage', '4 Hand Luggage', 'Air - Conditioning']
    },
    {
        vehicleType: 'van-flat-roof',
        name: 'Van (KDH Flat Roof)',
        capacity: 6,
        luggage: 7,
        handLuggage: 7,
        features: ['1-6 Passenger', '7 Luggage', '7 Hand Luggage', 'Air - Conditioning']
    },
    {
        vehicleType: 'mini-bus-kdh',
        name: 'Mini Bus (KDH High Roof)',
        capacity: 8,
        luggage: 8,
        handLuggage: 6,
        features: ['1-8 Passenger', '8 Luggage', '6 Hand Luggage', 'Air - Conditioning']
    },
    {
        vehicleType: 'coaster-bus',
        name: 'Coaster Bus',
        capacity: 25,
        luggage: 25,
        handLuggage: 15,
        features: ['1-25 Passenger', '25 Luggage', 'Air - Conditioning']
    },
    {
        vehicleType: 'couch-bus',
        name: 'Couch Bus',
        capacity: 45,
        luggage: 45,
        handLuggage: 25,
        features: ['1-45 Passenger', '45 Luggage', 'Air - Conditioning']
    }
];

async function migrate() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to DB');

        for (const v of vehiclesToUpdate) {
            console.log(`Processing ${v.name}...`);

            const categories = ['airport-transfer', 'ride-now'];
            for (const cat of categories) {
                const existing = await Pricing.findOne({ vehicleType: v.vehicleType, category: cat });

                const updateData = {
                    name: v.name,
                    capacity: v.capacity,
                    luggage: v.luggage,
                    handLuggage: v.handLuggage,
                    features: v.features || commonFeatures
                };

                if (existing) {
                    await Pricing.updateOne({ _id: existing._id }, { $set: updateData });
                    console.log(`✅ Updated ${v.name} in ${cat}`);
                } else {
                    // Create new with default rates if it doesn't exist
                    const newData = {
                        ...v,
                        category: cat,
                        basePrice: cat === 'airport-transfer' ? 5000 : 2000,
                        perKmRate: cat === 'airport-transfer' ? 120 : 80,
                        tiers: [
                            { min: 0, max: 20, type: 'flat', price: cat === 'airport-transfer' ? 5000 : 2000 },
                            { min: 21, max: 9999, type: 'per_km', rate: cat === 'airport-transfer' ? 120 : 80 }
                        ]
                    };
                    await Pricing.create(newData);
                    console.log(`✅ Created ${v.name} in ${cat}`);
                }
            }
        }

        console.log('Migration complete');
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

migrate();
