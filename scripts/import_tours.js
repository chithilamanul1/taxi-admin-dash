import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
import Tour from '../src/models/Tour.js';

const envLocalPath = path.join(process.cwd(), '.env.local');
const envPath = path.join(process.cwd(), '.env');

if (fs.existsSync(envLocalPath)) {
    dotenv.config({ path: envLocalPath });
    console.log(`Loaded env from ${envLocalPath}`);
} else if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    console.log(`Loaded env from ${envPath}`);
} else {
    console.warn('No .env or .env.local file found.');
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Missing MONGODB_URI in environment variables.');
    // Try to grep it for debugging (without printing value)
    if (fs.existsSync(envLocalPath)) {
        const content = fs.readFileSync(envLocalPath, 'utf8');
        console.log('Contains MONGODB_URI:', content.includes('MONGODB_URI'));
    }
    process.exit(1);
}

const dayTrips = [
    {
        title: "Galle and Bentota Day-Tour From Colombo",
        category: "Day Tours",
        price: 59,
        duration: "12 hours",
        imageUrl: "https://www.airporttaxis.lk/DayTrips/maduriver.jpg",
        description: "Explore the southern coast of Sri Lanka on this comprehensive day tour. Visit the Kosgoda Turtle Hatchery, take a boat safari on the Madu River, and explore the historic Galle Fort.",
        destinations: ["Kosgoda", "Madu River", "Galle Fort", "Bentota"],
        highlights: ["Turtle Hatchery", "River Safari", "Colonial Architecture", "Beach"]
    },
    {
        title: "Day Trip to Kandy | Pinnwala | Royal Gardens",
        category: "Day Tours",
        price: 50.63,
        duration: "13 hours",
        imageUrl: "https://www.airporttaxis.lk/DayTrips/kandy.jpg",
        description: "Experience the cultural capital of Sri Lanka. Visit the Pinnawala Elephant Orphanage, the Royal Botanical Gardens in Peradeniya, and the Sacred Temple of the Tooth Relic in Kandy.",
        destinations: ["Pinnawala", "Peradeniya", "Kandy"],
        highlights: ["Elephants", "Botanical Gardens", "Temple of Tooth", "Cultural Show"]
    },
    {
        title: "Sigiriya and Dambulla Day Trip and Safari",
        category: "Safari",
        price: 69,
        duration: "14-16 hours",
        imageUrl: "https://www.airporttaxis.lk/DayTrips/sigiriya.jpg",
        description: "A full day of history and wildlife. Climb the Sigiriya Rock Fortress, visit the Dambulla Cave Temple, and embark on a thrilling safari in Minneriya National Park to see wild elephants.",
        destinations: ["Sigiriya", "Dambulla", "Minneriya"],
        highlights: ["Lion Rock", "Cave Temple", "Elephant Safari", "Nature"]
    },
    {
        title: "Colombo: Galle and Bentota Day Tour",
        category: "Day Tours",
        price: 50.22,
        duration: "12 hours",
        imageUrl: "https://www.airporttaxis.lk/DayTrips/bentota.jpg",
        description: "Enjoy a relaxing day tour to the southern coast. Visit the beach resort town of Bentota and the historic city of Galle.",
        destinations: ["Bentota", "Galle"],
        highlights: ["Beach", "Water Sports", "Fort"]
    },
    {
        title: "Sigiriya, Dambulla and Minneriya Day Trip (Private)",
        category: "Safari",
        price: 114.20,
        duration: "24 hours",
        imageUrl: "https://www.airporttaxis.lk/DayTrips/sigiriya2.jpg",
        description: "Private tour to the cultural triangle. Sigiriya Rock, Dambulla Cave Temple, and a wildlife safari in Minneriya.",
        destinations: ["Sigiriya", "Dambulla", "Minneriya"],
        highlights: ["Private Guide", "UNESCO Sites", "Wildlife"]
    },
    {
        title: "Private Sigiriya and Dambulla Day Tour from Colombo",
        category: "Day Tours",
        price: 94,
        duration: "14 hours",
        imageUrl: "https://www.airporttaxis.lk/DayTrips/sigiriya3.jpg",
        description: "A private excursion to two of Sri Lanka's most iconic UNESCO World Heritage sites: Sigiriya and Dambulla.",
        destinations: ["Sigiriya", "Dambulla"],
        highlights: ["Rock Fortress", "Golden Temple"]
    },
    {
        title: "Colombo Full day city tour",
        category: "City Tours",
        price: 39,
        duration: "6 hours",
        imageUrl: "https://www.airporttaxis.lk/DayTrips/colombo.jpg",
        description: "Discover the vibrant city of Colombo. Visit Independence Square, Gangaramaya Temple, and enjoy shopping at popular spots.",
        destinations: ["Colombo"],
        highlights: ["City Sightseeing", "Shopping", "Temples"]
    },
    {
        title: "From Negombo: Ambuluwawa Tower & Tea Factory, Kandy Day Trip",
        category: "Day Tours",
        price: 67.55,
        duration: "15 hours",
        imageUrl: "https://www.airporttaxis.lk/DayTrips/ambuluwawa.jpg",
        description: "Visit the biodiversity complex of Ambuluwawa Tower, a tea factory to see the tea making process, and the city of Kandy.",
        destinations: ["Gampola", "Kandy"],
        highlights: ["Ambuluwawa Tower", "Tea Factory", "Kandy City"]
    },
    {
        title: "Colombo & Negombo To Galle | Hikkaduwa | Mirissa Day Tour",
        category: "Day Tours",
        price: 94.56,
        duration: "8 hours",
        imageUrl: "https://www.airporttaxis.lk/DayTrips/galle3.jpg",
        description: "A coastal tour covering Galle Fort, Hikkaduwa coral reefs, and the whale watching hub of Mirissa.",
        destinations: ["Galle", "Hikkaduwa", "Mirissa"],
        highlights: ["Coral Reefs", "Whales (seasonal)", "Fort"]
    }
];

