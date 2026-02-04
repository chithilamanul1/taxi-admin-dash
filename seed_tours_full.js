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
        category: 'day-trip',
        duration: 1,
        price: 59,
        originalPrice: null,
        image: '/tours/maduriver.jpg',
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
        category: 'day-trip',
        duration: 1,
        price: 50.63,
        originalPrice: 102.26,
        image: '/tours/kandy.jpg',
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
        category: 'safari',
        duration: 1,
        price: 69,
        image: '/tours/sigiriya.jpg',
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
        category: 'city-tour',
        duration: 1,
        price: 39.00,
        image: '/tours/colombo.jpg',
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
        category: 'safari',
        duration: 1,
        price: 80.00,
        originalPrice: 89.00,
        image: '/tours/safari_minneriya.png',
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
    },
    {
        title: '7 Days Classical Sri Lanka Tour',
        slug: '7-days-classical-tour',
        category: 'tour-package',
        duration: 7,
        price: 850.00,
        image: '/tours/map-6-days.png',
        pickupLocations: ['Airport', 'Colombo'],
        highlights: [
            'Cultural Triangle (Sigiriya/Dambulla)',
            'Hill Country (Kandy/Nuwara Eliya)',
            'Scenic Train Ride',
            'Wildlife Safari',
            'Southern Coast Beaches'
        ],
        description: 'A comprehensive 7-day tour exploring the best of Sri Lanka\'s history, culture, and nature. From ancient ruins to misty tea gardens and gold sandy beaches.',
        itinerary: [
            { day: 1, title: 'Arrival & Sigiriya', description: 'Pickup and transfer to Sigiriya.' }
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
