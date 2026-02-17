const mongoose = require('mongoose');

const URI1 = "mongodb+srv://chithilamanul1_db_user:chithila123@taxiadmindash.l9tttdj.mongodb.net/?appName=taxiadmindash";
const URI2 = "mongodb+srv://ceylonxpert_db_user:gB4Y0VpSWzU6IXRn@cluster0.lankantaxis.mongodb.net/?retryWrites=true&w=majority&appName=Cluster";

async function scan(name, uri) {
    console.log(`\n=== SCANNING ${name} ===`);
    try {
        const conn = await mongoose.createConnection(uri).asPromise();
        console.log(`Connected to ${name}`);

        const admin = conn.db.admin();
        const dbs = await admin.listDatabases();
        console.log(`Databases in ${name}:`, dbs.databases.map(db => db.name));

        for (const dbInfo of dbs.databases) {
            if (['admin', 'local', 'config'].includes(dbInfo.name)) continue;

            console.log(`  > Scanning DB: ${dbInfo.name}`);
            const db = conn.useDb(dbInfo.name);
            const collections = await db.db.listCollections().toArray();
            console.log(`    Collections in ${dbInfo.name}:`, collections.map(c => c.name));

            for (const colInfo of collections) {
                const count = await db.db.collection(colInfo.name).countDocuments();
                console.log(`      - ${colInfo.name}: ${count} docs`);
                if (colInfo.name.includes('booking') && count > 0) {
                    const sample = await db.db.collection(colInfo.name).findOne();
                    console.log(`        [!] Sample ID from ${colInfo.name}: ${sample._id}`);
                }
            }
        }
        await conn.close();
    } catch (err) {
        console.error(`Error scanning ${name}:`, err.message);
    }
}

async function start() {
    await scan("Cluster 1 (TaxiAdminDash)", URI1);
    await scan("Cluster 2 (LankanTaxis)", URI2);
    process.exit(0);
}

start();
