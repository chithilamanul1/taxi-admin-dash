const mongoose = require('mongoose');

const URI1 = "mongodb+srv://chithilamanul1_db_user:chithila123@taxiadmindash.l9tttdj.mongodb.net/?appName=taxiadmindash";
const URI2 = "mongodb+srv://ceylonxpert_db_user:gB4Y0VpSWzU6IXRn@cluster0.lankantaxis.mongodb.net/airport_taxi_v2?retryWrites=true&w=majority&appName=Cluster";

async function checkBoth() {
    try {
        console.log("--- Checking Cluster 1 (TaxiaDminDash) ---");
        const conn1 = await mongoose.createConnection(URI1).asPromise();
        const collections1 = await conn1.db.listCollections().toArray();
        console.log("Collections:", collections1.map(c => c.name));
        const count1 = await conn1.db.collection('bookings').countDocuments().catch(() => 0);
        console.log("Bookings Count in Cluster 1 ('test' db?):", count1);
        await conn1.close();

        console.log("\n--- Checking Cluster 2 (LankanTaxis / airport_taxi_v2) ---");
        const conn2 = await mongoose.createConnection(URI2).asPromise();
        const collections2 = await conn2.db.listCollections().toArray();
        console.log("Collections:", collections2.map(c => c.name));
        const count2 = await conn2.db.collection('bookings').countDocuments().catch(() => 0);
        console.log("Bookings Count in Cluster 2:", count2);

        if (count2 > 0) {
            const latest = await conn2.db.collection('bookings').find().sort({ createdAt: -1 }).limit(1).toArray();
            console.log("Latest Booking in Cluster 2:", latest[0]?._id, latest[0]?.customerName);
        }
        await conn2.close();

        process.exit(0);
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
}

checkBoth();
