
require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');

// Define Schema EXACTLY as in your application
const pricingSchema = new mongoose.Schema({
    type: String, // helper field (optional in main app, but useful here)
    vehicleType: String, // e.g., 'mini-car'
    name: String,
    image: String,
    tiers: Array,
    features: Array,
    capacity: Number,
    luggage: Number,
    basePrice: Number, // Fallback base price
    perKmRate: Number, // Fallback rate
    baseKm: Number
}, { strict: false });

const Pricing = mongoose.models.Pricing || mongoose.model('Pricing', pricingSchema);

const vehicles = [
    { type: 'mini-car', name: 'Mini Car (Alto/WagonR)', image: '/vehicles/minicar.png', tiers: [{ min: 0, max: 999, type: 'per_km', price: 0, rate: 60 }], features: ['Air Conditioned', 'Economic'], capacity: 3, luggage: 2, basePrice: 30, perKmRate: 0.30, baseKm: 0 },
    { type: 'sedan', name: 'Sedan (Prius/Axio)', image: '/vehicles/sedancar.png', tiers: [{ min: 0, max: 999, type: 'per_km', price: 0, rate: 75 }], features: ['Air Conditioned', 'Comfortable'], capacity: 4, luggage: 3, basePrice: 40, perKmRate: 0.40, baseKm: 0 },
    { type: 'vezel', name: 'Honda Vezel / Crossover', image: '/images/fleet/honda-vezel.jpg', tiers: [{ min: 0, max: 999, type: 'per_km', price: 0, rate: 100 }], features: ['Air Conditioned', 'Bluetooth Sound-System', 'USB Charging Port'], capacity: 4, luggage: 2, basePrice: 45, perKmRate: 0.45, baseKm: 0 },
    { type: 'mini-van-05', name: 'Mini Van (5 Seater)', image: '/vehicles/minivan5seat.png', tiers: [{ min: 0, max: 999, type: 'per_km', price: 0, rate: 90 }], features: ['Air Conditioned', 'Bluetooth Sound-System', 'USB Charging Port'], capacity: 5, luggage: 4, basePrice: 50, perKmRate: 0.50, baseKm: 0 },
    { type: 'mini-van-every', name: 'Mini Van (Suzuki Every)', image: '/images/fleet/nissan-van.jpg', tiers: [{ min: 0, max: 999, type: 'per_km', price: 0, rate: 85 }], features: ['Air Conditioned', 'Economic'], capacity: 4, luggage: 2, basePrice: 40, perKmRate: 0.40, baseKm: 0 },
    { type: 'suv', name: 'SUV (7 Seater)', image: '/vehicles/suv.jpg', tiers: [{ min: 0, max: 999, type: 'per_km', price: 0, rate: 110 }], features: ['Air Conditioned', 'Bluetooth Sound-System', 'USB Charging Port', 'Luxury Interior'], capacity: 7, luggage: 4, basePrice: 60, perKmRate: 0.60, baseKm: 0 },
    { type: 'kdh-van', name: 'KDH High Roof Van', image: '/vehicles/toyota highroof.png', tiers: [{ min: 0, max: 999, type: 'per_km', price: 0, rate: 120 }], features: ['Air Conditioned', 'Dual AC', 'Adjustable Seats', 'TV/DVD', 'Bluetooth Sound-System'], capacity: 9, luggage: 7, basePrice: 70, perKmRate: 0.70, baseKm: 0 },
    { type: 'mini-bus', name: 'Mini Bus (26-Seater)', image: '/images/fleet/coaster-bus.jpg', tiers: [{ min: 0, max: 999, type: 'per_km', price: 0, rate: 180 }], features: ['Air Conditioned', 'Mic', 'TV/DVD', 'Adjustable Seats'], capacity: 26, luggage: 15, basePrice: 120, perKmRate: 1.20, baseKm: 0 },
    { type: 'coach-bus', name: 'Luxury Coach Bus', image: '/images/fleet/coach-bus.jpg', tiers: [{ min: 0, max: 999, type: 'per_km', price: 0, rate: 250 }], features: ['Air Conditioned', 'Mic', 'TV/DVD', 'Reclining Seats', 'Under-seat Luggage'], capacity: 45, luggage: 30, basePrice: 200, perKmRate: 2.00, baseKm: 0 }
];

async function updateFleet() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        for (const v of vehicles) {
            console.log(`Updating ${v.name}...`);
            await Pricing.findOneAndUpdate(
                { vehicleType: v.type }, // filter by vehicleType (unique)
                {
                    $set: {
                        name: v.name,
                        image: v.image,
                        tiers: v.tiers,
                        features: v.features,
                        capacity: v.capacity,
                        luggage: v.luggage,
                        basePrice: v.basePrice,
                        perKmRate: v.perKmRate,
                        baseKm: v.baseKm
                    }
                },
                { upsert: true, new: true }
            );
        }

        console.log('Fleet updated successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

updateFleet();
