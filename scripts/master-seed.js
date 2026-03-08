const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const MONGODB_URI = 'mongodb://chithila:chithila123@187.77.128.167:27017/admin?authSource=admin';

const itinerarySchema = new mongoose.Schema({
    day: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String },
    location: { type: String },
    activities: { type: [String], default: [] },
    overnightStay: { type: String }
}, { _id: false });

const tourSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    duration: {
        days: { type: Number, default: 1 },
        nights: { type: Number, default: 0 }
    },
    description: { type: String, required: true },
    shortDescription: { type: String },
    images: { type: [String], default: [] },
    heroImage: { type: String },
    price: {
        amount: { type: Number, default: 0 },
        currency: { type: String, default: 'USD' },
        type: { type: String, default: 'from' }
    },
    destinations: { type: [String], default: [] },
    inclusions: { type: [String], default: [] },
    exclusions: { type: [String], default: [] },
    itinerary: [itinerarySchema],
    experience: [{
        heading: { type: String },
        text: { type: String }
    }],
    notSuitableFor: { type: [String], default: [] },
    notAllowed: { type: [String], default: [] },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Tour = mongoose.models.Tour || mongoose.model('Tour', tourSchema);

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

async function runSeed() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI, { dbName: 'taxiadmindash' });
        console.log('Connected!');

        const dataPath = path.join(__dirname, 'master-tours-data.json');
        const toursRaw = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

        console.log(`Processing ${toursRaw.length} tours...`);

        for (const item of toursRaw) {
            try {
                // Determine category
                let category = 'day-trip';
                if (item.itinerary && Array.isArray(item.itinerary) && item.itinerary.length > 1) {
                    category = 'tour-package';
                } else if (item.title.toLowerCase().includes('tour package') || item.title.includes('|')) {
                    if (item.title.includes('Days')) category = 'tour-package';
                }

                // Extract duration
                let duration = { days: 1, nights: 0 };
                const dayMatch = item.title.match(/(\d+)\s*Days/i);
                const nightMatch = item.title.match(/(\d+)\s*Nights/i);
                if (dayMatch) duration.days = parseInt(dayMatch[1]);
                if (nightMatch) duration.nights = parseInt(nightMatch[1]);

                // Handle slugs
                let slug = item.slug;
                if (!slug && item.url) {
                    const parts = item.url.split('/');
                    slug = decodeURIComponent(parts[parts.length - 1]);
                }
                if (!slug) {
                    slug = slugify(item.title);
                }

                // Experience mapping (handle string arrays vs object arrays)
                let mappedExperience = [];
                if (item.experience && Array.isArray(item.experience)) {
                    mappedExperience = item.experience.map(ent => {
                        if (typeof ent === 'string') {
                            return { heading: ent, text: '' };
                        }
                        return {
                            heading: ent.heading || ent.title || '',
                            text: ent.text || ent.desc || ''
                        };
                    });
                }

                const tourData = {
                    title: item.title,
                    slug: slug.toLowerCase(),
                    category: category,
                    description: item.description || `Discover the beauty of ${item.title} with our premium tour service.`,
                    duration: duration,
                    inclusions: item.inclusions || item.included || [],
                    exclusions: item.exclusions || item.excluded || [],
                    notSuitableFor: item.notSuitableFor || [],
                    notAllowed: item.notAllowed || [],
                    itinerary: [],
                    experience: mappedExperience,
                    highlights: item.experienceHighlights || [],
                    price: {
                        amount: (item.price && item.price.amount) ? item.price.amount : 0,
                        currency: (item.price && item.price.currency) ? item.price.currency : 'USD',
                        type: 'from'
                    }
                };

                if (item.itinerary && Array.isArray(item.itinerary)) {
                    tourData.itinerary = item.itinerary.map((it, idx) => {
                        let dayNum = idx + 1;
                        if (it.day) {
                            const dayStr = it.day.toString().replace(/\D/g, '');
                            const parsed = parseInt(dayStr);
                            if (!isNaN(parsed)) dayNum = parsed;
                        }
                        return {
                            day: dayNum,
                            title: it.title || 'Day ' + dayNum,
                            description: it.description || it.desc || '',
                            location: it.location || ''
                        };
                    });
                }

                // Fallback highlights
                if (tourData.category === 'tour-package' && (!tourData.highlights || tourData.highlights.length === 0)) {
                    tourData.highlights = tourData.itinerary.slice(0, 5).map(it => it.title);
                }

                console.log(`Upserting: ${tourData.title} (${tourData.slug})`);
                await Tour.findOneAndUpdate(
                    { slug: tourData.slug },
                    { $set: tourData },
                    { upsert: true, new: true, runValidators: true }
                );
            } catch (tourError) {
                console.error(`FAILED to upsert tour: ${item.title}`);
                console.error(`Error: ${tourError.message}`);
                if (tourError.errors) {
                    console.error('Validation Errors:', JSON.stringify(tourError.errors, null, 2));
                }
            }
        }

        console.log('Seeding process finished.');
        process.exit(0);
    } catch (error) {
        console.error('Connection or general error:', error);
        process.exit(1);
    }
}

runSeed();
