const mongoose = require('mongoose');

async function verify() {
    const URI = "mongodb+srv://chithilamanul1_db_user:chithila123@taxiadmindash.l9tttdj.mongodb.net/taxiadmindash?appName=taxiadmindash";
    try {
        await mongoose.connect(URI);
        console.log("Connected to taxiadmindash DB.");

        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("Collections:", collections.map(c => c.name));

        for (const col of collections) {
            const count = await mongoose.connection.db.collection(col.name).countDocuments();
            console.log(`- ${col.name}: ${count} docs`);
        }

        // Specifically check 'bookings'
        const BookingCol = mongoose.connection.db.collection('bookings');
        const count = await BookingCol.countDocuments();
        if (count > 0) {
            const sample = await BookingCol.findOne();
            console.log("Sample Booking ID:", sample._id);
            console.log("Sample Booking Name:", sample.customerName || sample.customer);
        }

        process.exit(0);
    } catch (err) {
        console.error("Verify Error:", err);
        process.exit(1);
    }
}

verify();
