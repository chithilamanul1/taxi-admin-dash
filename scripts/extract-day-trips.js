const mongoose = require('mongoose');

// Schema fallback
const TourSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    category: { type: String, default: 'day-trip' },
    price: mongoose.Schema.Types.Mixed,
    currency: { type: String, default: 'USD' },
    duration: mongoose.Schema.Types.Mixed,
    highlights: [String],
    inclusions: [String],
    exclusions: [String],
    experience: [{ heading: String, text: String }],
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

async function seedDayTrips() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const dayTrips = [
            {
                title: "Galle and Bentota Day-Tour (From Colombo)",
                slug: "galle-and-bentota-day-tour-from-colombo",
                category: "day-trip",
                description: "This is a coastal journey focusing on marine life, colonial history, and river ecosystems.",
                inclusions: ["Private air-conditioned vehicle", "Professional English-speaking driver/guide", "Fuel", "Highway tolls", "All parking fees"],
                exclusions: ["Entrance tickets (Turtle farm, Boat safari)", "Meals/drinks", "Personal tips"],
                experience: [
                    { heading: "Madu Ganga", text: "A 105-minute boat cruise through mangrove forests, including a visit to a cinnamon island and fish therapy." },
                    { heading: "Kosgoda Turtle Conservation", text: "A 45-minute visit to see various species of sea turtles and learn about conservation." },
                    { heading: "Galle Fort", text: "A 1-hour walk through the 17th-century Dutch fortification, exploring its narrow streets, lighthouse, and museum." },
                    { heading: "Hikkaduwa Beach", text: "A 30-minute stop for beach views." }
                ],
                notSuitableFor: ["People with severe motion sickness (boat ride and coastal driving)", "Individuals with extreme mobility issues (Galle Fort has uneven cobblestone paths)"],
                notAllowed: []
            },
            {
                title: "Kandy, Pinnawala & Royal Gardens (From Colombo)",
                slug: "kandy-pinnawala-royal-gardens-from-colombo",
                category: "day-trip",
                description: "A cultural and nature-heavy trip into the hill capital of Sri Lanka.",
                inclusions: ["A/C Private transport", "Driver-guide", "Bottled water", "Parking", "All local taxes/tolls"],
                exclusions: ["Entrance fees for all sites", "Lunch"],
                experience: [
                    { heading: "Pinnawala", text: "Observation of elephant bathing and feeding at the orphanage." },
                    { heading: "Peradeniya Royal Botanical Gardens", text: "A visit to the largest botanical gardens in the country, famous for its orchid collection." },
                    { heading: "Temple of the Tooth Relic", text: "A 10-hour total trip focus including the sacred temple and a Kandy city sightseeing tour." }
                ],
                notSuitableFor: ["Small children/Infants (Due to the 13-hour duration and long drive)", "Those unable to walk long distances (The Botanical Gardens are massive)"],
                notAllowed: []
            },
            {
                title: "Sigiriya & Dambulla Day Trip with Safari (From Colombo)",
                slug: "sigiriya-dambulla-day-trip-with-safari-from-colombo",
                category: "day-trip",
                description: "The 'Big Three' of central Sri Lanka: Rock fortress, Cave temples, and Wild elephants.",
                inclusions: ["Pick-up/Drop-off", "Private transport", "English-speaking driver", "Fuel"],
                exclusions: ["All entrance fees (Sigiriya, Dambulla, Safari Jeep & Park entrance)"],
                experience: [
                    { heading: "Dambulla Cave Temple", text: "A 1-hour tour of the UNESCO cave complex with ancient statues and murals." },
                    { heading: "Sigiriya Lion Rock", text: "A 2-hour guided climb of the world-famous rock fortress." },
                    { heading: "Hiriwadunna Village", text: "A 2-hour stop for a traditional village lunch and food tasting." },
                    { heading: "Wildlife Safari", text: "2 hours of wildlife viewing (usually Minneriya or Kaudulla Park)." }
                ],
                notSuitableFor: ["People with heart conditions or respiratory issues (the Sigiriya climb is 1,200 steps)", "Pregnant women (the safari jeep portion is very bumpy and off-road)", "People with back problems"],
                notAllowed: []
            },
            {
                title: "Sigiriya, Dambulla & Minneriya Day Trip (From Negombo)",
                slug: "sigiriya-dambulla-minneriya-day-trip-from-negombo",
                category: "day-trip",
                description: "Similar to the Colombo version but optimized for those staying near the airport/Negombo.",
                inclusions: ["Private A/C vehicle", "Driver-guide", "Highway charges"],
                exclusions: ["Tickets for the Rock (~$30)", "Temple (~$10)", "Safari (approx $50-60 depending on group size)"],
                experience: [
                    { heading: "Sunrise Sigiriya", text: "Often starts very early to reach Sigiriya for cooler climbing temperatures." },
                    { heading: "Minneriya National Park", text: "A 4-hour extensive game drive focusing on the 'Elephant Gathering'." },
                    { heading: "Golden Temple Dambulla", text: "A 1.5-hour visit to the rock temple." }
                ],
                notSuitableFor: ["Those who dislike early starts (requires a 4:00 AM or 5:00 AM pickup)", "People with vertigo/fear of heights (Sigiriya stairs)"],
                notAllowed: []
            },
            {
                title: "Ambuluwawa Tower & Tea Factory (From Negombo)",
                slug: "ambuluwawa-tower-tea-factory-from-negombo",
                category: "day-trip",
                description: "A unique trip focusing on high-altitude views and Sri Lankan tea culture.",
                inclusions: ["Private transport", "Driver-guide", "Fuel", "Tolls"],
                exclusions: ["Entrance fees to Ambuluwawa Tower", "Any meals"],
                experience: [
                    { heading: "Ambuluwawa Tower", text: "Climbing the multi-religious spiral tower for breathtaking panoramic views of the central highlands." },
                    { heading: "Tea Factory", text: "A guided walk-through of the tea making process, from leaf plucking to the final brew." },
                    { heading: "Kandy Sightseeing", text: "Quick stops at the Kandy Lake and city center." }
                ],
                notSuitableFor: ["People with Acrophobia (Fear of Heights)", "Elderly with mobility issues (The climb is narrow and steep)"],
                notAllowed: []
            },
            {
                title: "Colombo Private Day Tour & Shopping",
                slug: "colombo-private-day-tour-shopping",
                category: "day-trip",
                description: "A busy, high-energy urban tour through the heart of Sri Lanka's capital.",
                duration: "24 Hours",
                experience: [
                    { heading: "Culture & History", text: "Visits to Independence Square (40 mins), Gangaramaya Temple (30 mins), the Old Parliament House, and the Colombo Lighthouse." },
                    { heading: "Architecture", text: "Photo stops at the unique Jami Ul-Alfar Mosque (Red Mosque) and the Old Town Hall." },
                    { heading: "Modern Landmarks", text: "A visit to the Colombo Lotus Tower (20 mins)." },
                    { heading: "Shopping", text: "1 hour dedicated to shopping in Colombo’s major malls or markets." }
                ],
                inclusions: ["Private A/C vehicle", "English-speaking driver", "Pickup from multiple locations (Colombo, Negombo, Kandy, Galle, etc.)", "Fuel"],
                exclusions: ["Entrance fees (Lotus Tower, Temples)", "Lunch", "Personal shopping expenses"],
                notSuitableFor: ["Those looking for a quiet nature retreat"]
            },
            {
                title: "From Negombo: Southern Coast Highlights Private Day Tour",
                slug: "from-negombo-southern-coast-highlights-private-day-tour",
                category: "day-trip",
                description: "Explore the best of the southern coast starting from Negombo.",
                duration: "12 Hours",
                experience: [
                    { heading: "Tea Culture", text: "A 2-hour guided tour of the Handunugoda Tea Estate (famous for Virgin White Tea)." },
                    { heading: "Coastal Life", text: "A photo stop in Ahangama to see the stilt fishermen." },
                    { heading: "Colonial Heritage", text: "A 2-hour guided tour of the UNESCO-listed Galle Fort." },
                    { heading: "Wildlife", text: "A visit to the Kosgoda Turtle Conservation and Research Centre (1 hour)." }
                ],
                inclusions: ["Pickup/Drop-off in Negombo", "Private transport", "Professional driver/guide"],
                exclusions: ["Lunch (30 mins allotted in Galle)", "Entrance tickets for the Turtle Centre or Tea Estate museum fees"],
                notSuitableFor: ["People who find long coastal drives tiring"]
            },
            {
                title: "Kandy: Sigiriya Rock and Dambulla Cave Temple Day Tour",
                slug: "kandy-sigiriya-rock-dambulla-cave-temple-day-tour",
                category: "day-trip",
                description: "A historical exploration of Sigiriya and Dambulla starting from Kandy.",
                duration: "24 Hours",
                experience: [
                    { heading: "Ancient Rock Fortress", text: "A 2.5-hour visit to Sigiriya Lion Rock for sightseeing and historical exploration." },
                    { heading: "Religious Heritage", text: "A 2-hour tour of the Dambulla Royal Cave Temple and Golden Temple." },
                    { heading: "Scenic Drive", text: "3.5 hours of travel each way with scenic views of the Sri Lankan countryside." }
                ],
                inclusions: ["Transport from Kandy", "Driver/guide", "All highway/parking fees"],
                exclusions: ["Entrance tickets (approx. $30 for Sigiriya, $10 for Dambulla)"],
                notSuitableFor: ["People with heart conditions or knee problems, as climbing Sigiriya is physically demanding"]
            },
            {
                title: "Kandy City Tours",
                slug: "kandy-city-tours",
                category: "day-trip",
                description: "Explore the spiritual and artistic heritage of Kandy.",
                duration: "8 Hours",
                experience: [
                    { heading: "Spiritual Sites", text: "Visit the Temple of the Sacred Tooth Relic (2 hours) and the Bahirawakanda Big Buddha Temple (1 hour)." },
                    { heading: "Local Crafts", text: "A 2-hour stop at a Batik Factory and Gem Museum for shopping and sightseeing." },
                    { heading: "Nature", text: "Sightseeing around the Kandy Lake and city center." }
                ],
                inclusions: ["Private transport within Kandy", "Driver-guide", "Pickup/drop-off"],
                exclusions: ["Entry permits for the Tooth Temple and other attractions", "Meals"],
                notSuitableFor: ["Visitors who do not wish to comply with temple dress codes"]
            },
            {
                title: "From Sigiriya: Anuradhapura UNESCO City Day Tour and Safari",
                slug: "from-sigiriya-anuradhapura-unesco-city-day-tour-safari",
                category: "day-trip",
                description: "A combination of ancient ruins and wildlife safari.",
                duration: "12 Hours",
                experience: [
                    { heading: "Wildlife", text: "A 3-hour game drive in Minneriya National Park to see wild elephants." },
                    { heading: "Ancient Ruins", text: "A 3-hour guided tour of Anuradhapura, the first capital of Sri Lanka." },
                    { heading: "Village Life", text: "A lunch break in Habarana (30 mins)." }
                ],
                inclusions: ["Pickup from Sigiriya", "Private A/C transport", "Driver/guide"],
                exclusions: ["Safari Jeep hire", "National Park entrance fees", "Anuradhapura ancient site tickets"],
                notSuitableFor: ["Pregnant women or those with back injuries due to the bumpy safari terrain"]
            },
            {
                title: "From Dambulla: Sigiriya Rock & Ancient City of Polonnaruwa",
                slug: "from-dambulla-sigiriya-rock-ancient-city-polonnaruwa",
                category: "day-trip",
                description: "A power-packed historical tour connecting the two most iconic kingdoms.",
                experience: [
                    { heading: "Polonnaruwa Ancient City", text: "A deep dive into the 11th-century ruins, including the Royal Palace and Gal Vihara." },
                    { heading: "Sigiriya Lion Rock", text: "A guided climb to the summit to see the 5th-century palace ruins and frescoes." },
                    { heading: "Sigiriya Frescoes", text: "A specific photo stop and visit to the world-renowned ancient paintings." }
                ],
                inclusions: ["Private A/C transport", "Driver/guide", "Fuel"],
                exclusions: ["Entrance tickets for Sigiriya and Polonnaruwa", "Meals"],
                notSuitableFor: ["People with severe knee or joint pain", "Those with heat sensitivity"]
            },
            {
                title: "From Sigiriya: Polonnaruwa Ancient City Tour | Day Tour",
                slug: "from-sigiriya-polonnaruwa-ancient-city-tour-day-tour",
                category: "day-trip",
                description: "A focused exploration of the ruins of Polonnaruwa.",
                experience: [
                    { heading: "Archaeological Exploration", text: "5 to 8 hours dedicated exclusively to the ruins of Polonnaruwa." },
                    { heading: "Flexibility", text: "Includes free time to explore specific ruins at your own pace." }
                ],
                inclusions: ["Private transport", "Driver-guide", "Pickup/drop-off"],
                exclusions: ["All entrance fees and lunch"],
                notSuitableFor: ["Small children who may find extensive historical ruins tiring"]
            },
            {
                title: "Polonnaruwa Ancient City Tour with Minneriya Elephant Safari",
                slug: "polonnaruwa-ancient-city-tour-with-minneriya-elephant-safari",
                category: "day-trip",
                description: "A 'Culture & Wild' combination balancing ancient history with wildlife adventure.",
                experience: [
                    { heading: "Morning History", text: "Exploring the ancient city of Polonnaruwa." },
                    { heading: "Afternoon Safari", text: "A 3-hour game drive in Minneriya National Park." }
                ],
                inclusions: ["A full-day logistics package including private transport and guide service"],
                exclusions: ["Entrance fees to Polonnaruwa; National Park entrance fees and Safari Jeep rental"],
                notSuitableFor: ["Pregnant women", "People with chronic back or neck issues"]
            },
            {
                title: "Kandy to Sigiriya, Dambulla & Minneriya Park Safari Day Tour",
                slug: "kandy-sigiriya-dambulla-minneriya-park-safari-day-tour",
                category: "day-trip",
                description: "A very long, high-value day trip covering three major attractions.",
                experience: [
                    { heading: "Sigiriya Lion Rock", text: "Climbing the fortress (2.5 hours)." },
                    { heading: "Minneriya National Park", text: "A 4-hour wildlife viewing session." },
                    { heading: "Dambulla Cave Temple", text: "A 1.5-hour visit to the cave complex." }
                ],
                inclusions: ["Long-distance private transport from Kandy and back; driver-guide"],
                exclusions: ["All site entrance fees"],
                notSuitableFor: ["People who dislike long drives", "Individuals with low stamina"]
            },
            {
                title: "Kandy City Tours (Short Version/8 Hours)",
                slug: "kandy-city-tours-short-version",
                category: "day-trip",
                description: "A focused exploration of the hill capital's spiritual and artistic heritage.",
                duration: "8 Hours",
                experience: [
                    { heading: "Bahirawakanda Temple", text: "Visiting the giant white Buddha statue overlooking the city." },
                    { heading: "Gem Museum & Batik Factory", text: "Learning about blue sapphires and traditional textile arts." },
                    { heading: "Temple of the Sacred Tooth Relic", text: "The primary religious site in Sri Lanka." }
                ],
                inclusions: ["Local transport within Kandy; driver/guide"],
                exclusions: ["Temple entrance fees and personal shopping"],
                notSuitableFor: ["Visitors who prefer to avoid commercial stops"]
            },
            {
                title: "Kitulgala White Water Rafting Adventure (From Colombo/Negombo)",
                slug: "kitulgala-white-water-rafting-adventure-from-colombo-negombo",
                category: "day-trip",
                description: "A high-energy day trip for adrenaline seekers in the Kelani River.",
                experience: [
                    { heading: "White Water Rafting", text: "A 5km stretch of the Kelani River with 5 major rapids and 4 minor rapids." },
                    { heading: "Confidence Jump & Stream Sliding", text: "Optional activities in the natural rock pools." },
                    { heading: "Scenery", text: "Visit the filming location of 'The Bridge on the River Kwai'." }
                ],
                inclusions: ["Private A/C transport", "English-speaking driver", "Highway tolls"],
                exclusions: ["Rafting gear rental and instructor fees", "Lunch"],
                notSuitableFor: ["Children under 6", "Non-swimmers", "Pregnant women", "Heart conditions"]
            },
            {
                title: "Nuwara Eliya 'Little England' Day Tour (From Kandy)",
                slug: "nuwara-eliya-little-england-day-tour-from-kandy",
                category: "day-trip",
                description: "A scenic ascent into the hill country, famous for waterfalls and tea.",
                experience: [
                    { heading: "Ramboda Falls", text: "A stop at one of the highest waterfalls in Sri Lanka." },
                    { heading: "Tea Plantation visit", text: "Tour a working tea factory." },
                    { heading: "Gregory Lake", text: "Relaxing by the lake and Victoria Park." },
                    { heading: "Nuwara Eliya Post Office", text: "Visit the iconic red-brick colonial building." }
                ],
                inclusions: ["Private vehicle", "Driver-guide", "Pickup/drop-off"],
                exclusions: ["Boat rides at Gregory Lake and lunch"],
                notSuitableFor: ["People with severe motion sickness"]
            },
            {
                title: "Ella Highlights Day Trip (From Kandy/Nuwara Eliya)",
                slug: "ella-highlights-day-trip-from-kandy-nuwara-eliya",
                category: "day-trip",
                description: "A long but visually stunning day focusing on the most 'Instagrammable' spots.",
                experience: [
                    { heading: "Nine Arches Bridge", text: "Walking on the iconic colonial-era viaduct." },
                    { heading: "Little Adam's Peak", text: "An easy 1-hour hike for panoramic views." },
                    { heading: "Ravana Falls", text: "A quick stop at the legendary waterfall." }
                ],
                inclusions: ["Private transport and driver-guide"],
                exclusions: ["Meals and personal expenses"],
                notSuitableFor: ["Elderly with mobility issues", "Those who dislike long travel times"]
            },
            {
                title: "Udawalawe National Park Safari (From Southern Hotels/Galle)",
                slug: "udawalawe-national-park-safari-from-southern-hotels-galle",
                category: "day-trip",
                description: "Guaranteed wild elephant sightings and the Elephant Transit Home.",
                experience: [
                    { heading: "Jeep Safari", text: "3 hours exploring the park, which is less crowded than Yala." },
                    { heading: "Elephant Transit Home", text: "Watch baby elephants being fed." }
                ],
                inclusions: ["A/C Private transport to and from the park"],
                exclusions: ["Safari Jeep rental and Park entrance fees"],
                notSuitableFor: ["Pregnant women", "Chronic back pain"]
            },
            {
                title: "Mirissa Whale Watching Day Trip (From Galle/Bentota)",
                slug: "mirissa-whale-watching-day-trip-from-galle-bentota",
                category: "day-trip",
                description: "A deep-sea excursion to see the world's largest mammals.",
                experience: [
                    { heading: "Whale Watching", text: "3–5 hours on a boat to spot Blue Whales and Dolphins." },
                    { heading: "Coconut Tree Hill", text: "Visit the famous cliffside in Mirissa." }
                ],
                inclusions: ["Transport to the Mirissa harbor and back"],
                exclusions: ["Boat ticket and breakfast/lunch"],
                notSuitableFor: ["Severe seasickness", "Small children"]
            },
            {
                title: "Negombo Lagoon & Dutch Canal Boat Tour",
                slug: "negombo-lagoon-dutch-canal-boat-tour",
                category: "day-trip",
                description: "Exploring the traditional fishing life and coastal ecology of Negombo.",
                experience: [
                    { heading: "Negombo Lagoon", text: "A boat safari to see traditional canoes and birdlife." },
                    { heading: "Dutch Canal", text: "A scenic cruise through the historic colonial canal." },
                    { heading: "Monkey Island", text: "A brief stop at an island with resident monkeys." }
                ],
                inclusions: ["Private boat hire", "English-speaking guide/boatman", "Life jackets"],
                exclusions: ["Meals, personal expenses, and tips"],
                notSuitableFor: []
            },
            {
                title: "Hikkaduwa Glass Bottom Boat & Snorkeling",
                slug: "hikkaduwa-glass-bottom-boat-snorkeling",
                category: "day-trip",
                description: "Explore the Hikkaduwa Marine National Park coral reefs.",
                experience: [
                    { heading: "Coral Sanctuary", text: "Viewing 70+ varieties of coral and tropical fish." },
                    { heading: "Snorkeling", text: "A guided session to see sea turtles and vibrant marine life." }
                ],
                inclusions: ["Glass-bottom boat hire", "Snorkeling equipment", "Professional instructor"],
                exclusions: ["Transport to meeting point, food"],
                notSuitableFor: ["Sea-sickness", "Severe sun sensitivity"]
            },
            {
                title: "Horton Plains & World's End Trek (From Nuwara Eliya)",
                slug: "horton-plains-worlds-end-trek-from-nuwara-eliya",
                category: "day-trip",
                description: "A high-altitude nature trek in a montane forest.",
                experience: [
                    { heading: "World's End", text: "A sheer precipice with an 870m drop." },
                    { heading: "Baker's Falls", text: "A scenic waterfall within the park." },
                    { heading: "Wildlife", text: "Potential sightings of Sambar deer." }
                ],
                inclusions: ["Transport from Nuwara Eliya and back, driver-guide"],
                exclusions: ["National Park entry permit and meals"],
                notSuitableFor: ["Heart conditions", "Severe respiratory issues"]
            },
            {
                title: "Ratnapura 'City of Gems' Day Tour (From Colombo)",
                slug: "ratnapura-city-of-gems-day-tour-from-colombo",
                category: "day-trip",
                description: "A specialized cultural tour to the heart of gem mining.",
                experience: [
                    { heading: "Gem Mining Site", text: "Watching traditional gem pits and mining process." },
                    { heading: "Gem Museum", text: "Learn about the cutting and polishing process." },
                    { heading: "Bopath Ella Waterfall", text: "A scenic stop at a heart-shaped waterfall." }
                ],
                inclusions: ["Private A/C transport, driver-guide, bottled water"],
                exclusions: ["Entrance fees and lunch"],
                notSuitableFor: ["Long, hilly drives"]
            },
            {
                title: "Kalutara Bodhiya & Richmond Castle (From Bentota/Beruwala)",
                slug: "kalutara-bodhiya-richmond-castle-from-bentota-beruwala",
                category: "day-trip",
                description: "Combining religious significance with colonial architecture.",
                experience: [
                    { heading: "Kalutara Bodhiya", text: "The world's only hollow Buddhist stupa." },
                    { heading: "Richmond Castle", text: "A majestic 19th-century colonial mansion." }
                ],
                inclusions: ["Pickup/drop-off and private transport"],
                exclusions: ["Entrance tickets and gratuities"],
                notSuitableFor: []
            },
            {
                title: "Sinharaja Rain Forest Trekking (From Galle/Bentota)",
                slug: "sinharaja-rain-forest-trekking-from-galle-bentota",
                category: "day-trip",
                description: "Deep dive into a primary tropical rainforest (UNESCO).",
                experience: [
                    { heading: "Guided Trek", text: "3-to-5-hour trek with a specialized forest guide." },
                    { heading: "Endemic Wildlife", text: "Blue Magpies and unique reptiles." },
                    { heading: "Waterfalls", text: "Hidden natural springs and waterfalls." }
                ],
                inclusions: ["Private transport, forest guide, leeches socks"],
                exclusions: ["Entrance permit fees and lunch"],
                notSuitableFor: ["Extreme entomophobia (insects) or leeches", "Severe respiratory issues", "Very young children"]
            },
            {
                title: "Jaffna Day Tour (From Anuradhapura)",
                slug: "jaffna-day-tour-from-anuradhapura",
                category: "day-trip",
                description: "Exploring the distinct cultural landscape of the North.",
                experience: [
                    { heading: "Nallur Kandaswamy Kovil", text: "Golden Hindu temple architecture." },
                    { heading: "Jaffna Fort", text: "Star-shaped fort built by the Portuguese/Dutch." },
                    { heading: "Casuarina Beach", text: "Shallow and clear Northern beach." }
                ],
                inclusions: ["Private A/C vehicle for long-distance", "Professional driver"],
                exclusions: ["Boat tickets and meals"],
                notSuitableFor: ["Extremely long travel times", "Intense dry heat"]
            },
            {
                title: "Wilpattu National Park Safari (From Negombo/Colombo)",
                slug: "wilpattu-national-park-safari-from-negombo-colombo",
                category: "day-trip",
                description: "A 'Wilderness-first' safari in Sri Lanka's largest park.",
                experience: [
                    { heading: "Leopard Spotting", text: "World-renowned leopard population in the 'Villu' ecosystem." },
                    { heading: "Bird Watching", text: "Painted storks and various eagles." },
                    { heading: "The 'Villus'", text: "Scenic picnic stops near natural natural lakes." }
                ],
                inclusions: ["Transport to park gates, English-speaking driver, tolls"],
                exclusions: ["Safari Jeep rental and National Park entrance fees"],
                notSuitableFor: ["Pregnant women", "Chronic back pain"]
            }
        ];

        for (const trip of dayTrips) {
            console.log(`Updating ${trip.title}...`);
            await Tour.findOneAndUpdate(
                { slug: trip.slug },
                { $set: trip },
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

seedDayTrips();
