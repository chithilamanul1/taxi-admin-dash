const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const MONGODB_URI = 'mongodb+srv://chithilamanul1_db_user:chithila123@taxiadmindash.l9tttdj.mongodb.net/?appName=taxiadmindash';

const tourSchema = new mongoose.Schema({
    title: String,
    category: String,
    description: String,
    inclusions: [String],
    exclusions: [String],
    experience: [{ heading: String, text: String }],
    notSuitableFor: [String],
    notAllowed: [String],
    price: {
        amount: Number,
        currency: { type: String, default: 'USD' },
        type: { type: String, default: 'from' }
    },
    slug: { type: String, unique: true }
}, { timestamps: true });

const Tour = mongoose.models.Tour || mongoose.model('Tour', tourSchema);

function slugify(text) {
    return text.toString().toLowerCase().trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');
}

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const data = JSON.parse(fs.readFileSync('scripts/parsed-daytrips.json', 'utf8'));
        console.log(`Seeding ${data.length} day trips...`);

        for (const tourData of data) {
            const slug = slugify(tourData.title);
            await Tour.findOneAndUpdate(
                { slug },
                { ...tourData, slug },
                { upsert: true, new: true }
            );
        }

        console.log('Day trips seeding complete!');
    } catch (err) {
        console.error('Seeding error:', err);
    } finally {
        await mongoose.connection.close();
    }
}

seed();
