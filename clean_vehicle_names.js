const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('MONGODB_URI is not defined in .env');
    process.exit(1);
}

// Minimal Pricing Schema
const PricingSchema = new mongoose.Schema({
    name: String,
    vehicleType: String,
    category: String
});

const Pricing = mongoose.models.Pricing || mongoose.model('Pricing', PricingSchema);

async function cleanVehicleNames() {
    try {
        console.log('1. Step: Connecting to MongoDB (taxiadmindash)...');
        await mongoose.connect(MONGODB_URI, { dbName: 'taxiadmindash' });
        console.log('2. Step: Connected successfully.');

        console.log('3. Step: Finding vehicles...');
        const vehicles = await Pricing.find({});
        console.log(`4. Step: Found ${vehicles.length} vehicle records.`);

        for (const v of vehicles) {
            if (v.name && v.name.includes('(')) {
                const oldName = v.name;
                const newName = v.name.split('(')[0].trim();
                console.log(`5. Step: Updating: "${oldName}" -> "${newName}"`);
                await Pricing.findByIdAndUpdate(v._id, { name: newName });
            }
        }

        console.log('6. Step: Cleanup complete.');

    } catch (error) {
        console.error('7. Step: Cleanup failed:', error);
    } finally {
        console.log('8. Step: Closing connection...');
        await mongoose.connection.close();
        console.log('9. Step: Exiting...');
        process.exit(0);
    }
}

cleanVehicleNames();
