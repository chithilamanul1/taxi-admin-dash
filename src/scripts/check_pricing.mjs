import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function check() {
    try {
        if (!process.env.MONGODB_URI) {
            console.error('No MONGODB_URI found');
            process.exit(1);
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        // Define rudimentary schema just to read
        const Pricing = mongoose.models.Pricing || mongoose.model('Pricing', new mongoose.Schema({}, { strict: false }));

        const all = await Pricing.find({});
        console.log(`Total Pricing Docs: ${all.length}`);

        const byCat = {};
        all.forEach(p => {
            const cat = p.category || 'unknown';
            byCat[cat] = (byCat[cat] || 0) + 1;
        });
        console.log('By Category:', byCat);

        const airport = all.filter(p => p.category === 'airport-transfer');
        console.log('Airport Transfer Vehicles:', airport.map(p => `${p.vehicleType} (${p.name})`));

        await mongoose.disconnect();
    } catch (e) {
        console.error(e);
    }
}

check();
