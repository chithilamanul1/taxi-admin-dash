const mongoose = require('mongoose');

async function scan() {
    const URI = "mongodb+srv://chithilamanul1_db_user:chithila123@taxiadmindash.l9tttdj.mongodb.net/?appName=taxiadmindash";
    try {
        const conn = await mongoose.createConnection(URI).asPromise();
        console.log("Connected to Cluster 1.");

        const admin = conn.db.admin();
        const dbs = await admin.listDatabases();
        console.log("Databases:", dbs.databases.map(d => d.name));

        for (const dbInfo of dbs.databases) {
            const db = conn.useDb(dbInfo.name);
            const collections = await db.db.listCollections().toArray();
            console.log(`\nDB: ${dbInfo.name}`);
            for (const col of collections) {
                const count = await db.db.collection(col.name).countDocuments();
                console.log(`  - ${col.name}: ${count} docs`);
                if (col.name === 'users' || col.name === 'bookings') {
                    const sample = await db.db.collection(col.name).findOne();
                    if (sample) {
                        console.log(`    [!] Sample from ${col.name}: ${sample.email || sample.customerName || sample._id}`);
                    }
                }
            }
        }
        await conn.close();
        process.exit(0);
    } catch (err) {
        console.error("Scan Error:", err.message);
        process.exit(1);
    }
}

scan();
