const mongoose = require('mongoose');
const fs = require('fs');

const MONGODB_URI = 'mongodb://chithila:chithila123@187.77.128.167:27017/admin?authSource=admin';

const pricingSchema = new mongoose.Schema({
    vehicleType: String,
    name: String,
    image: String,
    category: String
});

const Pricing = mongoose.models.Pricing || mongoose.model('Pricing', pricingSchema, 'pricings');

async function check() {
    try {
        await mongoose.connect(MONGODB_URI, { dbName: 'taxiadmindash' });
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name));
        const vehicles = await Pricing.find({});
        console.log('Found', vehicles.length, 'vehicles');
        fs.writeFileSync('db_output.json', JSON.stringify(vehicles, null, 2));
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
}

check();
