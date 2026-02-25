import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load env
const envLocalPath = path.join(process.cwd(), '.env.local');
const envPath = path.join(process.cwd(), '.env');

if (fs.existsSync(envLocalPath)) {
    dotenv.config({ path: envLocalPath });
} else if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.error('Missing MONGODB_URI');
    process.exit(1);
}

// Simple slugify function for the script (since we can't easily import the ESM one in a script without setup)
function slugify(text) {
    if (!text) return '';
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .slice(0, 100);
}

const destinationSchema = new mongoose.Schema({
    name: String,
    slug: String,
}, { strict: false });

const Destination = mongoose.models.Destination || mongoose.model('Destination', destinationSchema);

const runMigration = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const destinations = await Destination.find({
            $or: [
                { slug: null },
                { slug: { $exists: false } },
                { slug: '' }
            ]
        });

        console.log(`Found ${destinations.length} destinations with missing slugs.`);

        for (const dest of destinations) {
            const name = dest.name || dest.title; // Fallback to title if name is missing
            if (name) {
                const newSlug = slugify(name);
                dest.slug = newSlug;
                await dest.save();
                console.log(`Updated slug for: ${name} -> ${newSlug}`);
            } else {
                console.warn(`Destination ${dest._id} has no name or title. Skipping.`);
            }
        }

        console.log('Migration completed.');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
};

runMigration();
