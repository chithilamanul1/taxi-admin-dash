
require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');

// Define Schema consistently with src/models/Pricing.js
const pricingSchema = new mongoose.Schema({
    vehicleType: { type: String, required: true },
    category: { type: String, required: true, default: 'airport-transfer' },
    name: { type: String, required: true },
    image: { type: String, default: '' },
    capacity: { type: Number, default: 4 },
    luggage: { type: Number, default: 2 },
    handLuggage: { type: Number, default: 2 },
    basePrice: { type: Number, required: true },
    baseKm: { type: Number, default: 20 },
    perKmRate: { type: Number, required: true },
    hourlyRate: { type: Number, default: 500 },
    waitingCharges: { type: [Number], default: [] },
    tiers: { type: Array, default: [] },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 99 }
}, { timestamps: true });

const Pricing = mongoose.models.Pricing || mongoose.model('Pricing', pricingSchema);

const vehicles = [
    {
        vehicleType: 'vezel',
        category: 'airport-transfer',
        name: 'Honda Vezel / Crossover',
        image: '/vehicles/Hondavezel.png',
        capacity: 4,
        luggage: 3,
        handLuggage: 2,
        basePrice: 2500,
        baseKm: 0,
        perKmRate: 150,
        hourlyRate: 500,
        sortOrder: 2
    },
    {
        vehicleType: 'mini-bus', // Coaster
        category: 'airport-transfer',
        name: 'Mini Bus (26-Seater)',
        image: '/vehicles/costerbus.png',
        capacity: 26,
        luggage: 15,
        handLuggage: 10,
        basePrice: 6000,
        baseKm: 0,
        perKmRate: 300,
        hourlyRate: 1000,
        sortOrder: 10
    },
    {
        vehicleType: 'coach-bus',
        category: 'airport-transfer',
        name: 'Luxury Coach Bus',
        image: '/vehicles/couch bus.png',
        capacity: 45,
        luggage: 40,
        handLuggage: 45,
        basePrice: 9000,
        baseKm: 0,
        perKmRate: 450,
        hourlyRate: 1500,
        sortOrder: 11
    },
    {
        vehicleType: 'mini-car',
        category: 'airport-transfer',
        name: 'Mini Car (Alto/WagonR)',
        image: '/vehicles/minicar.png',
        capacity: 3,
        luggage: 2,
        handLuggage: 1,
        basePrice: 1800,
        baseKm: 0,
        perKmRate: 100,
        hourlyRate: 400,
        sortOrder: 1
    },
    {
        vehicleType: 'sedan',
        category: 'airport-transfer',
        name: 'Sedan (Prius/Axio)',
        image: '/vehicles/sedancar.png',
        capacity: 4,
        luggage: 3,
        handLuggage: 2,
        basePrice: 2000,
        baseKm: 0,
        perKmRate: 120,
        hourlyRate: 500,
        sortOrder: 1.5
    },
    {
        vehicleType: 'kdh-van',
        category: 'airport-transfer',
        name: 'KDH High Roof Van',
        image: '/vehicles/toyota highroof.png',
        capacity: 9,
        luggage: 8,
        handLuggage: 5,
        basePrice: 3500,
        baseKm: 0,
        perKmRate: 180,
        hourlyRate: 700,
        sortOrder: 4
    },
    {
        vehicleType: 'mini-van-every',
        category: 'airport-transfer',
        name: 'Mini Van (Suzuki Every)',
        image: '/vehicles/susukievery.png',
        capacity: 4,
        luggage: 4,
        handLuggage: 2,
        basePrice: 2200,
        baseKm: 0,
        perKmRate: 120,
        hourlyRate: 500,
        sortOrder: 3
    },
    {
        vehicleType: 'mini-van-05',
        category: 'airport-transfer',
        name: 'Mini Van (5 Seater)',
        image: '/vehicles/minivan5seat.png',
        capacity: 5,
        luggage: 4,
        handLuggage: 3,
        basePrice: 2400,
        baseKm: 0,
        perKmRate: 130,
        hourlyRate: 500,
        sortOrder: 3.5
    }
];


async function updateFleet() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        for (const v of vehicles) {
            console.log(`Updating ${v.name}...`);
            await Pricing.findOneAndUpdate(
                { vehicleType: v.vehicleType, category: v.category },
                v,
                { upsert: true, new: true }
            );
        }

        console.log('Fleet updated successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error updating fleet:', error);
        process.exit(1);
    }
}

updateFleet();
