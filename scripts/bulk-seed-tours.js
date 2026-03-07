const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// --- DATABASE CONNECTION ---
const MONGODB_URI = "mongodb+srv://chithilamanul1_db_user:chithila123@taxiadmindash.l9tttdj.mongodb.net/?appName=taxiadmindash";

const tourSchema = new mongoose.Schema({
    title: String,
    slug: { type: String, unique: true },
    category: String,
    duration: { days: Number, nights: Number },
    description: String,
    heroImage: String,
    price: { amount: Number, currency: String, type: String },
    destinations: [String],
    inclusions: [String],
    exclusions: [String],
    experience: [{ heading: String, text: String }],
    notSuitableFor: [String],
    notAllowed: [String],
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Tour = mongoose.models.Tour || mongoose.model('Tour', tourSchema);

// Basic CSV row parser that handles quoted multiline values
function parseCSV(content) {
    const rows = [];
    let currentRow = [];
    let currentField = '';
    let inQuotes = false;

    for (let i = 0; i < content.length; i++) {
        const char = content[i];
        const nextChar = content[i + 1];

        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                currentField += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            currentRow.push(currentField);
            currentField = '';
        } else if (char === '\n' && !inQuotes) {
            currentRow.push(currentField);
            rows.push(currentRow);
            currentRow = [];
            currentField = '';
        } else if (char === '\r' && !inQuotes) {
            // Skip carriage return
        } else {
            currentField += char;
        }
    }
    if (currentField || currentRow.length > 0) {
        currentRow.push(currentField);
        rows.push(currentRow);
    }
    return rows;
}

async function runSeeding() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected!');

        const csvPath = path.join(process.cwd(), 'public', 'daytrips.csv');
        const content = fs.readFileSync(csvPath, 'utf8');
        const rows = parseCSV(content);

        const headers = rows[0].map(h => h.trim().replace(/^\ufeff/, ''));
        const getIdx = (name) => headers.indexOf(name);

        console.log(`Parsed ${rows.length - 1} data rows. Starting upsert...`);

        const idx_title = getIdx('product_name');
        const idx_alt_title = getIdx('item_page_title');
        const idx_link = getIdx('item_page_link');
        const idx_desc = getIdx('description');
        const idx_data2 = getIdx('data2');
        const idx_image = getIdx('image');
        const idx_price = getIdx('total_price_for_one_adult');
        const idx_currency = getIdx('Currency');
        const idx_duration = getIdx('duration');

        let updatedCount = 0;

        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            if (!row || row.length < 5) continue;

            const title = (row[idx_title] || row[idx_alt_title] || '').trim();
            if (!title || title.length < 5) continue;

            const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

            // Heuristic for category
            let category = 'day-trip';
            const lowerTitle = title.toLowerCase();
            if (lowerTitle.includes('package') || lowerTitle.includes('days') || lowerTitle.includes('nights')) {
                category = 'tour-package';
            }
            if (lowerTitle.includes('safari')) {
                category = 'safari';
            }

            // Experience
            let experience = [];
            const link = row[idx_link] || '';
            if (link.includes('experience=')) {
                try {
                    const jsonPart = link.split('experience=')[1].split('&')[0];
                    const decoded = decodeURIComponent(jsonPart);
                    const parsed = JSON.parse(decoded);
                    if (Array.isArray(parsed)) {
                        experience = parsed.map(e => ({ heading: e.heading, text: e.text }));
                    }
                } catch (e) { }
            }

            // Description & Inclusions
            const fullText = row[idx_data2] || row[idx_desc] || '';
            let description = fullText.split('Include')[0].replace('Description', '').trim();
            if (description.length < 10) description = row[idx_desc] || title;

            const inclusions = [];
            const exclusions = [];

            const inclMatch = fullText.match(/Include([\s\S]*?)Exclude/i);
            if (inclMatch) {
                inclMatch[1].split('\n').map(s => s.trim()).filter(s => s.length > 3).forEach(s => inclusions.push(s));
            }
            const exclMatch = fullText.match(/Exclude([\s\S]*?)Not Suitable/i);
            if (exclMatch) {
                exclMatch[1].split('\n').map(s => s.trim()).filter(s => s.length > 3).forEach(s => exclusions.push(s));
            }

            // Duration
            let days = 1;
            const durRaw = row[idx_duration] || '';
            const dayMatch = durRaw.match(/(\d+)\s*hour/i);
            if (dayMatch && parseInt(dayMatch[1]) > 12) days = 1;
            const multiMatch = title.match(/(\d+)\s*Day/i);
            if (multiMatch) days = parseInt(multiMatch[1]);

            // Price
            const pStr = row[idx_price] || '0';
            const priceVal = parseFloat(pStr.replace(/[^\d.]/g, '')) || 0;

            const tourData = {
                title,
                slug,
                category,
                duration: { days, nights: Math.max(0, days - 1) },
                description,
                heroImage: row[idx_image] || '/tours/sigiriya.jpg',
                'price.amount': priceVal,
                'price.currency': row[idx_currency] || 'USD',
                'price.type': 'per-person',
                experience,
                inclusions,
                exclusions,
                isActive: true
            };

            await Tour.findOneAndUpdate({ slug }, tourData, { upsert: true });
            updatedCount++;
            if (updatedCount % 10 === 0) console.log(`Processed ${updatedCount} tours...`);
        }

        console.log(`Seeding completed! Total updated: ${updatedCount}`);
        process.exit(0);

    } catch (error) {
        console.error('Seeding fatal error:', error);
        process.exit(1);
    }
}

runSeeding();
