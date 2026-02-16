const mongoose = require('mongoose');
require('dotenv').config();

async function checkBookings() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        // Try to find the correct collection name
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("Collections in DB:", collections.map(c => c.name));

        const Booking = mongoose.models.Booking || mongoose.model('Booking', new mongoose.Schema({}, { strict: false }), 'bookings');

        const count = await Booking.countDocuments();
        console.log("Total Bookings in 'bookings' collection:", count);

        const recent = await Booking.find().sort({ createdAt: -1 }).limit(10);
        console.log("Recent 10 Bookings:");
        recent.forEach(b => {
            console.log(`- ID: ${b._id}, Customer: ${b.customerName}, Email: ${b.customerEmail}, Status: ${b.status}, Payment: ${b.paymentMethod}, Created: ${b.createdAt}`);
        });

        process.exit(0);
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
}

checkBookings();
