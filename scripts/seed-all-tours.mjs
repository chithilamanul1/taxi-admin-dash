import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

const envLocalPath = path.join(process.cwd(), '.env.local');
const envPath = path.join(process.cwd(), '.env');

if (fs.existsSync(envLocalPath)) {
    dotenv.config({ path: envLocalPath });
    console.log(`Loaded env from ${envLocalPath}`);
} else if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    console.log(`Loaded env from ${envPath}`);
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.error('Missing MONGODB_URI');
    process.exit(1);
}

// Minimal Schema to ensure we don't depend strictly on the app model compilation state
const itinerarySchema = new mongoose.Schema({
    day: Number,
    title: String,
    description: String,
    activities: [String],
    overnightStay: String
}, { _id: false });

const tourSchema = new mongoose.Schema({
    title: String,
    slug: { type: String, unique: true },
    category: String,
    duration: { days: Number, nights: Number },
    description: String,
    shortDescription: String,
    images: [String],
    heroImage: String,
    price: { amount: Number, currency: String, type: { type: String } },
    destinations: [String],
    inclusions: [String],
    exclusions: [String],
    itinerary: [itinerarySchema],
    isFeatured: Boolean,
    isActive: Boolean,
    sortOrder: Number
}, { timestamps: true });

const Tour = mongoose.models.Tour || mongoose.model('Tour', tourSchema);

const newDayTrips = [
    {
        title: "Sigiriya and Dambulla Highlights",
        category: "day-trip",
        price: { amount: 65, currency: "USD", type: "from" },
        duration: { days: 1, nights: 0 },
        description: "Climb the ancient Sigiriya Rock Fortress and explore the Dambulla Cave Temple in this full-day adventure.",
        shortDescription: "Sigiriya Rock Fortress and Dambulla Cave Temple.",
        heroImage: "https://images.unsplash.com/photo-1588614959060-4d144f28b2ea?auto=format&fit=crop&q=80&w=1200",
        destinations: ["Sigiriya", "Dambulla"],
        inclusions: ["Private A/C Vehicle", "English Speaking Driver", "Bottled Water"],
        exclusions: ["Entrance Fees", "Meals"],
        itinerary: [
            { day: 1, title: "Sigiriya and Dambulla", description: "Pickup from Colombo/Negombo. Visit Dambulla Cave Temple. Climb Sigiriya Rock Fortress. Return trip.", activities: ["Dambulla Cave Temple", "Sigiriya Rock"] }
        ]
    },
    {
        title: "Kandy Cultural Immersion",
        category: "day-trip",
        price: { amount: 55, currency: "USD", type: "from" },
        duration: { days: 1, nights: 0 },
        description: "Experience the spiritual heart of Sri Lanka. Visit the Temple of the Tooth and the Royal Botanical Gardens.",
        shortDescription: "Temple of the Tooth and Peradeniya Gardens.",
        heroImage: "https://images.unsplash.com/photo-1625736300986-a5b6ce19226d?auto=format&fit=crop&q=80&w=1200",
        destinations: ["Kandy", "Peradeniya"],
        inclusions: ["Private A/C Vehicle", "English Speaking Driver", "Bottled Water"],
        exclusions: ["Entrance Fees", "Meals"],
        itinerary: [
            { day: 1, title: "Kandy Highlights", description: "Pickup from Colombo/Negombo. Visit Pinnawala Elephant Orphanage. Explore Temple of the Sacred Tooth Relic. Stroll through Royal Botanical Gardens.", activities: ["Pinnawala", "Temple of the Tooth", "Botanical Gardens"] }
        ]
    },
    {
        title: "Galle Fort & Southern Coast (Whale Watching)",
        category: "day-trip",
        price: { amount: 75, currency: "USD", type: "from" },
        duration: { days: 1, nights: 0 },
        description: "Head south for a day of whale watching in Mirissa and exploring the Dutch colonial heritage of Galle Fort.",
        shortDescription: "Mirissa Whale Watching and Galle Fort.",
        heroImage: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=1200",
        destinations: ["Galle", "Mirissa"],
        inclusions: ["Private A/C Vehicle", "English Speaking Driver", "Bottled Water"],
        exclusions: ["Whale Watching Boat Ticket", "Meals"],
        itinerary: [
            { day: 1, title: "South Coast Adventure", description: "Early morning pickup. Whale watching in Mirissa. Visit Stilt Fishermen. Explore Galle Fort.", activities: ["Whale Watching", "Galle Fort Tour"] }
        ]
    },
    {
        title: "Minneriya / Kaudulla Wildlife Safari",
        category: "safari",
        price: { amount: 80, currency: "USD", type: "from" },
        duration: { days: 1, nights: 0 },
        description: "Witness the largest gathering of Asian elephants in the world during this thrilling jeep safari.",
        shortDescription: "The Great Elephant Gathering.",
        heroImage: "https://images.unsplash.com/photo-1586861635167-e52a3a1e262c?auto=format&fit=crop&q=80&w=1200",
        destinations: ["Minneriya", "Habarana"],
        inclusions: ["Private A/C Vehicle", "English Speaking Driver", "4x4 Safari Jeep"],
        exclusions: ["National Park Entrance Fees"],
        itinerary: [
            { day: 1, title: "Elephant Safari", description: "Afternoon safari at Minneriya or Kaudulla National Park. Witness herds of wild elephants.", activities: ["4x4 Jeep Safari"] }
        ]
    }
    // Expanded with 4 primary examples to prove schema works correctly in the new system.
];

