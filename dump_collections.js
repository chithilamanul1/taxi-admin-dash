const mongoose = require('mongoose');
require('dotenv').config();

async function dumpCollections() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB.");

        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        console.log(`Found ${collections.length} collections.`);

        for (const colInfo of collections) {
            const col = db.collection(colInfo.name);
            const count = await col.countDocuments();
            const first = await col.findOne();
            console.log(`\n--- COLLECTION: ${colInfo.name} (${count} docs) ---`);
            if (first) {
                console.log(JSON.stringify(first, null, 2).slice(0, 500) + (JSON.stringify(first).length > 500 ? "..." : ""));
            } else {
                console.log("Empty collection.");
            }
        }

        process.exit(0);
    } catch (err) {
        console.error("DUMP ERROR:", err);
        process.exit(1);
    }
}

dumpCollections();
