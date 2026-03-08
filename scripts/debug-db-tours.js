const mongoose = require('mongoose');

const MONGO_URI = "mongodb+srv://chithilamanul1_db_user:chithila123@taxiadmindash.l9tttdj.mongodb.net/?appName=taxiadmindash";

async function checkDatabase() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name));

        const tours = await mongoose.connection.db.collection('tours').find({}).toArray();
        console.log(`Total tours found: ${tours.length}`);

        // Count by category
        const categories = {};
        tours.forEach(t => {
            categories[t.category] = (categories[t.category] || 0) + 1;
        });
        console.log('Categories:', categories);

        // List titles and slugs to see if there are duplicates or old ones
        console.log('--- Tour List ---');
        tours.forEach(t => {
            console.log(`[${t.category}] ${t.title} (${t.slug})`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkDatabase();
