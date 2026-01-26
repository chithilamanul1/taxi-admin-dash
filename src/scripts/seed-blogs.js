const mongoose = require('mongoose');
// require('dotenv').config({ path: '.env' });
process.env.MONGO_URI = 'mongodb+srv://chithilamanul1_db_user:chithila123@taxiadmindash.l9tttdj.mongodb.net/?appName=taxiadmindash';

const blogSchema = new mongoose.Schema({
    title: String,
    slug: String,
    excerpt: String,
    content: String,
    coverImage: String,
    author: String,
    category: String,
    publishedAt: { type: Date, default: Date.now },
    tags: [String],
    readTime: String
});

const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);

const blogs = [
    {
        title: "10 Best Places to Visit in Sri Lanka 2024",
        slug: "10-best-places-sri-lanka-2024",
        excerpt: "Discover the top destinations in the Pearl of the Indian Ocean, from pristine beaches to misty mountains.",
        content: "<h2>1. Sigiriya Rock Fortress</h2><p>Known as the Eighth Wonder of the World...</p><h2>2. Ella</h2><p>Famous for the Nine Arch Bridge...</p>",
        coverImage: "/sigiriya.jpg",
        author: "Travel Desk",
        category: "Travel Guide",
        tags: ["Sri Lanka", "Travel", "Guide", "2024"],
        readTime: "8 min"
    },
    {
        title: "Ultimate Guide to Airport Taxis in Colombo",
        slug: "airport-taxi-colombo-guide",
        excerpt: "Everything you need to know about booking safe and reliable airport transfers from BIA.",
        content: "<h2>Choosing the Right Service</h2><p>Avoid the hassle of haggling...</p>",
        coverImage: "https://images.pexels.com/photos/13866635/pexels-photo-13866635.jpeg",
        author: "Admin",
        category: "Tips",
        tags: ["Taxi", "Airport Transfer", "Colombo"],
        readTime: "5 min"
    },
    {
        title: "Surfing in Arugam Bay: A Beginner's Guide",
        slug: "surfing-arugam-bay-guide",
        excerpt: "Ride the waves at one of the world's best surfing spots.",
        content: "<p>Arugam Bay offers waves for all levels...</p>",
        coverImage: "https://images.pexels.com/photos/1750570/pexels-photo-1750570.jpeg",
        author: "Explore Sri Lanka",
        category: "Adventure",
        tags: ["Surfing", "Arugam Bay", "Adventure"],
        readTime: "6 min"
    },
    {
        title: "Cultural Triangle: Ancient Cities of Sri Lanka",
        slug: "cultural-triangle-sri-lanka",
        excerpt: "Step back in time and explore Anuradhapura, Polonnaruwa, and Dambulla.",
        content: "<p>The rich history of Sri Lanka is best experienced here...</p>",
        coverImage: "https://images.pexels.com/photos/5342978/pexels-photo-5342978.jpeg",
        author: "History Buff",
        category: "Culture",
        tags: ["History", "Culture", "Ancient Cities"],
        readTime: "10 min"
    },
    {
        title: "Whale Watching in Mirissa",
        slug: "whale-watching-mirissa",
        excerpt: "Witness the majestic Blue Whales in their natural habitat.",
        content: "<p>Mirissa is one of the best places in the world to see Blue Whales...</p>",
        coverImage: "/mirissa.jpg",
        author: "Nature Lover",
        category: "Nature",
        tags: ["Wildlife", "Mirissa", "Whales"],
        readTime: "4 min"
    },
    {
        title: "Tea Plantations of Nuwara Eliya",
        slug: "tea-plantations-nuwara-eliya",
        excerpt: "Experience the cool climate and lush green hills of Little England.",
        content: "<p>Take a train ride through the scenic tea country...</p>",
        coverImage: "https://images.pexels.com/photos/1650955/pexels-photo-1650955.jpeg",
        author: "Travel Desk",
        category: "Travel Guide",
        tags: ["Tea", "Nuwara Eliya", "Hill Country"],
        readTime: "7 min"
    },
    {
        title: "Street Food Tour: Taste of Colombo",
        slug: "colombo-street-food-tour",
        excerpt: "Indulge in Kottu Roti, Hoppers, and Issprio.",
        content: "<p>Colombo's street food scene is vibrant and delicious...</p>",
        coverImage: "https://images.pexels.com/photos/2611917/pexels-photo-2611917.jpeg",
        author: "Foodie",
        category: "Food",
        tags: ["Food", "Colombo", "Street Food"],
        readTime: "5 min"
    },
    {
        title: "Yala National Park Safari",
        slug: "yala-national-park-safari",
        excerpt: "Spot leopards, elephants, and bears in Sri Lanka's most famous park.",
        content: "<p>Yala has the highest density of leopards in the world...</p>",
        coverImage: "https://images.pexels.com/photos/34098/south-africa-hluhluwe-giraffes-pattern.jpg",
        author: "Wild Life",
        category: "Wildlife",
        tags: ["Safari", "Yala", "Leopard"],
        readTime: "8 min"
    },
    {
        title: "Relax at Unawatuna Beach",
        slug: "relax-unawatuna-beach",
        excerpt: "Sun, sand, and sea at one of the most popular beaches.",
        content: "<p>Unawatuna is perfect for swimming and relaxation...</p>",
        coverImage: "https://images.pexels.com/photos/1078972/pexels-photo-1078972.jpeg",
        author: "Beach Bum",
        category: "Beaches",
        tags: ["Beach", "Unawatuna", "Relaxation"],
        readTime: "4 min"
    },
    {
        title: "Train Ride from Kandy to Ella",
        slug: "kandy-to-ella-train",
        excerpt: "Regarded as one of the most beautiful train journeys in the world.",
        content: "<p>The views of the tea plantations and waterfalls are breathtaking...</p>",
        coverImage: "/ella.jpg",
        author: "Train Enthusiast",
        category: "Travel Guide",
        tags: ["Train", "Kandy", "Ella", "Scenic"],
        readTime: "6 min"
    }
];

async function seed() {
    if (!process.env.MONGO_URI) {
        console.error('MONGO_URI not found in .env.local');
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        await Blog.deleteMany({});
        console.log('Cleared existing blogs');

        await Blog.insertMany(blogs);
        console.log('Seeded 10 blogs successfully');

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed();
