
const mongoose = require('mongoose');

// Fallback to local if env is missing
const MONGODB_URI = 'mongodb://chithila:chithila123@187.77.128.167:27017/admin?authSource=admin';

async function checkImages() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected.');

        const pricingSchema = new mongoose.Schema({}, { strict: false });
        const Pricing = mongoose.model('Pricing', pricingSchema, 'pricings');

        const vehicles = await Pricing.find({});
        console.log(`Found ${vehicles.length} vehicles.`);

        vehicles.forEach(v => {
            console.log(`--- Vehicle: ${v.vehicleType} (${v.category}) ---`);
            console.log(`Name:  ${v.name}`);
            console.log(`Image: ${v.image}`);
            if (v.image && v.image.startsWith('http')) {
                console.log('Status: REMOTE URL');
            } else {
                console.log('Status: LOCAL PATH or MISSING');
            }
        });

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

checkImages();
