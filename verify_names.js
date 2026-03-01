const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

const PricingSchema = new mongoose.Schema({
    name: String,
    vehicleType: String,
    category: String
});

const Pricing = mongoose.models.Pricing || mongoose.model('Pricing', PricingSchema);

const fs = require('fs');

async function verifyNames() {
    try {
        console.log('1. Connecting to DB (taxiadmindash)...');
        try {
            await mongoose.connect(MONGODB_URI, { dbName: 'taxiadmindash', serverSelectionTimeoutMS: 5000 });
        } catch (connErr) {
            console.error('CRITICAL CONNECTION ERROR:', connErr.message);
            console.error('FULL ERROR:', connErr);
            process.exit(1);
        }
        console.log('2. Connected.');
        const vehicles = await Pricing.find({});
        console.log(`3. Found ${vehicles.length} vehicles.`);
        let output = '--- VEHICLE NAMES ---\n';
        vehicles.forEach(v => {
            output += `- ${v.name} (${v.vehicleType})\n`;
        });
        output += '----------------------\n';
        console.log('4. Writing to file...');
        fs.writeFileSync('vehicle_names_audit.txt', output);
        console.log('5. Write complete.');
    } catch (error) {
        console.error('Verification failed:', error);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
}

verifyNames();
