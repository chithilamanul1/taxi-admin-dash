const mongoose = require('mongoose');
require('dotenv').config();

// Replicate the schema briefly or Use strict: false
async function test() {
    try {
        console.log("Connecting using MONGODB_URI...");
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected.");

        const BookingSchema = new mongoose.Schema({
            customerName: String,
            status: String
        }, { timestamps: true });

        const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);

        console.log("Creating test booking...");
        const b = await Booking.create({ customerName: "TEST_RECOVERY", status: "pending" });
        console.log("Created Booking ID:", b._id);

        console.log("Verifying in same connection...");
        const found = await Booking.findById(b._id);
        console.log("Found:", found ? "YES" : "NO");

        const all = await Booking.find();
        console.log("Total Bookings in this collection:", all.length);

        const dbName = mongoose.connection.db.databaseName;
        const colName = Booking.collection.name;
        console.log(`Target DB: ${dbName} | Target Collection: ${colName}`);

        process.exit(0);
    } catch (err) {
        console.error("Test Error:", err);
        process.exit(1);
    }
}

test();