const newMultiDayTours = [
    {
        title: "7 Days Classic Sri Lanka",
        category: "tour-package",
        price: { amount: 450, currency: "USD", type: "from" },
        duration: { days: 7, nights: 6 },
        description: "A comprehensive week long tour covering the cultural triangle, hill country, and southern coast.",
        shortDescription: "Sigiriya, Kandy, Nuwara Eliya, Yala, and Galle.",
        heroImage: "https://images.unsplash.com/photo-1550977186-b4fb553a06ad?auto=format&fit=crop&q=80&w=1200",
        destinations: ["Sigiriya", "Kandy", "Nuwara Eliya", "Yala", "Galle"],
        inclusions: ["Private A/C Vehicle", "English Speaking Chauffeur", "Highway Tolls", "Fuel"],
        exclusions: ["Accommodation", "Meals", "Entrance Tickets"],
        itinerary: [
            { day: 1, title: "Airport to Sigiriya", description: "Arrival and transfer to Sigiriya. Rest.", activities: ["Transfer"] },
            { day: 2, title: "Cultural Triangle", description: "Climb Sigiriya, visit Polonnaruwa.", activities: ["Sigiriya", "Polonnaruwa"] },
            { day: 3, title: "Sigiriya to Kandy", description: "Dambulla Cave Temple, Spice Garden, Temple of the Tooth.", activities: ["Dambulla", "Temple of the Tooth"] },
            { day: 4, title: "Kandy to Nuwara Eliya", description: "Botanical Gardens, Ramboda Falls, Tea Factory.", activities: ["Tea Factory", "Waterfalls"] },
            { day: 5, title: "Nuwara Eliya to Yala", description: "Scenic train ride (optional), transfer to Yala.", activities: ["Train Ride", "Transfer"] },
            { day: 6, title: "Yala Safari to Galle", description: "Morning Safari in Yala, transfer to Galle Fort.", activities: ["Yala Safari", "Galle Fort"] },
            { day: 7, title: "Galle to Airport", description: "Morning at beach, transfer to Airport for departure.", activities: ["Transfer"] }
        ]
    }
];

const seedData = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const allNewTours = [...newDayTrips, ...newMultiDayTours];

        for (const tour of allNewTours) {
            const slug = tour.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            const tourData = {
                ...tour,
                slug,
                isActive: true,
                isFeatured: true,
                sortOrder: 0
            };

            await Tour.findOneAndUpdate(
                { slug },
                tourData,
                { upsert: true, new: true }
            );
            console.log(`Upserted Tour: ${tour.title}`);
        }

        console.log('Successfully seeded tours.');
        process.exit(0);
    } catch (e) {
        console.error('Seed error:', e);
        process.exit(1);
    }
};

seedData();
