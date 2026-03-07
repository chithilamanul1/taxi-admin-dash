const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb+srv://chithilamanul1_db_user:chithila123@taxiadmindash.l9tttdj.mongodb.net/?appName=taxiadmindash';

const tourSchema = new mongoose.Schema({}, { strict: false });
const Tour = mongoose.models.Tour || mongoose.model('Tour', tourSchema);

// Regex-based extraction logic based on the known CSV structure
function extractSectionList(text, startKeyword, endKeywords) {
    if (!text) return [];
    const startIndex = text.indexOf(startKeyword);
    if (startIndex === -1) return [];

    let rawSection = text.substring(startIndex + startKeyword.length);
    let endIndex = rawSection.length;

    for (const kw of endKeywords) {
        const idx = rawSection.indexOf(kw);
        if (idx !== -1 && idx < endIndex) {
            endIndex = idx;
        }
    }

    rawSection = rawSection.substring(0, endIndex).trim();

    // Split by Capital letters preceded by lowercase letters (CamelCase split) or newlines
    // Better: Since the CSV concatenates them like "Hotel pickupTransport by Private Jeep", 
    // we split by looking for a lowercase letter followed by an Uppercase letter
    let items = rawSection.split(/(?<=[a-z\)])(?=[A-Z])/).map(i => i.trim()).filter(Boolean);

    // Clean up random characters or prices
    items = items.filter(i => i.length > 3 && !/^\d+$/.test(i) && !i.includes('$'));

    return items;
}

async function fixDayTrips() {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to DB');

    const csvPath = path.join(process.cwd(), 'public/daytrips.csv');
    const rawContent = fs.readFileSync(csvPath, 'utf8');

    // Simple row splitting (not perfect CSV parsing but good enough to find titles and sections)
    const rows = rawContent.split('\n');
    let fixedCount = 0;

    for (let i = 1; i < rows.length; i++) {
        const rowText = rows[i];
        if (!rowText.trim()) continue;

        // Extract title (usually the first main string in quotes or separated)
        // We'll just fetch all day trips from DB and see if their title exists in this row
        const dayTrips = await Tour.find({ category: 'day-trip' }).lean();

        for (const trip of dayTrips) {
            if (rowText.includes(trip.title) || rowText.replace(/"/g, '').includes(trip.title)) {
                // Found the row for this trip!

                const inclusions = extractSectionList(rowText, 'Include', ['Exclude', 'Not Suitable For', 'Not Allowed']);
                const exclusions = extractSectionList(rowText, 'Exclude', ['Not Suitable For', 'Not Allowed']);

                // For not suitable for, it has a weird prefix "Not Suitable For - [ People with ]"
                const notSuitableFor = extractSectionList(rowText, 'Not Suitable For - [ People with ]', ['Not Allowed', 'Include', 'Exclude']);
                const notAllowed = extractSectionList(rowText, 'Not Allowed', ['Below are the locations', 'Include', 'Exclude']);

                const updateOps = {};
                if (inclusions.length > 0) updateOps.inclusions = inclusions;
                if (exclusions.length > 0) updateOps.exclusions = exclusions;
                if (notSuitableFor.length > 0) updateOps.notSuitableFor = notSuitableFor;
                if (notAllowed.length > 0) updateOps.notAllowed = notAllowed;

                if (Object.keys(updateOps).length > 0) {
                    await Tour.updateOne({ _id: trip._id }, { $set: updateOps });
                    console.log(`Updated ${trip.title}: +${inclusions.length} inc, +${exclusions.length} exc`);
                    fixedCount++;
                }
                break; // Move to next row
            }
        }
    }

    console.log(`Fixed ${fixedCount} day trips with extracted lists.`);
    await mongoose.connection.close();
}

fixDayTrips();
