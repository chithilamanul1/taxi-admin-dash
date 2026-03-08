const mongoose = require('mongoose');

const MONGO_URI = "mongodb+srv://chithilamanul1_db_user:chithila123@taxiadmindash.l9tttdj.mongodb.net/?appName=taxiadmindash";

async function checkSpecificCollections() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const collectionsToCheck = ['pricings', 'locationoffers', 'bookings', 'pricingsettings'];

        for (const colName of collectionsToCheck) {
            const collection = mongoose.connection.db.collection(colName);
            const docs = await collection.find({}).toArray();
            console.log(`Checking ${colName} (${docs.length} docs)...`);

            docs.forEach(doc => {
                const str = JSON.stringify(doc);
                if (str.includes('74.62') || str.toUpperCase().includes('ADULT')) {
                    console.log(`MATCH in ${colName}:`, JSON.stringify(doc, null, 2));
                }
            });
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkSpecificCollections();
