const mongoose = require('mongoose');

// Corrected URI from .env
const MONGODB_URI = "mongodb://chithila:chithila123@187.77.128.167:27017/admin?authSource=admin";

const PricingSchema = new mongoose.Schema({
    name: String,
    vehicleType: String,
});

const Pricing = mongoose.models.Pricing || mongoose.model('Pricing', PricingSchema);

async function run() {
    try {
        console.log('START');
        await mongoose.connect(MONGODB_URI, { dbName: 'taxiadmindash' });
        console.log('CONNECTED');
        const docs = await Pricing.find({});
        console.log('DOCS FOUND:', docs.length);
        docs.forEach(d => console.log(`- ${d.name}`));
        await mongoose.connection.close();
        console.log('DONE');
    } catch (e) {
        console.error('FAIL:', e.message);
    }
    process.exit(0);
}

run();
