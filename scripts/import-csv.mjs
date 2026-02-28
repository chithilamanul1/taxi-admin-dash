import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load env
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error('MONGODB_URI or MONGO_URI is missing. Check .env.local or .env');
    process.exit(1);
}

const itinerarySchema = new mongoose.Schema({
    day: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String },
    activities: { type: [String], default: [] },
    overnightStay: { type: String }
}, { _id: false });

const tourSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    category: {
        type: String,
        enum: ['tour-package', 'day-trip', 'safari', 'city-tour'],
        required: true,
        default: 'tour-package'
    },
    duration: {
        days: { type: Number, required: true, default: 1 },
        nights: { type: Number, required: true, default: 0 }
    },
    description: { type: String, required: true },
    shortDescription: { type: String },
    images: { type: [String], default: [] },
    heroImage: { type: String },
    price: {
        amount: { type: Number, required: true, default: 0 },
        currency: { type: String, default: 'LKR' },
        type: { type: String, enum: ['fixed', 'from', 'per-person'], default: 'from' }
    },
    destinations: { type: [String], default: [] },
    inclusions: { type: [String], default: [] },
    exclusions: { type: [String], default: [] },
    itinerary: [itinerarySchema],
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 }
}, { timestamps: true });

const Tour = mongoose.models.Tour || mongoose.model('Tour', tourSchema);

const slugify = (text) => {
    return text
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-') + '-' + Math.random().toString(36).substring(7);
};

const parseDayTrips = (csvContent) => {
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',');
    const data = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Match columns, handling quotes
        const matches = line.match(/(".*?"|[^,]+)/g);
        if (!matches || matches.length < headers.length) continue;

        const row = {};
        headers.forEach((h, idx) => {
            row[h] = (matches[idx] || '').replace(/^"|"$/g, '');
        });

        if (!row.Trip_Name) continue;

        const priceAmount = parseFloat((row.Discounted_Price || '0').replace(/[^\d.]/g, ''));

        data.push({
            title: row.Trip_Name,
            slug: slugify(row.Trip_Name),
            category: 'day-trip',
            duration: { days: 1, nights: 0 },
            description: row.Day_Trip_Description || row.Description || row.Trip_Name,
            shortDescription: row.Description_Title || '',
            images: [row.image, row.image_1].filter(Boolean),
            heroImage: row.image || '',
            price: {
                amount: priceAmount || 0,
                currency: 'USD',
                type: 'per-person'
            },
            inclusions: row.Price_Breakdown_Details ? [row.Price_Breakdown_Details] : [],
            itinerary: [],
            isActive: true,
            sortOrder: i
        });
    }
    return data;
};

const parseTourPackages = (csvContent) => {
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',');
    const data = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const matches = line.match(/(".*?"|[^,]+)/g);
        if (!matches || matches.length < headers.length) continue;

        const row = {};
        headers.forEach((h, idx) => {
            row[h] = (matches[idx] || '').replace(/^"|"$/g, '');
        });

        if (!row.Tour_Package_Title) continue;

        const durationMatch = row.Tour_Package_Title.match(/(\d+) Days \| (\d+) Nights/);
        const duration = {
            days: durationMatch ? parseInt(durationMatch[1]) : 1,
            nights: durationMatch ? parseInt(durationMatch[2]) : 0
        };

        const priceAmount = parseFloat((row.data2 || '0').replace(/[^\d.]/g, ''));

        data.push({
            title: row.Tour_Package_Title,
            slug: slugify(row.Tour_Package_Title),
            category: 'tour-package',
            duration,
            description: row.Tour_Details || row.Tour_Package_Title,
            images: [row.image, row.image_1].filter(Boolean),
            heroImage: row.image || '',
            price: {
                amount: priceAmount || 0,
                currency: 'USD',
                type: 'from'
            },
            inclusions: row.Included_Items ? row.Included_Items.split('\n').filter(Boolean) : [],
            exclusions: row.Excluded_Items ? row.Excluded_Items.split('\n').filter(Boolean) : [],
            itinerary: [],
            isActive: true,
            sortOrder: i + 100
        });
    }
    return data;
};

async function run() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected!');

        const dayTripsCsv = fs.readFileSync(path.join('public', 'daytrips.csv'), 'utf8');
        const tourPackagesCsv = fs.readFileSync(path.join('public', 'tourpackages.csv'), 'utf8');

        console.log('Parsing Day Trips...');
        const dayTrips = parseDayTrips(dayTripsCsv);
        console.log(`Parsed ${dayTrips.length} Day Trips.`);

        console.log('Parsing Tour Packages...');
        const tourPackages = parseTourPackages(tourPackagesCsv);
        console.log(`Parsed ${tourPackages.length} Tour Packages.`);

        const allTours = [...dayTrips, ...tourPackages];
        console.log(`Total tours to import: ${allTours.length}`);

        if (allTours.length === 0) {
            console.error('No tours found to import. Check CSV parsing.');
            process.exit(1);
        }

        await Tour.deleteMany({});
        console.log('Cleared existing tours.');

        // Insert one by one to catch the exact failing record if needed, 
        // or just use insertMany but with better catch
        try {
            const result = await Tour.insertMany(allTours);
            console.log(`Successfully imported ${result.length} tours.`);
        } catch (insertError) {
            console.error('InsertMany failed. Details:');
            if (insertError.writeErrors) {
                insertError.writeErrors.forEach(err => console.error(` - Write Error: ${err.errmsg}`));
            } else {
                console.error(insertError);
            }
            process.exit(1);
        }

        process.exit(0);
    } catch (error) {
        console.error('Import failed with critical error:', error);
        process.exit(1);
    }
}

run();
