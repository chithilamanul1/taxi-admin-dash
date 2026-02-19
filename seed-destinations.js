import { destinations } from './src/lib/destinations.js';
import dbConnect from './src/lib/db.js';
import Destination from './src/models/Destination.js';

async function seedDestinations() {
    try {
        await dbConnect();
        console.log('Connected to DB');

        for (const dest of destinations) {
            const existing = await Destination.findOne({ id: dest.id });
            if (!existing) {
                const slug = dest.id || dest.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                await Destination.create({ ...dest, slug });
                console.log(`Created: ${dest.title}`);
            } else {
                console.log(`Skipped: ${dest.title} (already exists)`);
            }
        }

        console.log('Seeding completed!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seedDestinations();
