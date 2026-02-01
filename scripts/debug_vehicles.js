
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const pricingSchema = new mongoose.Schema({}, { strict: false });
const Pricing = mongoose.models.Pricing || mongoose.model('Pricing', pricingSchema);

async function listVehicles() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const vehicles = await Pricing.find({}, 'vehicleType name image category');
        console.log('--- VEHICLES FOUND ---');
        vehicles.forEach(v => {
            console.log(`Type: '${v.vehicleType}', Name: '${v.name}', Image: '${v.image}'`);
        });

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}
listVehicles();
