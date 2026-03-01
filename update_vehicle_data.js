const mongoose = require('mongoose');
require('dotenv').config();

const PricingSchema = new mongoose.Schema({
    vehicleType: String,
    name: String,
    capacity: Number,
    luggage: Number,
    handLuggage: Number,
    category: String,
    image: String
}, { strict: false });

const Pricing = mongoose.models.Pricing || mongoose.model('Pricing', PricingSchema);

const UPDATES = [
    { type: 'mini-car', capacity: 2, luggage: 2, handLuggage: 2, name: 'Mini Car' },
    { type: 'sedan', capacity: 3, luggage: 3, handLuggage: 3, name: 'Sedan Car' },
    { type: 'mini-van-every', capacity: 3, luggage: 3, handLuggage: 3, name: 'Suzuki Every' },
    { type: 'mini-van-05', capacity: 4, luggage: 4, handLuggage: 4, name: 'Mini Van (4 Seat)' },
    { type: 'suv', capacity: 3, luggage: 3, handLuggage: 3, name: 'SUV' },
    { type: 'vezel', capacity: 3, luggage: 3, handLuggage: 3, name: 'Honda Vezel' },
    { type: 'normal-kdh', capacity: 6, luggage: 7, handLuggage: 7, name: 'Van (KDH Flat Roof)' },
    { type: 'kdh-van', capacity: 8, luggage: 8, handLuggage: 6, name: 'Mini Bus (KDH High Roof)' },
    { type: 'mini-bus', capacity: 20, luggage: 20, handLuggage: 15, name: 'Mini Bus (Coster)' },
    { type: 'coach-bus', capacity: 45, luggage: 45, handLuggage: 40, name: 'Luxury Coach Bus' }
];

async function updateVehicles() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        for (const update of UPDATES) {
            console.log(`Updating ${update.type}...`);
            const result = await Pricing.updateMany(
                { vehicleType: update.type },
                {
                    $set: {
                        capacity: update.capacity,
                        luggage: update.luggage,
                        handLuggage: update.handLuggage,
                        name: update.name
                    }
                }
            );
            console.log(`Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);
        }

        console.log('Database update complete.');
        await mongoose.disconnect();
    } catch (err) {
        console.error('Error updating database:', err);
    }
}

updateVehicles();