const tourPackages = [
    {
        title: "06 Days | 05 Nights Excursions from Kandy, Sigiriya & Colombo",
        category: "Tour Packages",
        price: 300,
        duration: "6 Days",
        imageUrl: "https://www.airporttaxis.lk/DayTrips/kandy.jpg", // Reuse kandy
        description: "A classic 6-day tour covering the cultural triangle and the capital. Includes visits to Kandy, Sigiriya, and Colombo.",
        destinations: ["Kandy", "Sigiriya", "Colombo"],
        highlights: ["Cultural Triangle", "City Tours"]
    },
    {
        title: "Sri Lanka Classic & Northern Tour - 10 Days | 09 Nights",
        category: "Tour Packages",
        price: 350,
        duration: "10 Days",
        imageUrl: "https://www.airporttaxis.lk/DayTrips/sigiriya.jpg", // Reuse sigiriya
        description: "An extensive 10-day journey exploring the classic cultural sites and the unique charm of Northern Sri Lanka.",
        destinations: ["Anuradhapura", "Jaffna", "Sigiriya", "Kandy"],
        highlights: ["North & South", "History"]
    },
    {
        title: "08 Days Tour - Kandy, Nuwara Eliya & Bentota",
        category: "Tour Packages",
        price: 450,
        duration: "8 Days",
        imageUrl: "https://www.airporttaxis.lk/DayTrips/ambuluwawa.jpg", // Reuse hill country feel
        description: "Experience the cool hill country and the sunny southern beaches. Kandy culture, Nuwara Eliya tea plantations, and Bentota beach.",
        destinations: ["Kandy", "Nuwara Eliya", "Bentota"],
        highlights: ["Hills", "Beach", "Tea"]
    },
    {
        title: "10 Days - Nature, Culture & East Coast",
        category: "Tour Packages",
        price: 450,
        duration: "10 Days",
        imageUrl: "https://www.airporttaxis.lk/DayTrips/sigiriya4.jpg",
        description: "A comprehensive 10-day tour blending nature, culture, and the pristine beaches of the East Coast.",
        destinations: ["Sigiriya", "Polonnaruwa", "Trincomalee"],
        highlights: ["East Coast Beaches", "Ancient Cities"]
    },
    {
        title: "Sri Lanka Culture Nature Tour - 12 Days | 11 Nights",
        category: "Tour Packages",
        price: 750,
        duration: "12 Days",
        imageUrl: "https://www.airporttaxis.lk/DayTrips/sigiriya3.jpg",
        description: "The ultimate 12-day Sri Lankan experience. Deep dive into the island's rich culture and diverse natural beauty.",
        destinations: ["All Major Sites"],
        highlights: ["Comprehensive Tour", "Culture & Nature"]
    },
    {
        title: "05 Days | 04 Nights - Kandy, Nuwara Eliya, Bentota, Colombo",
        category: "Tour Packages",
        price: 450,
        duration: "5 Days",
        imageUrl: "https://www.airporttaxis.lk/DayTrips/colombo.jpg",
        description: "A short but sweet 5-day tour capturing the essence of Sri Lanka's hills, beaches, and city life.",
        destinations: ["Kandy", "Nuwara Eliya", "Bentota", "Colombo"],
        highlights: ["Compact Tour", "Highlights"]
    },
    {
        title: "10 Days | 09 Nights Ramayana Trail Tour",
        category: "Tour Packages",
        price: 450,
        duration: "10 Days",
        imageUrl: "https://www.airporttaxis.lk/DayTrips/ambuluwawa.jpg",
        description: "Follow the legendary Ramayana trail across Sri Lanka. Visit sites associated with the epic Ramayana.",
        destinations: ["Chilaw", "Trincomalee", "Nuwara Eliya", "Ella"],
        highlights: ["Ramayana Sites", "Pilgrimage"]
    },
    {
        title: "07 Days | 06 Nights Buddhist Cultural Tour",
        category: "Tour Packages",
        price: 450,
        duration: "7 Days",
        imageUrl: "https://www.airporttaxis.lk/DayTrips/kandy.jpg",
        description: "A spiritual journey visiting the most sacred Buddhist sites in Sri Lanka.",
        destinations: ["Anuradhapura", "Polonnaruwa", "Kandy"],
        highlights: ["Buddhism", "Ancient Temples"]
    }
];

