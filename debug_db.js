const mongoose = require('mongoose');
require('dotenv').config();

async function debugDB() {
    try {
        const URI1 = "mongodb+srv://chithilamanul1_db_user:chithila123@taxiadmindash.l9tttdj.mongodb.net/?appName=taxiadmindash";
        console.log("Connecting to Cluster 1...");
        await mongoose.connect(URI1, {
            dbName: 'taxiadmindash'
        });
        console.log("Connected to MongoDB.");
        console.log("Current DB:", mongoose.connection.db.databaseName);

        const dbs = await mongoose.connection.db.admin().listDatabases();
        console.log("Databases:", dbs.databases.map(db => db.name));

        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("Collections in current DB:", collections.map(c => c.name));

        for (const col of collections) {
            const count = await mongoose.connection.db.collection(col.name).countDocuments();
            console.log(`- Collection: ${col.name} | Count: ${count}`);
            if (col.name === 'bookings' && count > 0) {
                const latest = await mongoose.connection.db.collection(col.name).find().sort({ createdAt: -1 }).limit(3).toArray();
                latest.forEach(b => {
                    console.log(`  > Booking ID: ${b._id}, Name: ${b.customerName}, Created: ${b.createdAt}`);
                });
            }
        }

        process.exit(0);
    } catch (err) {
        console.error("DEBUG ERROR:", err);
        process.exit(1);
    }
}

debugDB();
