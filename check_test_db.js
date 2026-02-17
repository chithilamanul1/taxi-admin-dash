const mongoose = require('mongoose');

async function checkTest() {
    const URI = "mongodb+srv://chithilamanul1_db_user:chithila123@taxiadmindash.l9tttdj.mongodb.net/test?appName=taxiadmindash";
    try {
        const conn = await mongoose.createConnection(URI).asPromise();
        console.log("Connected to Cluster 1 'test' DB.");

        const collections = await conn.db.listCollections().toArray();
        console.log("Collections in 'test':", collections.map(c => c.name));

        for (const col of collections) {
            const count = await conn.db.collection(col.name).countDocuments();
            console.log(`- ${col.name}: ${count} docs`);
        }
        await conn.close();
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkTest();
