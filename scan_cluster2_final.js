const mongoose = require('mongoose');

async function scan() {
    const URI = "mongodb+srv://ceylonxpert_db_user:gB4Y0VpSWzU6IXRn@cluster0.lankantaxis.mongodb.net/airport_taxi_v2?retryWrites=true&w=majority&appName=Cluster";
    console.log("Connecting to Cluster 2 (LankanTaxis)...");
    try {
        const conn = await mongoose.createConnection(URI, {
            serverSelectionTimeoutMS: 10000,
            connectTimeoutMS: 10000
        }).asPromise();
        console.log("Connected to Cluster 2.");

        const collections = await conn.db.listCollections().toArray();
        console.log("Collections:", collections.map(c => c.name));

        for (const col of collections) {
            const count = await conn.db.collection(col.name).countDocuments();
            console.log(`- ${col.name}: ${count} docs`);
            if (col.name === 'bookings' && count > 0) {
                const sample = await conn.db.collection(col.name).findOne();
                console.log(`  [!] Sample Booking: ${sample._id} | ${sample.customerName}`);
            }
        }
        await conn.close();
        process.exit(0);
    } catch (err) {
        console.error("Cluster 2 Scan Error:", err.message);
        process.exit(1);
    }
}

scan();
