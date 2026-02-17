const mongoose = require('mongoose');

async function dumpUsers() {
    const URI = "mongodb+srv://chithilamanul1_db_user:chithila123@taxiadmindash.l9tttdj.mongodb.net/?appName=taxiadmindash";
    try {
        const conn = await mongoose.createConnection(URI).asPromise();
        const admin = conn.db.admin();
        const dbs = await admin.listDatabases();

        for (const dbInfo of dbs.databases) {
            const db = conn.useDb(dbInfo.name);
            const collections = await db.db.listCollections().toArray();
            if (collections.map(c => c.name).includes('users')) {
                console.log(`\nDB: ${dbInfo.name} | Collection: users`);
                const users = await db.db.collection('users').find().toArray();
                users.forEach(u => {
                    console.log(`- Email: ${u.email} | Role: ${u.role} | isAdmin: ${u.isAdmin}`);
                });
            }
        }
        await conn.close();
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

dumpUsers();
