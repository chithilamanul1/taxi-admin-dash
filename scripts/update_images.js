
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Pricing Schema (Simplified for the script)
const tierSchema = new mongoose.Schema({
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    type: { type: String, enum: ['flat', 'per_km'], required: true },
    price: { type: Number, default: 0 },
    rate: { type: Number, default: 0 }
}, { _id: false });

const pricingSchema = new mongoose.Schema({
    vehicleType: { type: String, required: true },
    category: { type: String, required: true, default: 'airport-transfer' },
    name: { type: String, required: true },
    image: { type: String, default: '' },
    capacity: { type: Number, default: 4 },
    luggage: { type: Number, default: 2 },
    handLuggage: { type: Number, default: 2 },
    features: { type: [String], default: [] },
    basePrice: { type: Number, required: true },
    baseKm: { type: Number, default: 20 },
    perKmRate: { type: Number, required: true },
    hourlyRate: { type: Number, default: 0 },
    waitingCharges: { type: [Number], default: [] },
    tiers: [tierSchema],
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 99 }
}, { timestamps: true });

const Pricing = mongoose.models.Pricing || mongoose.model('Pricing', pricingSchema);

async function updateImages() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in .env');
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // 1. Update Mini Van (Every) -> every.jpg
        const updateEvery = await Pricing.updateMany(
            { vehicleType: 'mini-van-every' },
            { $set: { image: '/vehicles/every.jpg', name: 'Mini Van (Every)' } }
        );
        console.log('Updated Mini Van (Every):', updateEvery.modifiedCount);

        // 2. Update Mini Bus (Actual Bus) -> bus.jpg
        // Note: DB type is 'bus' (not 'mini-bus')
        const updateMiniBus = await Pricing.updateMany(
            { vehicleType: 'bus' },
            { $set: { image: '/vehicles/bus.jpg', name: 'Mini Bus (26 Seater)' } }
        );
        console.log('Updated Mini Bus:', updateMiniBus.modifiedCount);

        // 3. Update KDH High Roof (kdh-van) -> minibus.jpg
        const updateKDH = await Pricing.updateMany(
            { vehicleType: 'kdh-van' },
            { $set: { image: '/vehicles/minibus.jpg', name: 'KDH High Roof Van' } }
        );
        console.log('Updated KDH High Roof:', updateKDH.modifiedCount);

        // 4. Create/Update Normal KDH -> kdh.jpg
        const normalKDH = await Pricing.findOne({ vehicleType: 'normal-kdh', category: 'airport-transfer' });
        if (!normalKDH) {
            const newKDH = await Pricing.create({
                vehicleType: 'normal-kdh',
                category: 'airport-transfer',
                name: 'Normal KDH Van',
                image: '/vehicles/kdh.jpg',
                capacity: 9,
                luggage: 6,
                basePrice: 6000,
                baseKm: 20,
                perKmRate: 150,
                sortOrder: 5,
                features: ['A/C', 'Spacious', 'Comfortable']
            });
            console.log('Created Normal KDH Van:', newKDH._id);
        } else {
            const updateNormal = await Pricing.updateOne(
                { _id: normalKDH._id },
                { $set: { image: '/vehicles/kdh.jpg', name: 'Normal KDH Van' } }
            );
            console.log('Updated Normal KDH Van:', updateNormal.modifiedCount);
        }

    } catch (error) {
        console.error('Migration Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected');
    }
}

updateImages();
