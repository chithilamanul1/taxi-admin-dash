
const mongoose = require('mongoose');

// Schema fallback
const TourSchema = new mongoose.Schema({
    title: String,
    description: String,
    inclusions: [String],
    exclusions: [String],
}, { strict: false });

const Tour = mongoose.models.Tour || mongoose.model('Tour', TourSchema);

async function fixTours() {
    const MONGO_URI = "mongodb+srv://chithilamanul1_db_user:chithila123@taxiadmindash.l9tttdj.mongodb.net/taxiadmindash?retryWrites=true&w=majority";

    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const tours = await Tour.find({});
        console.log(`Found ${tours.length} tours`);

        for (const tour of tours) {
            let desc = tour.description || '';
            let changed = false;
            let inclusions = [...(tour.inclusions || [])];
            let exclusions = [...(tour.exclusions || [])];

            if (desc.includes('Include') || desc.includes('Exclude')) {
                console.log(`Processing clumped tour: ${tour.title}`);

                // Parsing logic for "Include[text]Exclude[text]"
                // split by capitalized words after the keyword

                const includeIndex = desc.indexOf('Include');
                const excludeIndex = desc.indexOf('Exclude');

                let cleanDesc = desc;

                if (includeIndex !== -1) {
                    const includePart = desc.slice(includeIndex, excludeIndex !== -1 ? excludeIndex : undefined);
                    // Split by capital letters to try and get separate bullet points
                    const items = includePart.replace('Include', '').split(/(?=[A-Z])/).map(s => s.trim()).filter(s => s.length > 3);
                    if (items.length > 0) {
                        inclusions = [...new Set([...inclusions, ...items])];
                        cleanDesc = cleanDesc.replace(includePart, '');
                        changed = true;
                    }
                }

                if (excludeIndex !== -1) {
                    const excludePart = desc.slice(excludeIndex);
                    const items = excludePart.replace('Exclude', '').split(/(?=[A-Z])/).map(s => s.trim()).filter(s => s.length > 3);
                    if (items.length > 0) {
                        exclusions = [...new Set([...exclusions, ...items])];
                        cleanDesc = cleanDesc.replace(excludePart, '');
                        changed = true;
                    }
                }

                if (changed) {
                    tour.description = cleanDesc.trim();
                    tour.inclusions = inclusions;
                    tour.exclusions = exclusions;
                    await tour.save();
                    console.log(`Updated ${tour.title}`);
                }
            }
        }

        console.log('Done');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

fixTours();
