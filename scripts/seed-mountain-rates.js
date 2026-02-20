const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

const destinationSchema = new mongoose.Schema({
    id: { type: String, unique: true, required: true },
    title: { type: String, required: true },
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    price: { type: Number, default: 0 },
    badge: { type: String },
    img: { type: String },
    meta: { type: String },
    description: { type: String },
    distance: { type: String },
    time: { type: String },
    highlights: { type: [String], default: [] },
    pricing: { type: Map, of: Number },
    perKmRateOverride: { type: Number },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 99 }
}, { timestamps: true });

const Destination = mongoose.models.Destination || mongoose.model('Destination', destinationSchema);

const MOUNTAIN_LOCATIONS = [
    {
        id: 'sigiriya',
        name: 'Sigiriya',
        title: 'Airport to Sigiriya / Habarana',
        perKmRateOverride: 110,
        badge: 'Safari & Heritage',
        distance: '150 km',
        time: '4 hours',
        img: 'https://images.unsplash.com/photo-1588598136841-360182c0700e?q=80&w=2070&auto=format&fit=crop'
    },
    {
        id: 'ella',
        name: 'Ella',
        title: 'Airport to Ella / Demodara',
        perKmRateOverride: 125,
        badge: 'Mountain High',
        distance: '210 km',
        time: '5.5 hours',
        img: 'https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=1974&auto=format&fit=crop'
    },
    {
        id: 'kandy',
        name: 'Kandy',
        title: 'Airport to Kandy (Hill Capital)',
        perKmRateOverride: 115,
        badge: 'Cultural Hub',
        distance: '105 km',
        time: '3 hours',
        img: 'https://images.unsplash.com/photo-1544074041-01f669f52033?q=80&w=2070&auto=format&fit=crop'
    },
    {
        id: 'yala',
        name: 'Yala',
        title: 'Airport to Yala / Tissamaharama',
        perKmRateOverride: 130,
        badge: 'Wildlife Safari',
        distance: '235 km',
        time: '5 hours',
        img: 'https://images.unsplash.com/photo-1563811771046-ba984ff30900?q=80&w=2070&auto=format&fit=crop'
    },
    {
        id: 'nuwaraeliya',
        name: 'Nuwara Eliya',
        title: 'Airport to Nuwara Eliya (Little England)',
        perKmRateOverride: 135,
        badge: 'Top Mountain',
        distance: '165 km',
        time: '5 hours',
        img: 'https://images.unsplash.com/photo-1590412200988-a436970781fa?q=80&w=1935&auto=format&fit=crop'
    },
    {
        id: 'udawalawa',
        name: 'Udawalawa',
        title: 'Airport to Udawalawa National Park',
        perKmRateOverride: 120,
        badge: 'Elephant Safari',
        distance: '160 km',
        time: '4 hours',
        img: 'https://images.unsplash.com/photo-1549366021-9f761d450615?q=80&w=1951&auto=format&fit=crop'
    },
    {
        id: 'horton-plains',
        name: 'Horton Plains',
        title: 'Airport to Horton Plains National Park / Ohiya',
        perKmRateOverride: 140,
        badge: 'Mist & Plains',
        distance: '185 km',
        time: '5.5 hours',
        img: 'https://images.unsplash.com/photo-1588168333917-76cd640ae906?q=80&w=2070&auto=format&fit=crop'
    },
    {
        id: 'adams-peak',
        name: 'Adams Peak',
        title: 'Airport to Adams Peak / Nallathanniya',
        perKmRateOverride: 130,
        badge: 'Holy Mountain',
        distance: '145 km',
        time: '4.5 hours',
        img: 'https://images.unsplash.com/photo-1544211158-71e846067b58?q=80&w=2070&auto=format&fit=crop'
    }
];

async function seedMountainRates() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is missing from .env');
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        for (const loc of MOUNTAIN_LOCATIONS) {
            const slug = loc.name.toLowerCase().replace(/\s+/g, '-');
            await Destination.findOneAndUpdate(
                { id: loc.id },
                {
                    ...loc,
                    slug,
                    isActive: true
                },
                { upsert: true, new: true }
            );
            console.log(`Updated/Created: ${loc.name} with rate ${loc.perKmRateOverride}/km`);
        }

        console.log('Mountain and Safari rates seeded successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
}

seedMountainRates();
