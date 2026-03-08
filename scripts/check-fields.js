const mongoose = require('mongoose');

const MONGO_URI = "mongodb+srv://chithilamanul1_db_user:chithila123@taxiadmindash.l9tttdj.mongodb.net/?appName=taxiadmindash";

async function checkTourFields() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const Tour = mongoose.connection.db.collection('tours');
        const tours = await Tour.find({}).toArray();

        console.log(`Checking ${tours.length} tours for inclusion/exclusion fields...`);

        tours.forEach(t => {
            const fields = Object.keys(t);
            const inc = fields.filter(f => f.toLowerCase().includes('inc'));
            const exc = fields.filter(f => f.toLowerCase().includes('exc'));
            if (inc.length === 0 && exc.length === 0) {
                // skip
            } else {
                console.log(`Tour: ${t.title} [${t.slug}]`);
                console.log(`  - Inclusion fields: ${inc.join(', ')}`);
                console.log(`  - Exclusion fields: ${exc.join(', ')}`);
                inc.forEach(f => {
                    if (t[f] && t[f].length > 0) {
                        console.log(`    - ${f} count: ${t[f].length}`);
                    } else {
                        console.log(`    - ${f} is EMPTY or NULL`);
                    }
                });
                exc.forEach(f => {
                    if (t[f] && t[f].length > 0) {
                        console.log(`    - ${f} count: ${t[f].length}`);
                    } else {
                        console.log(`    - ${f} is EMPTY or NULL`);
                    }
                });
            }
        });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkTourFields();
