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
}, { strict: false });

const Pricing = mongoose.models.Pricing || mongoose.model('Pricing', pricingSchema);

async function checkVehicles() {
    try {
        await dbConnect();
        console.log('Connected to DB');
        const vehicles = await Pricing.find({}).sort({ category: 1, vehicleType: 1 });
        console.log('--- Current Vehicles ---');
        vehicles.forEach(v => {
            console.log(`[${v.category}] ${v.vehicleType} (ID: ${v._id}) - Image: ${v.image}`);
        });
        console.log('------------------------');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

checkVehicles();
