const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const dbConnect = async () => {
    if (mongoose.connection.readyState >= 1) return;
    return mongoose.connect(process.env.MONGODB_URI);
};

const pricingSchema = new mongoose.Schema({
    vehicleType: String,
    category: String,
    image: String,
    basePrice: Number,
    baseKm: Number,
    perKmRate: Number,
    luggage: Number,
    persons: Number,
    tiers: Array,
    waitingCharges: Array,
    features: Array
}, { strict: false });

const Pricing = mongoose.models.Pricing || mongoose.model('Pricing', pricingSchema);

async function addCoaster() {
    try {
        await dbConnect();
        console.log('Connected to DB');

        const vehicleType = 'coaster-bus';
        const category = 'airport-transfer';

        const existing = await Pricing.findOne({ vehicleType, category });
        if (existing) {
            console.log('Vehicle already exists:', existing._id);
            return;
        }

        const newVehicle = await Pricing.create({
            vehicleType,
            category,
            image: '/vehicles/bus.jpg', // User requested path, even if missing on disk
            basePrice: 0,
            baseKm: 0,
            perKmRate: 0,
            luggage: 10,
            persons: 20,
            tiers: [],
            waitingCharges: [],
            features: ['AC', 'Spacious']
        });

        console.log('Created Vehicle:', newVehicle);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

addCoaster();
