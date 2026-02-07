
require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');

const pricingSchema = new mongoose.Schema({
    vehicleType: String,
    image: String
}, { strict: false });

const Pricing = mongoose.models.Pricing || mongoose.model('Pricing', pricingSchema);

async function checkFleet() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const fleet = await Pricing.find({});
        console.log(`Found ${fleet.length} vehicles.`);

        fleet.forEach(v => {
            console.log(`Vehicle: ${v.vehicleType} | Image: ${v.image}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkFleet();
