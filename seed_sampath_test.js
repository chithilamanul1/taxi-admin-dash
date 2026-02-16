const mongoose = require('mongoose');
require('dotenv').config();

const pricingSchema = new mongoose.Schema({
    vehicleType: String,
    category: String,
    name: String,
    capacity: Number,
    luggage: Number,
    basePrice: Number,
    baseKm: Number,
    perKmRate: Number,
    isActive: Boolean
});

const Pricing = mongoose.models.Pricing || mongoose.model('Pricing', pricingSchema);

async function seedTestProduct() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        // Create a dedicated "Test" vehicle in the "Airport Transfer" category
        // But with a very low fixed price for distance testing
        await Pricing.findOneAndUpdate(
            { vehicleType: 'sampath-test', category: 'airport-transfer' },
            {
                vehicleType: 'sampath-test',
                category: 'airport-transfer',
                name: 'Sampath Bank Test Vehicle',
                capacity: 10,
                luggage: 10,
                basePrice: 320, // 1 USD approx (LKR 320)
                baseKm: 1000,   // High base KM to keep it flat
                perKmRate: 0,
                isActive: true
            },
            { upsert: true, new: true }
        );

        console.log("Fixed-price test vehicle seeded successfully");
        process.exit(0);
    } catch (err) {
        console.error("Seeding failed:", err);
        process.exit(1);
    }
}

seedTestProduct();
