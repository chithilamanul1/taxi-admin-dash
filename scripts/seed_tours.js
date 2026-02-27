
const fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');

// Manual Env Load from .env
try {
    const envPath = path.join(__dirname, '../.env');
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf8');
        envConfig.split(/\r?\n/).forEach(line => {
            const parts = line.split('=');
            if (parts.length >= 2) {
                const key = parts[0].trim();
                const val = parts.slice(1).join('=').trim().replace(/^["'](.*)["']$/, '$1');
                if (key && val && !key.startsWith('#')) {
                    process.env[key] = val;
                }
            }
        });
    }
} catch (e) {
    console.error('Env load error:', e);
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.error('MONGODB_URI not found');
    process.exit(1);
}

// Model Definition
const tourSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    duration: {
        days: { type: Number, default: 1 },
        nights: { type: Number, default: 0 }
    },
    description: { type: String, required: true },
    images: { type: [String], default: [] },
    heroImage: { type: String },
    price: {
        amount: { type: Number, default: 0 },
        currency: { type: String, default: 'USD' },
        type: { type: String, default: 'from' }
    },
    destinations: { type: [String], default: [] },
    highlights: { type: [String], default: [] },
    inclusions: { type: [String], default: [] },
    exclusions: [String],
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

const Tour = mongoose.models.Tour || mongoose.model('Tour', tourSchema);

const tours = [
    {
        title: 'Galle and Bentota Day-Tour From Colombo',
        slug: 'galle-bentota-day-tour',
        category: 'day-trip',
        duration: { days: 1, nights: 0 },
        price: { amount: 55, currency: 'USD', type: 'from' },
        description: 'Experience the magic of Sri Lanka\'s southern coast. This journey takes you to Madu River safari, Turtle hatchery, and Galle Fort.',
        heroImage: '/tours/bentota.jpg',
        destinations: ['Bentota', 'Madu River', 'Galle'],
        isFeatured: true
    },
    {
        title: 'Kandy & Pinnawala Cultural Day Tour',
        slug: 'kandy-pinnawala-day-trip',
        category: 'day-trip',
        duration: { days: 1, nights: 0 },
        price: { amount: 60, currency: 'USD', type: 'from' },
        description: 'Visit the Pinnawala Elephant Orphanage and the Temple of the Tooth in the hill capital of Kandy.',
        heroImage: '/tours/kandy.jpg',
        destinations: ['Pinnawala', 'Kandy'],
        isFeatured: false
    },
    {
        title: 'Sigiriya Rock & Dambulla Cave Temple Day Trip',
        slug: 'sigiriya-dambulla-day-tour',
        category: 'day-trip',
        duration: { days: 1, nights: 0 },
        price: { amount: 75, currency: 'USD', type: 'from' },
        description: 'Climb the iconic Sigiriya Rock and explore the ancient Dambulla Cave Temples.',
        heroImage: '/tours/sigiriya.jpg',
        destinations: ['Sigiriya', 'Dambulla'],
        isFeatured: true
    },
    {
        title: '6 Days Classic Sri Lanka Tour',
        slug: '6-days-classic-sri-lanka',
        category: 'tour-package',
        duration: { days: 6, nights: 5 },
        price: { amount: 450, currency: 'USD', type: 'from' },
        description: 'A 6-day journey across the cultural triangle, hill country, and southern beaches.',
        heroImage: '/tours/sigiriya2.jpg',
        destinations: ['Sigiriya', 'Kandy', 'Bentota'],
        isFeatured: true
    },
    {
        title: '8 Days Family Adventure',
        slug: '8-days-family-adventure',
        category: 'tour-package',
        duration: { days: 8, nights: 7 },
        price: { amount: 580, currency: 'USD', type: 'from' },
        description: 'Perfect for families, covering wildlife safaris, beach time, and cultural sites.',
        heroImage: '/tours/galle.jpg',
        destinations: ['Colombo', 'Nuwara Eliya', 'Yala', 'Galle'],
        isFeatured: false
    }
];

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        for (const t of tours) {
            await Tour.findOneAndUpdate(
                { slug: t.slug },
                { ...t, images: [t.heroImage] },
                { upsert: true, new: true }
            );
            console.log(`Seeded: ${t.title}`);
        }

        console.log('Seeding complete.');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

seed();
