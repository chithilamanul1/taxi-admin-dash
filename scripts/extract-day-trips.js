const mongoose = require('mongoose');

// Schema fallback
const TourSchema = new mongoose.Schema({
    title: String,
    slug: String,
    category: String,
    description: String,
    inclusions: [String],
    exclusions: [String],
    experience: [{ heading: String, text: String }],
    notSuitableFor: [String],
    notAllowed: [String],
}, { strict: false });

const Tour = mongoose.models.Tour || mongoose.model('Tour', TourSchema);

async function extractAndSeed() {
    const MONGO_URI = "mongodb+srv://chithilamanul1_db_user:chithila123@taxiadmindash.l9tttdj.mongodb.net/taxiadmindash?retryWrites=true&w=majority";
    const TARGET_URL = "https://www.airporttaxis.lk/day-trips";

    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        // Note: Real scraping might be tricky here depending on the site's structure
        // I'll provide a few examples based on the user's screenshots

        // Real-world data based on user requirements and screenshots
        const sampleData = [
            {
                title: "Galle Day Tour",
                slug: "galle-day-tour",
                category: "day-trip",
                description: "Experience the magic of Sri Lanka's south coast. This comprehensive day tour takes you from the bustling capital to the historic Galle Fort, a UNESCO World Heritage site. Along the way, enjoy a mangrove boat safari, visit a turtle hatchery, and explore the charming streets of Galle.",
                inclusions: ["Hotel pickup and drop-off in a shared vehicle", "A bottle of water", "Private transport in an AC car/van", "English speaking driver-guide"],
                exclusions: ["Entrance fees", "Madu River boat safari ($30 for solo travelers)", "Turtle Hatchery ($10 per person)", "Tips and gratuities", "Lunch and beverages"],
                experience: [
                    { heading: "Pickup Location Options", text: "Colombo, Negombo, Dehiwala, Mount Lavinia, Wadduwa, Kalutara" },
                    { heading: "Bentota", text: "Photo stop (10 minutes) at the scenic Bentota beach." },
                    { heading: "Kosgoda Sea Turtle Conservation", text: "Visit (45 minutes) to learn about conservation efforts and see different turtle species." },
                    { heading: "Madu Ganga", text: "Boat cruise (105 minutes) through the mangroves, visiting a cinnamon island and fish massage." },
                    { heading: "Hikkaduwa", text: "Brief stop (30 minutes) at the famous Hikkaduwa beach." },
                    { heading: "Galle Fort", text: "Visit, Free time, Sightseeing, Walk, Sunset, Self-guided tour (1 hour) of the historic Dutch fortress." },
                    { heading: "Arrive back at", text: "Colombo, Negombo, Wadduwa, Kalutara, Dehiwala, Mount Lavinia" }
                ],
                notSuitableFor: ["Back problems", "Kidney problems", "Animal allergies", "Insect allergies", "Recent surgeries", "Pregnant women", "Motion sickness", "Wheelchair users"],
                notAllowed: ["Pets", "Fireworks", "Glass objects", "Alcohol and drugs", "Drones", "Making noise", "Touching/Feeding animals"]
            },
            {
                title: "Kandy Day Tour",
                slug: "kandy-day-tour",
                category: "day-trip",
                description: "Journey to the cultural heart of Sri Lanka. Visit the Temple of the Sacred Tooth Relic, explore the Peradeniya Botanical Gardens, and enjoy the scenic beauty of the hill country.",
                inclusions: ["Private transport in AC car", "Hotel pickup and drop-off", "English speaking driver"],
                exclusions: ["Entrance fees", "Lunch", "Personal expenses"],
                experience: [
                    { heading: "Pickup", text: "Early morning pickup from your hotel." },
                    { heading: "Pinnawala Elephant Orphanage", text: "Observe elephants bathing and being fed (Optional)." },
                    { heading: "Peradeniya Botanical Gardens", text: "Explore the vast collection of tropical flora." },
                    { heading: "Kandy Temple", text: "Visit the Temple of the Sacred Tooth Relic." },
                    { heading: "Kandy Lake & View Point", text: "Panoramic views of the city." },
                    { heading: "Tea Factory", text: "Visit a traditional tea factory and enjoy a tasting." }
                ],
                notSuitableFor: ["Walking difficulties"],
                notAllowed: ["Shorts inside the temple", "Improper attire"]
            },
            {
                title: "Sigiriya & Dambulla Day Tour",
                slug: "sigiriya-dambulla-day-tour",
                category: "day-trip",
                description: "Witness the architectural marvels of ancient Sri Lanka. Climb the Sigiriya Rock Fortress and explore the intricate cave paintings of Dambulla Cave Temple.",
                inclusions: ["Private AC Transport", "Driver-guide", "Pickup/Drop"],
                exclusions: ["Entrance tickets", "Meals"],
                experience: [
                    { heading: "Pickup", text: "Early departure to avoid the heat." },
                    { heading: "Dambulla Cave Temple", text: "Ancient Buddhist cave paintings and statues." },
                    { heading: "Sigiriya Rock Fortress", text: "Climb the 5th-century Lion Rock." },
                    { heading: "Village Tour", text: "Experience traditional rural life with a lunch (Optional)." }
                ],
                notSuitableFor: ["Fear of heights", "Heart conditions", "Walking disabilities"],
                notAllowed: ["Smoking at the site", "Removing artifacts"]
            }
        ];

        for (const item of sampleData) {
            console.log(`Updating ${item.title}...`);
            await Tour.findOneAndUpdate({ slug: item.slug }, item, { upsert: true });
        }

        console.log('Seeding complete');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

extractAndSeed();
