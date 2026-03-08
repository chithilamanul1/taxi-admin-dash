const mongoose = require('mongoose');

const MONGO_URI = "mongodb+srv://chithilamanul1_db_user:chithila123@taxiadmindash.l9tttdj.mongodb.net/?appName=taxiadmindash";

async function listSlugs() {
    try {
        await mongoose.connect(MONGO_URI);
        const tours = await mongoose.connection.db.collection('tours').find({}, { projection: { slug: 1, title: 1 } }).toArray();

        console.log('--- All Tours ---');
        tours.forEach(t => {
            console.log(`- ${t.title} (${t.slug})`);
        });
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

listSlugs();
