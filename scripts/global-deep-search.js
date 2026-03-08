const mongoose = require('mongoose');

const MONGO_URI = "mongodb+srv://chithilamanul1_db_user:chithila123@taxiadmindash.l9tttdj.mongodb.net/?appName=taxiadmindash";

async function globalDeepSearch() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const collections = await mongoose.connection.db.listCollections().toArray();
        const searchTerms = ["ADULT", "74.62", "X $", "1 X"];

        for (const colInfo of collections) {
            const collection = mongoose.connection.db.collection(colInfo.name);
            const docs = await collection.find({}).toArray();

            docs.forEach(doc => {
                const str = JSON.stringify(doc).toUpperCase();
                searchTerms.forEach(term => {
                    if (str.includes(term.toUpperCase())) {
                        console.log(`Match found in collection: ${colInfo.name}, ID: ${doc._id}`);
                        console.log(JSON.stringify(doc, null, 2));
                    }
                });
            });
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

globalDeepSearch();
