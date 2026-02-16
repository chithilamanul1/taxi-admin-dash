const mongoose = require('mongoose');

async function checkCluster2() {
    const URI = "mongodb+srv://ceylonxpert_db_user:gB4Y0VpSWzU6IXRn@cluster0.lankantaxis.mongodb.net/airport_taxi_v2?retryWrites=true&w=majority&appName=Cluster";
    try {
        console.log("Connecting to Cluster 2...");
        await mongoose.connect(URI);
        console.log("Connected to Cluster 2 (airport_taxi_v2).");

        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("Collections:", collections.map(c => c.name));

        const Booking = mongoose.connection.db.collection('bookings');
        const count = await Booking.countDocuments();
        console.log("Total Bookings in Cluster 2:", count);

        if (count > 0) {
            const latest = await Booking.find().sort({ createdAt: -1 }).limit(5).toArray();
            console.log("Recent Bookings in Cluster 2:");
            latest.forEach(b => console.log(`- ${b._id} | ${b.customerName} | ${b.createdAt}`));
        }

        process.exit(0);
    } catch (err) {
        console.error("Cluster 2 Error:", err);
        process.exit(1);
    }
}

checkCluster2();
