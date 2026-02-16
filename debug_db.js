const mongoose = require('mongoose');
require('dotenv').config();

async function debugDB() {
    try {
        console.log("Connecting to:", process.env.MONGODB_URI.replace(/:([^@]+)@/, ':****@'));
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB.");

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
