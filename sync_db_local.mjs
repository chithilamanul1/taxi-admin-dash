import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const pricingSchema = new mongoose.Schema({
    vehicleType: String,
    category: { type: String, default: 'airport-transfer' },
    name: String,
    image: String,
    capacity: Number,
    luggage: Number,
    handLuggage: Number,
    features: Array,
    sortOrder: Number,
    basePrice: Number,
    baseKm: Number,
    perKmRate: Number,
    tiers: Array,
    isActive: { type: Boolean, default: true }
}, { strict: false });

const Pricing = mongoose.models.Pricing || mongoose.model('Pricing', pricingSchema);

const VEHICLE_DEFAULTS = {
    'mini-car': { name: 'Mini Car', image: '/vehicles/minicar.png', capacity: 2, luggage: 2, handLuggage: 2, sortOrder: 1, tiers: [{ min: 0, max: 20, type: 'flat', price: 3500 }, { min: 20, max: 40, type: 'flat', price: 4000 }, { min: 40, max: 130, type: 'per_km', rate: 100 }, { min: 130, max: 9999, type: 'per_km', rate: 102 }] },
    'sedan': { name: 'Sedan', image: '/vehicles/sedancar.png', capacity: 3, luggage: 3, handLuggage: 3, sortOrder: 2, tiers: [{ min: 0, max: 20, type: 'flat', price: 4500 }, { min: 20, max: 40, type: 'flat', price: 6000 }, { min: 40, max: 50, type: 'per_km', rate: 150 }, { min: 50, max: 100, type: 'per_km', rate: 130 }, { min: 100, max: 140, type: 'per_km', rate: 120 }, { min: 140, max: 200, type: 'per_km', rate: 115 }, { min: 200, max: 9999, type: 'per_km', rate: 110 }] },
    'mini-van-every': { name: 'Mini Van (Every)', image: '/vehicles/susukievery.png', capacity: 3, luggage: 3, handLuggage: 3, sortOrder: 3, tiers: [{ min: 0, max: 20, type: 'flat', price: 4500 }, { min: 20, max: 40, type: 'flat', price: 6000 }, { min: 40, max: 50, type: 'per_km', rate: 150 }, { min: 50, max: 100, type: 'per_km', rate: 130 }, { min: 100, max: 140, type: 'per_km', rate: 120 }, { min: 140, max: 200, type: 'per_km', rate: 115 }, { min: 200, max: 9999, type: 'per_km', rate: 110 }] },
    'mini-van-05': { name: 'Mini Van (4 Seat)', image: '/vehicles/minivan5seat.png', capacity: 4, luggage: 4, handLuggage: 4, sortOrder: 4, tiers: [{ min: 0, max: 20, type: 'flat', price: 6000 }, { min: 20, max: 40, type: 'flat', price: 8500 }, { min: 40, max: 100, type: 'per_km', rate: 200 }, { min: 100, max: 140, type: 'per_km', rate: 160 }, { min: 140, max: 200, type: 'per_km', rate: 130 }, { min: 200, max: 9999, type: 'per_km', rate: 120 }] },
    'suv': { name: 'SUV', image: '/vehicles/Hondavezel.png', capacity: 3, luggage: 3, handLuggage: 3, sortOrder: 5, tiers: [{ min: 0, max: 20, type: 'flat', price: 6500 }, { min: 20, max: 40, type: 'flat', price: 9500 }, { min: 40, max: 100, type: 'per_km', rate: 150 }, { min: 100, max: 140, type: 'per_km', rate: 145 }, { min: 140, max: 200, type: 'per_km', rate: 140 }, { min: 200, max: 9999, type: 'per_km', rate: 135 }] },
    'vezel': { name: 'Honda Vezel', image: '/vehicles/Hondavezel.png', capacity: 3, luggage: 3, handLuggage: 3, sortOrder: 6, tiers: [{ min: 0, max: 20, type: 'flat', price: 6500 }, { min: 20, max: 40, type: 'flat', price: 9500 }, { min: 40, max: 100, type: 'per_km', rate: 150 }, { min: 100, max: 140, type: 'per_km', rate: 145 }, { min: 140, max: 200, type: 'per_km', rate: 140 }, { min: 200, max: 9999, type: 'per_km', rate: 135 }] },
    'normal-kdh': { name: 'Van (KDH Flat Roof)', image: '/vehicles/van.png', capacity: 6, luggage: 7, handLuggage: 7, sortOrder: 7, tiers: [{ min: 0, max: 20, type: 'flat', price: 6000 }, { min: 20, max: 40, type: 'flat', price: 8500 }, { min: 40, max: 100, type: 'per_km', rate: 200 }, { min: 100, max: 140, type: 'per_km', rate: 160 }, { min: 140, max: 200, type: 'per_km', rate: 130 }, { min: 200, max: 9999, type: 'per_km', rate: 120 }] },
    'kdh-van': { name: 'Mini Bus (KDH High Roof)', image: '/vehicles/toyota-highroof.png', capacity: 8, luggage: 8, handLuggage: 6, sortOrder: 8, tiers: [{ min: 0, max: 20, type: 'flat', price: 6000 }, { min: 20, max: 40, type: 'flat', price: 8500 }, { min: 40, max: 100, type: 'per_km', rate: 200 }, { min: 100, max: 140, type: 'per_km', rate: 160 }, { min: 140, max: 200, type: 'per_km', rate: 130 }, { min: 200, max: 9999, type: 'per_km', rate: 120 }] },
    'mini-bus': { name: 'Coaster Bus', image: '/vehicles/costerbus.png', capacity: 8, luggage: 8, handLuggage: 6, sortOrder: 9, tiers: [{ min: 0, max: 20, type: 'flat', price: 7500 }, { min: 20, max: 40, type: 'flat', price: 12000 }, { min: 40, max: 100, type: 'per_km', rate: 220 }, { min: 100, max: 140, type: 'per_km', rate: 220 }, { min: 140, max: 200, type: 'per_km', rate: 175 }, { min: 200, max: 9999, type: 'per_km', rate: 155 }] },
    'coach-bus': { name: 'Coach Bus', image: '/vehicles/coach-bus.png', capacity: 40, luggage: 30, handLuggage: 20, sortOrder: 10, tiers: [{ min: 0, max: 20, type: 'flat', price: 15000 }, { min: 20, max: 40, type: 'flat', price: 20000 }, { min: 40, max: 100, type: 'per_km', rate: 300 }, { min: 100, max: 140, type: 'per_km', rate: 300 }, { min: 140, max: 200, type: 'per_km', rate: 250 }, { min: 200, max: 9999, type: 'per_km', rate: 220 }] }
};

async function sync() {
    await mongoose.connect(process.env.MONGODB_URI);

    // Deactivate everything first to clean up orphaned categories
    await Pricing.updateMany({ isActive: true }, { $set: { isActive: false } });

    for (const category of ['airport-transfer', 'ride-now']) {
        for (const [vehicleType, defaults] of Object.entries(VEHICLE_DEFAULTS)) {
            const { tiers, ...metadata } = defaults;
            const firstTier = tiers[0];
            const lastTier = tiers[tiers.length - 1];

            const basePrice = firstTier.type === 'flat' ? firstTier.price : 0;
            const baseKm = firstTier.type === 'flat' ? firstTier.max : 0;
            const perKmRate = lastTier.type === 'per_km' ? lastTier.rate : (lastTier.price / (lastTier.max || 1));

            const existing = await Pricing.findOne({ vehicleType, category });

            if (existing) {
                Object.assign(existing, { ...metadata, tiers, basePrice, baseKm, perKmRate, isActive: true });
                await existing.save();
            } else {
                await Pricing.create({ vehicleType, category, ...metadata, tiers, basePrice, baseKm, perKmRate, isActive: true });
            }
        }
    }

    console.log("DB Sync complete");
    mongoose.disconnect();
}
sync().catch(console.error);
