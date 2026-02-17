const mongoose = require('mongoose');
require('dotenv').config();

async function audit() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to taxiadmindash.");

        const Booking = mongoose.models.Booking || mongoose.model('Booking', new mongoose.Schema({}, { strict: false }), 'bookings');

        const all = await Booking.find().sort({ createdAt: -1 });
        console.log(`Found ${all.length} total bookings.`);

        all.forEach(b => {
            console.log(`- ID: ${b._id} | Customer: ${b.customerName} | Email: ${b.customerEmail} | Status: ${b.status} | Created: ${b.createdAt}`);
        });

        process.exit(0);
    } catch (err) {
        console.error("Audit Error:", err);
        process.exit(1);
    }
}

audit();
