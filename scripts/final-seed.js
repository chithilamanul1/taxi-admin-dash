const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const MONGODB_URI = 'mongodb+srv://chithilamanul1_db_user:chithila123@taxiadmindash.l9tttdj.mongodb.net/?appName=taxiadmindash';

const tourSchema = new mongoose.Schema({
    title: String,
    slug: String,
    description: String,
    itinerary: [{
        day: Number,
        title: String,
        description: String
    }],
    experience: [{
        heading: String,
        text: String
    }],
    included: [String],
    excluded: [String],
    notSuitableFor: [String],
    notAllowed: [String],
    category: String,
    duration: String,
    price: Number,
    discountedPrice: Number
}, { strict: false });

const Tour = mongoose.models.Tour || mongoose.model('Tour', tourSchema);

const masterData = JSON.parse(fs.readFileSync(path.join(__dirname, 'master-tours-data.json'), 'utf8'));

async function seed() {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to DB');

    for (const tourData of masterData) {
        try {
            console.log(`Processing: ${tourData.title}`);
            // Try to find by title (case insensitive)
            const existing = await Tour.findOne({ title: new RegExp('^' + tourData.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') });

            const updateData = {
                description: tourData.description || "",
                itinerary: tourData.itinerary || [],
                included: tourData.inclusions || tourData.included || [],
                excluded: tourData.exclusions || tourData.excluded || [],
                notSuitableFor: tourData.notSuitableFor || [],
                notAllowed: tourData.notAllowed || [],
                experience: (tourData.experience || tourData.experiences || []).map(exp => ({
                    heading: exp.heading || exp.title || "Experience",
                    text: exp.description || exp.text || ""
                }))
            };

            if (existing) {
                console.log(`Updating existing tour: ${tourData.title}`);
                await Tour.findByIdAndUpdate(existing._id, updateData);
            } else {
                console.log(`Creating new tour: ${tourData.title}`);
                const slug = tourData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                await Tour.create({
                    ...tourData,
                    slug,
                    ...updateData
                });
            }
        } catch (err) {
            console.error(`Error processing ${tourData.title}:`, err.message);
        }
    }

    console.log('Seeding complete.');
    await mongoose.connection.close();
}

seed().catch(err => {
    console.error(err);
    process.exit(1);
});
