const mongoose = require('mongoose');

// Schema fallback
const TourSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    category: { type: String, default: 'tour-package' },
    price: mongoose.Schema.Types.Mixed,
    currency: { type: String, default: 'USD' },
    duration: mongoose.Schema.Types.Mixed,
    highlights: [String],
    inclusions: [String],
    exclusions: [String],
    itinerary: [{
        day: Number,
        title: String,
        description: String,
        activities: [String],
        location: String
    }],
    notSuitableFor: [String],
    notAllowed: [String],
    image: String,
    images: [String],
    heroImage: String,
    destinations: [String],
    location: String
});

const Tour = mongoose.models.Tour || mongoose.model('Tour', TourSchema);

const MONGO_URI = "mongodb+srv://chithilamanul1_db_user:chithila123@taxiadmindash.l9tttdj.mongodb.net/?appName=taxiadmindash";

const standardInclusions = [
    "Airport meeting and assistance during the stay",
    "Transportation by air-conditioned vehicle",
    "English-speaking Chauffeur (up to 6 pax) or Guide service (from 7 pax onwards)",
    "Hotel accommodation based on your selection (Single, Double/Twin, or Triple sharing)",
    "Meal plans: Half board (Dinner and Breakfast) or Full board as requested",
    "Two bottles of water per person, per day"
];

const standardExclusions = [
    "International airfare and travel insurance",
    "Entrance fees to parks and archaeological sites",
    "Jeep and boat charges not specifically mentioned",
    "Peak period supplements and visa fees (ETA)",
    "Tips, extras, and permits for photos/videos"
];

const standardNotSuitable = [
    "Back or kidney problems",
    "Recent surgeries",
    "Motion sickness or a fear of heights",
    "Pregnancy (especially for bumpy safaris)",
    "Wheelchair users (due to stairs and uneven terrain)",
    "Specific allergies (insects, animals)"
];

const standardNotAllowed = [
    "Pets, explosive substances, and fireworks",
    "Alcoholic drinks or food consumption inside the vehicle",
    "Touching or feeding wild animals",
    "Drones, nudity, or making excessive noise"
];

