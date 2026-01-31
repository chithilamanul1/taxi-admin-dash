const fs = require('fs');
const mongoose = require('mongoose');

// Manual Env Load
try {
    const envPath = '.env';
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

const tourSchema = new mongoose.Schema({
    title: String,
    slug: String,
    description: String,
    category: String,
    duration: { type: Number, default: 1 },
    price: Number,
    image: String,
    images: [String],
    rating: { type: Number, default: 4.8 },
    highlights: [String],
    itinerary: [Object],
    inclusions: [String],
    exclusions: [String],
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    originalPrice: Number,
    pickupLocations: [String]
}, { timestamps: true, strict: false });

const Tour = mongoose.models.Tour || mongoose.model('Tour', tourSchema);

// Data from src/data/tours-data.js
const dayTrips = [
    {
        title: 'Galle and Bentota Day-Tour From Colombo',
        slug: 'galle-bentota-day-tour',
        category: 'Day Tours',
        duration: 1,
        price: 59,
        originalPrice: null,
        image: 'https://images.unsplash.com/photo-1578586883464-500b5220fa26?q=80&w=800&auto=format&fit=crop', // Galle
        pickupLocations: ['Colombo', 'Negombo', 'Dehiwala', 'Mount Lavinia', 'Wadduwa', 'Kalutara'],
        highlights: [
            'Bentota Beach photo stop',
            'Kosgoda Sea Turtle Conservation visit',
            'Madu Ganga boat cruise (1.5 hours)',
            'Hikkaduwa Beach visit',
            'Galle Fort sightseeing & sunset'
        ],
        description: 'Experience the best of Sri Lanka\'s southern coast in one day. Visit turtle hatcheries, cruise through mangroves, and explore the historic Galle Fort.',
        itinerary: [
            { day: 1, title: 'South Coast Adventure', description: 'Depart from Colombo and head to Bentota. Visit the Sea Turtle Conservation project, enjoy a boat safari on Madu River, proceed to Hikkaduwa, and finally explore the Dutch Galle Fort.' }
        ]
    },
    {
        title: 'From Colombo: Day Trip to Kandy | Pinnawala | Royal Gardens',
        slug: 'kandy-pinnawala-day-trip',
        category: 'Day Tours',
        duration: 1,
        price: 50.63,
        originalPrice: 102.26,
        image: 'https://images.unsplash.com/photo-1590766940554-634a7ed01ce8?q=80&w=800&auto=format&fit=crop', // Kandy
        pickupLocations: ['Colombo', 'Negombo', 'Wadduwa', 'Mount Lavinia'],
        highlights: [
            'Pinnawala Elephant Orphanage',
            'Temple of the Tooth Relic',
            'Royal Botanical Gardens',
            'Kandy Lake viewpoint',
            'Gem Museum visit'
        ],
        description: 'Discover the cultural heart of Sri Lanka with visits to the sacred Temple of the Tooth, elephant orphanage, and the beautiful hill city of Kandy.',
        itinerary: [
            { day: 1, title: 'Hill Country Capital', description: 'Visit the Pinnawala Elephant Orphanage to feed elephants. Proceed to Kandy to visit the Royal Botanical Gardens and the Sacred Temple of the Tooth Relic.' }
        ]
    },
    {
        title: 'From Colombo: Sigiriya and Dambulla Day Trip and Safari',
        slug: 'sigiriya-dambulla-safari',
        category: 'Safari',
        duration: 1,
        price: 69,
        image: 'https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?q=80&w=800&auto=format&fit=crop', // Sigiriya
        pickupLocations: ['Colombo', 'Negombo', 'Kalutara', 'Bentota', 'Hikkaduwa', 'Galle'],
        highlights: [
            'Sigiriya Lion Rock climb',
            'Dambulla Cave Temple',
            'Village safari experience',
            'Traditional Sri Lankan lunch',
            'Wildlife viewing'
        ],
        description: 'Climb the iconic Sigiriya Lion Rock, explore ancient cave temples, and enjoy a wildlife safari - all in one incredible day trip.',
        itinerary: [
            { day: 1, title: 'Ancient Kingdoms & Wildlife', description: 'Visit the Dambulla Cave Temple. Climb the Sigiriya Lion Rock fortress. Enjoy a village safari with traditional lunch and a wildlife jeep safari.' }
        ]
    },
    {
        title: 'Colombo Full day city tour',
        slug: 'colombo-city-tour',
        category: 'City Tours',
        duration: 1,
        price: 39.00,
        image: 'https://images.unsplash.com/photo-1580894080106-963d76b4a20e?q=80&w=800&auto=format&fit=crop', // Colombo
        pickupLocations: ['Colombo City Limits'],
        highlights: [
            'Independence Square',
            'Gangaramaya Temple',
            'Colombo Lotus Tower',
            'Old Parliament & Lighthouse',
            'Shopping at Pettah/City Centre'
        ],
        description: 'Discover the vibrant capital of Colombo. Visit historic landmarks, modern attractions, and enjoy some shopping in this guided city tour.',
        itinerary: [
            { day: 1, title: 'Colombo City Tour', description: 'Sightseeing in Colombo including Independence Square, Gangaramaya Temple, BMICH, and shopping at Odel or Pettah market.' }
        ]
    },
    {
        title: 'From Negombo: Sigiriya Dambulla and Village Safari Day Tour',
        slug: 'negombo-sigiriya-safari',
        category: 'Safari',
        duration: 1,
        price: 80.00,
        originalPrice: 89.00,
        image: 'https://images.unsplash.com/photo-1534177616072-ef7dc12044f9?q=80&w=800&auto=format&fit=crop', // Elephant Safari
        pickupLocations: ['Negombo'],
        highlights: [
            'Sigiriya Lion Rock sunrise/visit',
            'Habarana village walk',
            'Minneriya National Park Safari',
            'Dambulla Royal Cave Temple'
        ],
        description: 'An action-packed day from Negombo features ancient fortress climbing, a village safari experience, and wildlife watching.',
        itinerary: [
            { day: 1, title: 'Adventure Trio', description: 'Climb Sigiriya, enjoy a traditional village lunch and safari, and visit the Dambulla Cave Temple.' }
        ]
    }
];

async function seed() {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(MONGODB_URI);

        console.log('Clearing existing tours...');
        await Tour.deleteMany({});

        console.log('Seeding new tours...');
        for (const tour of dayTrips) {
            // Unsplash Images logic integrated
            if (!tour.images || tour.images.length === 0) {
                tour.images = [tour.image];
            }
            await Tour.create(tour);
            console.log(`Created: ${tour.title}`);
        }

        console.log('Seeding complete.');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

seed();
