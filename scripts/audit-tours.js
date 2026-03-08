const mongoose = require('mongoose');

const MONGO_URI = "mongodb+srv://chithilamanul1_db_user:chithila123@taxiadmindash.l9tttdj.mongodb.net/?appName=taxiadmindash";

async function auditTours() {
    try {
        await mongoose.connect(MONGO_URI);
        const tours = await mongoose.connection.db.collection('tours').find({}).toArray();

        console.log(`--- Total Tours: ${tours.length} ---`);
        let emptyInclusions = 0;
        let emptyExclusions = 0;

        tours.forEach(t => {
            const hasInclusions = (t.inclusions?.length > 0 || t.included?.length > 0 || t.includes?.length > 0);
            const hasExclusions = (t.exclusions?.length > 0 || t.excluded?.length > 0 || t.excludes?.length > 0);

            if (!hasInclusions) {
                console.log(`[!] Missing Inclusions: ${t.title} (${t.slug})`);
                emptyInclusions++;
            }
            if (!hasExclusions) {
                console.log(`[!] Missing Exclusions: ${t.title} (${t.slug})`);
                emptyExclusions++;
            }
        });

        console.log('\n--- AUDIT SUMMARY ---');
        console.log(`Empty Inclusions: ${emptyInclusions}`);
        console.log(`Empty Exclusions: ${emptyExclusions}`);
        console.log(`Full Tours: ${tours.length - Math.max(emptyInclusions, emptyExclusions)}`);

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

auditTours();