const downloadImage = (url, filepath) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filepath);
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                // consume response data to free up memory
                response.resume();
                reject(new Error(`Failed to download image: ${response.statusCode}`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close(() => resolve(filepath));
            });
        }).on('error', (err) => {
            fs.unlink(filepath, () => { });
            reject(err);
        });
    });
};

const importData = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const allTours = [...dayTrips, ...tourPackages];

        // Ensure upload directory exists
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'tours');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        for (const tour of allTours) {
            let imagePath = '';

            if (tour.imageUrl) {
                const imageName = path.basename(tour.imageUrl);
                const localPath = path.join(uploadDir, imageName);
                const publicPath = `/uploads/tours/${imageName}`;

                if (fs.existsSync(localPath)) {
                    console.log(`Image already exists: ${imageName}`);
                    imagePath = publicPath;
                } else {
                    console.log(`Downloading image: ${imageName}...`);
                    try {
                        await downloadImage(tour.imageUrl, localPath);
                        imagePath = publicPath;
                    } catch (err) {
                        console.error(`Failed to download ${tour.imageUrl}:`, err.message);
                        imagePath = ''; // Use placeholder or empty
                    }
                }
            }

            // Generate Schema Fields
            const tourData = {
                title: tour.title,
                slug: tour.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
                category: tour.category === 'Safari' ? 'safari' : (tour.category === 'Day Tours' ? 'day-trip' : 'tour-package'),
                price: {
                    amount: tour.price,
                    currency: 'USD',
                    type: 'per-person'
                },
                duration: {
                    days: parseInt(tour.duration) || 1, // Simple parsing
                    nights: Math.max(0, (parseInt(tour.duration) || 1) - 1)
                },
                description: tour.description,
                image: imagePath || '/tours/placeholder.jpg',
                heroImage: imagePath || '/tours/placeholder.jpg',
                destinations: tour.destinations,
                highlights: tour.highlights,
                isActive: true,
                isFeatured: true
            };

            // Upsert
            await Tour.findOneAndUpdate(
                { slug: tourData.slug },
                tourData,
                { upsert: true, new: true }
            );
            console.log(`Imported/Updated: ${tour.title}`);
        }

        console.log('Import completed successfully.');
        process.exit(0);

    } catch (error) {
        console.error('Import Error:', error);
        process.exit(1);
    }
};

importData();
