const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

const PricingSchema = new mongoose.Schema({
    vehicleType: String,
    name: String,
    capacity: Number,
    luggage: Number,
    category: String
}, { strict: false });

const Pricing = mongoose.models.Pricing || mongoose.model('Pricing', PricingSchema);

async function debugVehicles() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const vehicles = await Pricing.find({});
        let output = '--- Current Vehicles ---\n';
        vehicles.forEach(v => {
            output += `Type: ${v.vehicleType?.padEnd(20)} | Name: ${v.name?.padEnd(30)} | Capacity: ${v.capacity} | Category: ${v.category}\n`;
        });

        fs.writeFileSync('vehicles_data.txt', output);
        console.log('Data written to vehicles_data.txt');

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

debugVehicles();
