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

const tourSchema = new mongoose.Schema({
    title: String,
    slug: { type: String, unique: true },
    category: String,
    images: [String],
    heroImage: String,
}, { strict: false });

const Tour = mongoose.models.Tour || mongoose.model('Tour', tourSchema);

const imageMap = {
    'Sigiriya and Dambulla Highlights': 'https://images.unsplash.com/photo-1588614959060-4d144f28b2ea?auto=format&fit=crop&q=80&w=1200',
    'Kandy Cultural Immersion': 'https://images.unsplash.com/photo-1625736300986-a5b6ce19226d?auto=format&fit=crop&q=80&w=1200',
    'Galle Fort & Southern Coast (Whale Watching)': 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=1200',
    'Minneriya / Kaudulla Wildlife Safari': 'https://images.unsplash.com/photo-1586861635167-e52a3a1e262c?auto=format&fit=crop&q=80&w=1200',
    '7 Days Classic Sri Lanka': 'https://images.unsplash.com/photo-1550977186-b4fb553a06ad?auto=format&fit=crop&q=80&w=1200'
};

const runFix = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const tours = await Tour.find({});
        console.log(`Found ${tours.length} tours.`);

        for (const tour of tours) {
            let updated = false;

            // 1. Swap categories
            if (tour.category === 'day-trip') {
                tour.category = 'tour-package';
                updated = true;
                console.log(`Swapped ${tour.title} category to tour-package`);
            } else if (tour.category === 'tour-package') {
                tour.category = 'day-trip';
                updated = true;
                console.log(`Swapped ${tour.title} category to day-trip`);
            }

            // 2. Set beautiful Unsplash Images
            if (imageMap[tour.title]) {
                const imgUrl = imageMap[tour.title];
                tour.heroImage = imgUrl;

                // Only set images array if it's currently empty or contains placeholders
                if (!tour.images || tour.images.length === 0 || !tour.images[0].includes('unsplash')) {
                    tour.images = [
                        imgUrl,
                        'https://images.unsplash.com/photo-1536697246787-1f276329e469?auto=format&fit=crop&q=80&w=1200',
                        'https://images.unsplash.com/photo-1586943101559-4dccc1ac2265?auto=format&fit=crop&q=80&w=1200'
                    ];
                }
                updated = true;
            } else {
                // If it's a random tour not in our seed list, add a generic Sri Lanka image
                if (!tour.heroImage || !tour.heroImage.includes('unsplash')) {
                    tour.heroImage = 'https://images.unsplash.com/photo-1550977186-b4fb553a06ad?auto=format&fit=crop&q=80&w=1200';
                    tour.images = [tour.heroImage];
                    updated = true;
                }
            }

            if (updated) {
                await tour.save();
                console.log(`Updated ${tour.title}`);
            }
        }

        console.log('Done.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

runFix();