async function seedTourPackages() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const tourPackages = [
            {
                title: "06 Days | 05 Nights Excursions (Kandy, Sigiriya & Colombo)",
                slug: "06-days-05-nights-excursions-kandy-sigiriya-colombo",
                category: "tour-package",
                price: { amount: 300, currency: "USD" },
                duration: "6 Days",
                itinerary: [
                    { day: 1, title: "Airport – Pinnawala – Kandy", description: "Arrival at Bandaranaike International Airport, meeting with a representative, and drive to Kandy. Visit the Pinnawala Elephant Orphanage en-route to observe and feed elephants. In the evening, visit the Temple of the Sacred Tooth Relic and watch a Cultural Dancing Show. Overnight in Kandy.", location: "Kandy" },
                    { day: 2, title: "Kandy – Peradeniya – Nuwara Eliya – Kandy", description: "Visit the Peradeniya Royal Botanical Gardens. Drive to Nuwara Eliya ('Little England') through tea plantations and waterfalls before returning to Kandy.", location: "Nuwara Eliya" },
                    { day: 3, title: "Kandy – Dambulla – Minneriya – Sigiriya", description: "Visit the Dambulla Cave Temple. Go on a wildlife safari at Minneriya National Park to see wild elephants. Overnight in Sigiriya.", location: "Sigiriya" },
                    { day: 4, title: "Sigiriya – Colombo", description: "Climb the Sigiriya Lion Rock fortress. Transfer to the commercial capital, Colombo.", location: "Colombo" },
                    { day: 5, title: "Colombo City Tour", description: "Explore Colombo's landmarks like Independence Square and Gangaramaya Temple, plus time for shopping.", location: "Colombo" },
                    { day: 6, title: "Colombo – City Tour – Airport", description: "Brief final city tour or relaxation before departure to the airport." }
                ],
                inclusions: standardInclusions,
                exclusions: standardExclusions,
                notSuitableFor: standardNotSuitable,
                notAllowed: standardNotAllowed
            },
            {
                title: "05 Days | 04 Nights Essential (Kandy, Nuwara Eliya, Bentota & Colombo)",
                slug: "05-days-04-nights-essential-kandy-nuwara-eliya-bentota-colombo",
                category: "tour-package",
                price: { amount: 450, currency: "USD" },
                duration: "5 Days",
                itinerary: [
                    { day: 1, title: "Airport – Kandy", description: "Transfer to the hill capital; visit the Temple of the Tooth and enjoy a cultural show.", location: "Kandy" },
                    { day: 2, title: "Kandy – Nuwara Eliya", description: "Travel to the highlands; visit a tea factory and Gregory Lake.", location: "Nuwara Eliya" },
                    { day: 3, title: "Nuwara Eliya – Bentota", description: "Descent to the southern coast for beach relaxation.", location: "Bentota" },
                    { day: 4, title: "Bentota – Colombo", description: "Madu River boat safari and visit a Turtle hatchery in Kosgoda. Transfer to Colombo for an evening city tour.", location: "Colombo" },
                    { day: 5, title: "Colombo – Airport", description: "Morning shopping and transfer to the airport for your flight." }
                ],
                inclusions: standardInclusions,
                exclusions: standardExclusions,
                notSuitableFor: standardNotSuitable,
                notAllowed: standardNotAllowed
            },
            {
                title: "08 Days Tour (Kandy, Nuwara Eliya & Bentota)",
                slug: "08-days-tour-kandy-nuwara-eliya-bentota",
                category: "tour-package",
                price: { amount: 450, currency: "USD" },
                duration: "8 Days",
                itinerary: [
                    { day: 1, title: "Kandy Focus", description: "Arrival and transfer to Kandy. Dedicated time for the Temple of the Tooth, city sightseeing, and cultural experiences.", location: "Kandy" },
                    { day: 2, title: "Kandy Focus", description: "Continued exploration of Kandy's heritage.", location: "Kandy" },
                    { day: 3, title: "Nuwara Eliya Highlights", description: "Scenic drive through tea estates. Visit waterfalls, tea factories, and enjoy the cool climate of the central highlands.", location: "Nuwara Eliya" },
                    { day: 4, title: "Nuwara Eliya Highlights", description: "Lake Gregory and relaxing in 'Little England'.", location: "Nuwara Eliya" },
                    { day: 5, title: "Bentota Coastal Life", description: "Transfer to the beach. Enjoy water sports, the Madu River boat cruise, and relaxation.", location: "Bentota" },
                    { day: 6, title: "Bentota Coastal Life", description: "Beach time and optional activities.", location: "Bentota" },
                    { day: 7, title: "Colombo & Departure", description: "Transfer to Colombo for shopping and a final city tour before heading to the airport.", location: "Colombo" },
                    { day: 8, title: "Colombo & Departure", description: "Final transfers." }
                ],
                inclusions: standardInclusions,
                exclusions: standardExclusions,
                notSuitableFor: standardNotSuitable,
                notAllowed: standardNotAllowed
            },
            {
                title: "Sri Lanka Classic & Northern Tour (10 Days | 09 Nights)",
                slug: "sri-lanka-classic-northern-tour-10-days-09-nights",
                category: "tour-package",
                price: { amount: 350, currency: "USD" },
                duration: "10 Days",
                itinerary: [
                    { day: 1, title: "Cultural Triangle", description: "Focus on the ancient ruins of Anuradhapura and the Dambulla area.", location: "Anuradhapura" },
                    { day: 2, title: "Cultural Triangle", description: "Exploring Sigiriya and Polonnaruwa ruins.", location: "Sigiriya" },
                    { day: 3, title: "Cultural Triangle", description: "Dambulla Cave Temple visit.", location: "Dambulla" },
                    { day: 4, title: "The North (Jaffna)", description: "Journey to Jaffna to explore the Nallur Kandaswamy Kovil.", location: "Jaffna" },
                    { day: 5, title: "The North (Jaffna)", description: "Jaffna Fort and unique northern culture.", location: "Jaffna" },
                    { day: 6, title: "The North (Jaffna)", description: "Casuarina Beach or Nagadeepa temple.", location: "Jaffna" },
                    { day: 7, title: "Return South to Kandy", description: "Transfer back to the hill capital.", location: "Kandy" },
                    { day: 8, title: "Kandy", description: "Temple of the Tooth and city tour.", location: "Kandy" },
                    { day: 9, title: "Colombo", description: "Transfer to Colombo for final sightseeing.", location: "Colombo" },
                    { day: 10, title: "Departure", description: "Transfer to the airport." }
                ],
                inclusions: standardInclusions,
                exclusions: standardExclusions,
                notSuitableFor: standardNotSuitable,
                notAllowed: standardNotAllowed
            },
            {
                title: "10 Days | 09 Nights Nature, Culture & East Coast",
                slug: "10-days-09-nights-nature-culture-east-coast",
                category: "tour-package",
                price: { amount: 450, currency: "USD" },
                duration: "10 Days",
                itinerary: [
                    { day: 1, title: "Airport – Negombo", description: "Arrival and transfer to a beach hotel in Negombo for relaxation after the flight.", location: "Negombo" },
                    { day: 2, title: "Negombo – Sigiriya", description: "Drive to the Cultural Triangle; visit the Dambulla Cave Temple en route.", location: "Sigiriya" },
                    { day: 3, title: "Sigiriya – Polonnaruwa – Sigiriya", description: "Morning climb of the Sigiriya Lion Rock. Afternoon exploration of the ancient ruins of Polonnaruwa.", location: "Polonnaruwa" },
                    { day: 4, title: "Sigiriya – Trincomalee", description: "Travel to the East Coast. Visit the Koneswaram Temple and enjoy the white sands of Nilaveli Beach.", location: "Trincomalee" },
                    { day: 5, title: "Trincomalee/Pasikudah", description: "Dedicated to beach relaxation and snorkeling at Pigeon Island.", location: "Trincomalee" },
                    { day: 6, title: "Trincomalee/Pasikudah", description: "Whale watching (seasonal) or further relaxation.", location: "Pasikudah" },
                    { day: 7, title: "Trincomalee – Kandy", description: "Drive to the hill capital; visit the Temple of the Sacred Tooth Relic in the evening.", location: "Kandy" },
                    { day: 8, title: "Kandy – Nuwara Eliya", description: "Scenic drive to the 'Little England' of Sri Lanka; visit a tea factory and Ramboda Falls.", location: "Nuwara Eliya" },
                    { day: 9, title: "Nuwara Eliya – Colombo", description: "Descent to the capital city for a late afternoon city tour and shopping.", location: "Colombo" },
                    { day: 10, title: "Colombo – Airport", description: "Transfer to the airport for departure." }
                ],
                inclusions: standardInclusions,
                exclusions: standardExclusions,
                notSuitableFor: standardNotSuitable,
                notAllowed: standardNotAllowed
            },
            {
                title: "10 Days | 09 Nights Ramayana Trail Tour",
                slug: "10-days-09-nights-ramayana-trail-tour",
                category: "tour-package",
                price: { amount: 450, currency: "USD" },
                duration: "10 Days",
                itinerary: [
                    { day: 1, title: "Airport – Chilaw – Kandy", description: "Visit Munneswaram and Manavari Temples in Chilaw.", location: "Kandy" },
                    { day: 2, title: "Kandy – Trincomalee", description: "Visit the Koneswaram Temple associated with Rishi Agastya.", location: "Trincomalee" },
                    { day: 3, title: "Trincomalee – Dambulla – Sigiriya", description: "Explore the Dambulla caves and stay in Sigiriya.", location: "Sigiriya" },
                    { day: 4, title: "Sigiriya – Hasalaka – Kandy", description: "Visit Seetha Kotuwa.", location: "Kandy" },
                    { day: 5, title: "Kandy – Nuwara Eliya", description: "Visit the Sri Bhakta Hanuman Temple.", location: "Nuwara Eliya" },
                    { day: 2, title: "Nuwara Eliya Focus", description: "Visit Seetha Amman Temple and Hakgala Botanical Garden.", location: "Nuwara Eliya" },
                    { day: 7, title: "Nuwara Eliya – Ella – Kataragama", description: "Visit Ravana Falls and Ravana Caves, then head to Kataragama.", location: "Kataragama" },
                    { day: 8, title: "Kataragama – Ussangoda – Galle", description: "Visit Ussangoda (Ravana's airport).", location: "Galle" },
                    { day: 9, title: "Galle – Colombo", description: "Visit the Kelaniya Raja Maha Vihara.", location: "Colombo" },
                    { day: 10, title: "Colombo – Airport", description: "Final transfer." }
                ],
                inclusions: standardInclusions,
                exclusions: standardExclusions,
                notSuitableFor: standardNotSuitable,
                notAllowed: standardNotAllowed
            },
            {
                title: "07 Days | 06 Nights Buddhist Cultural Tour",
                slug: "07-days-06-nights-buddhist-cultural-tour",
                category: "tour-package",
                price: { amount: 450, currency: "USD" },
                duration: "7 Days",
                itinerary: [
                    { day: 1, title: "Airport – Anuradhapura", description: "Transfer to the first ancient capital.", location: "Anuradhapura" },
                    { day: 2, title: "Anuradhapura – Mihintale", description: "Visit Jaya Sri Maha Bodhi, Ruwanwelisaya, and Mihintale.", location: "Anuradhapura" },
                    { day: 3, title: "Anuradhapura – Aukana – Sigiriya", description: "Visit the massive Aukana Buddha statue.", location: "Sigiriya" },
                    { day: 4, title: "Sigiriya – Dambulla – Kandy", description: "Visit the Golden Temple and Cave complex.", location: "Kandy" },
                    { day: 5, title: "Kandy City", description: "Temple of the Tooth Relic and meditation centers.", location: "Kandy" },
                    { day: 6, title: "Kandy – Colombo", description: "Travel to Colombo; visit Kelaniya and Gangarama Temples.", location: "Colombo" },
                    { day: 7, title: "Colombo – Airport", description: "Departure transfer." }
                ],
                inclusions: standardInclusions,
                exclusions: standardExclusions,
                notSuitableFor: standardNotSuitable,
                notAllowed: standardNotAllowed
            },
            {
                title: "12 Days | 11 Nights Sri Lanka Culture Nature Tour",
                slug: "12-days-11-nights-sri-lanka-culture-nature-tour",
                category: "tour-package",
                price: { amount: 750, currency: "USD" },
                duration: "12 Days",
                itinerary: [
                    { day: 1, title: "Cultural Triangle", description: "Covering Anuradhapura ruins.", location: "Anuradhapura" },
                    { day: 2, title: "Cultural Triangle", description: "Exploring Polonnaruwa.", location: "Polonnaruwa" },
                    { day: 3, title: "Cultural Triangle", description: "Sigiriya Lion Rock climb.", location: "Sigiriya" },
                    { day: 4, title: "Eastern Coast", description: "Relaxation in Trincomalee.", location: "Trincomalee" },
                    { day: 5, title: "Eastern Coast", description: "Marine activities and relaxation.", location: "Trincomalee" },
                    { day: 6, title: "Hill Country", description: "Kandy city tour and Temple of the Tooth.", location: "Kandy" },
                    { day: 7, title: "Hill Country", description: "Peradeniya Botanical Gardens.", location: "Kandy" },
                    { day: 8, title: "Tea Highlands & Ella", description: "Tea factory visits in Nuwara Eliya.", location: "Nuwara Eliya" },
                    { day: 9, title: "Ella", description: "Train journey to Ella for the Nine Arches Bridge.", location: "Ella" },
                    { day: 10, title: "Wildlife Safari", description: "Afternoon Jeep safari in Yala National Park.", location: "Yala" },
                    { day: 11, title: "Southern Coast", description: "Visit Galle Dutch Fort and Unawatuna/Mirissa.", location: "Galle" },
                    { day: 12, title: "Colombo – Airport", description: "City tour and final transfer." }
                ],
                inclusions: standardInclusions,
                exclusions: standardExclusions,
                notSuitableFor: standardNotSuitable,
                notAllowed: standardNotAllowed
            }
        ];

        for (const pkg of tourPackages) {
            console.log(`Updating ${pkg.title}...`);
            await Tour.findOneAndUpdate(
                { slug: pkg.slug },
                { $set: pkg },
                { upsert: true, new: true }
            );
        }

        console.log('Seeding complete');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
}

seedTourPackages();
