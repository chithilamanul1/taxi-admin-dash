import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable inside .env');
    process.exit(1);
}

const itinerarySchema = new mongoose.Schema({
    day: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String },
    location: { type: String },
    lat: { type: Number },
    lng: { type: Number },
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
    experience: { type: Array, default: [] },
    notSuitableFor: { type: [String], default: [] },
    notAllowed: { type: [String], default: [] },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 }
}, { timestamps: true });

const Tour = mongoose.models.Tour || mongoose.model('Tour', tourSchema);

const newSafariPackages = [
    {
        title: "Yala Safari Tour – Block 1",
        slug: "yala-safari-tour-block-1",
        category: "safari",
        duration: { days: 1, nights: 0 },
        description: "Experience the most popular sector of Yala National Park, famous for its high density of leopards. Block 1 offers a diverse landscape of open parkland, dense jungle, and picturesque lagoons, providing exceptional opportunities for wildlife photography and thrilling encounters.",
        shortDescription: "The ultimate leopard-spotting experience in Yala's most famous sector.",
        heroImage: "https://images.unsplash.com/photo-1614088661608-410a8ea944f2?q=80&w=1600&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1614088661608-410a8ea944f2?q=80&w=1600&auto=format&fit=crop"],
        price: { amount: 25000, currency: 'LKR', type: 'from' },
        destinations: ["Yala National Park"],
        inclusions: ["Safari Jeep", "Experienced Driver/Tracker", "Park Entrance Fees"],
        exclusions: ["Meals", "Gratuities"],
        isActive: true,
        sortOrder: 1
    },
    {
        title: "Yala Safari Tour – Block 5",
        slug: "yala-safari-tour-block-5",
        category: "safari",
        duration: { days: 1, nights: 0 },
        description: "For a quieter, more serene safari experience away from the crowds, Block 5 is the perfect choice. Characterized by lush forests and scenic waterholes, this block offers excellent bird watching and regular sightings of elephants, deer, and occasional leopards.",
        shortDescription: "A peaceful and serene wildlife experience away from the crowds.",
        heroImage: "https://images.unsplash.com/photo-1588241050774-6045f2bd648b?q=80&w=1600&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1588241050774-6045f2bd648b?q=80&w=1600&auto=format&fit=crop"],
        price: { amount: 22000, currency: 'LKR', type: 'from' },
        destinations: ["Yala National Park"],
        inclusions: ["Safari Jeep", "Experienced Driver/Tracker", "Park Entrance Fees"],
        exclusions: ["Meals", "Gratuities"],
        isActive: true,
        sortOrder: 2
    },
    {
        title: "Lunugamvehera Safari",
        slug: "lunugamvehera-safari",
        category: "safari",
        duration: { days: 1, nights: 0 },
        description: "Explore the untouched wilderness of Lunugamvehera National Park, an important corridor for elephants migrating between Yala and Udawalawe. This park boasts stunning landscapes around its vast reservoir and is a haven for elephants and diverse birdlife.",
        shortDescription: "Discover untouched wilderness and majestic elephant herds.",
        heroImage: "https://images.unsplash.com/photo-1549488398-aa66870ac45b?q=80&w=1600&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1549488398-aa66870ac45b?q=80&w=1600&auto=format&fit=crop"],
        price: { amount: 20000, currency: 'LKR', type: 'from' },
        destinations: ["Lunugamvehera National Park"],
        inclusions: ["Safari Jeep", "Experienced Driver/Tracker", "Park Entrance Fees"],
        exclusions: ["Meals", "Gratuities"],
        isActive: true,
        sortOrder: 3
    },
    {
        title: "Yala Morning Tour (4 Hrs)",
        slug: "yala-morning-tour-4hrs",
        category: "safari",
        duration: { days: 1, nights: 0 },
        description: "Start your day with the golden sunrise over the wilderness. This 4-hour morning safari is ideal for witnessing predators on the prowl and the jungle coming to life as the morning mist clears. Perfect for early risers and photography enthusiasts.",
        shortDescription: "Catch the golden sunrise and early morning wildlife activity.",
        heroImage: "https://images.unsplash.com/photo-1614088661608-410a8ea944f2?q=80&w=1600&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1614088661608-410a8ea944f2?q=80&w=1600&auto=format&fit=crop"],
        price: { amount: 18000, currency: 'LKR', type: 'from' },
        destinations: ["Yala National Park"],
        inclusions: ["Safari Jeep", "Experienced Driver/Tracker", "Park Entrance Fees"],
        exclusions: ["Meals", "Gratuities"],
        isActive: true,
        sortOrder: 4
    },
    {
        title: "Yala Morning Tour (6 Hrs)",
        slug: "yala-morning-tour-6hrs",
        category: "safari",
        duration: { days: 1, nights: 0 },
        description: "An extended morning adventure for wildlife enthusiasts. Spend 6 hours exploring deeper into the park, maximizing your chances of encountering the elusive Sri Lankan leopard, sloth bears, and large herds of elephants at watering holes.",
        shortDescription: "An extended morning adventure for maximum wildlife sightings.",
        heroImage: "https://images.unsplash.com/photo-1588241050774-6045f2bd648b?q=80&w=1600&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1588241050774-6045f2bd648b?q=80&w=1600&auto=format&fit=crop"],
        price: { amount: 25000, currency: 'LKR', type: 'from' },
        destinations: ["Yala National Park"],
        inclusions: ["Safari Jeep", "Experienced Driver/Tracker", "Park Entrance Fees"],
        exclusions: ["Meals", "Gratuities"],
        isActive: true,
        sortOrder: 5
    },
    {
        title: "Yala Evening Tour (4 Hrs)",
        slug: "yala-evening-tour-4hrs",
        category: "safari",
        duration: { days: 1, nights: 0 },
        description: "Witness the dramatic transition as the day cools down. The 4-hour evening safari is one of the best times to spot leopards emerging from the shade and elephants making their way to water sources against a spectacular sunset backdrop.",
        shortDescription: "Witness dramatic wildlife activity against a spectacular sunset.",
        heroImage: "https://images.unsplash.com/photo-1549488398-aa66870ac45b?q=80&w=1600&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1549488398-aa66870ac45b?q=80&w=1600&auto=format&fit=crop"],
        price: { amount: 18000, currency: 'LKR', type: 'from' },
        destinations: ["Yala National Park"],
        inclusions: ["Safari Jeep", "Experienced Driver/Tracker", "Park Entrance Fees"],
        exclusions: ["Meals", "Gratuities"],
        isActive: true,
        sortOrder: 6
    },
    {
        title: "Yala Full Day Tour",
        slug: "yala-full-day-tour",
        category: "safari",
        duration: { days: 1, nights: 0 },
        description: "Immerse yourself completely in the wild with a comprehensive Full Day Safari. Spend the entire day tracking diverse wildlife, enjoy a picnic lunch amidst nature, and experience the changing moods of the jungle from dawn till dusk.",
        shortDescription: "A complete dawn-to-dusk immersive wildlife experience.",
        heroImage: "https://images.unsplash.com/photo-1614088661608-410a8ea944f2?q=80&w=1600&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1614088661608-410a8ea944f2?q=80&w=1600&auto=format&fit=crop"],
        price: { amount: 45000, currency: 'LKR', type: 'from' },
        destinations: ["Yala National Park"],
        inclusions: ["Safari Jeep", "Experienced Driver/Tracker", "Park Entrance Fees"],
        exclusions: ["Meals", "Gratuities"],
        isActive: true,
        sortOrder: 7
    }
];

async function seedSafariPackages() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        for (const tour of newSafariPackages) {
            await Tour.findOneAndUpdate(
                { slug: tour.slug },
                tour,
                { upsert: true, new: true }
            );
            console.log(`Upserted safari tour: ${tour.title}`);
        }

        console.log('Successfully seeded all new safari packages!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding safari packages:', error);
        process.exit(1);
    }
}

seedSafariPackages();
