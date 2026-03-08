const mongoose = require('mongoose');

const MONGO_URI = "mongodb+srv://chithilamanul1_db_user:chithila123@taxiadmindash.l9tttdj.mongodb.net/?appName=taxiadmindash";

async function globalSearch() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const collections = await mongoose.connection.db.listCollections().toArray();
        const searchString = "ADULT 1 X";

        for (const colInfo of collections) {
            const collection = mongoose.connection.db.collection(colInfo.name);
            const results = await collection.find({ $text: { $search: searchString } }).toArray().catch(e => {
                // If text index doesn't exist, try regex
                return collection.find({
                    $or: [
                        { title: { $regex: searchString, $options: 'i' } },
                        { description: { $regex: searchString, $options: 'i' } },
                        { inclusions: { $regex: searchString, $options: 'i' } },
                        { included: { $regex: searchString, $options: 'i' } },
                        { includes: { $regex: searchString, $options: 'i' } },
                        { text: { $regex: searchString, $options: 'i' } },
                        { content: { $regex: searchString, $options: 'i' } }
                    ]
                }).toArray();
            });

            if (results.length > 0) {
                console.log(`Found in collection: ${colInfo.name}`);
                results.forEach(r => {
                    console.log(JSON.stringify(r, null, 2));
                });
            }
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

globalSearch();
