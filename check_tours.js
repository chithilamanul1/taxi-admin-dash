import dbConnect from './src/lib/db.js';
import Tour from './src/models/Tour.js';

async function checkTours() {
    try {
        await dbConnect();
        const tours = await Tour.find({});
        console.log(`Found ${tours.length} tours.`);
        tours.forEach(t => console.log(`- ${t.title} (${t.category}) [Active: ${t.isActive}]`));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkTours();
