
require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');

const pricingSchema = new mongoose.Schema({
    vehicleType: String
}, { strict: false });

const Pricing = mongoose.models.Pricing || mongoose.model('Pricing', pricingSchema);

async function cleanup() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const res = await Pricing.deleteMany({});
        console.log(`Deleted ${res.deletedCount} pricing entries.`);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

cleanup();
