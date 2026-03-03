const mongoose = require('mongoose');
require('dotenv').config();

async function check() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const Pricing = mongoose.connection.collection('pricings');
        const vehicles = await Pricing.find({}).toArray();
        console.log('--- ALL VEHICLES IN DB ---');
        vehicles.forEach(v => {
            console.log(`[${v.category}] ${v.vehicleType}: ${v.name} | Pax: ${v.capacity} | Luggage: ${v.luggage} | Hand: ${v.handLuggage}`);
        });
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}
check();
