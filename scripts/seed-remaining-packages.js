const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb+srv://chithilamanul1_db_user:chithila123@taxiadmindash.l9tttdj.mongodb.net/?appName=taxiadmindash';

const tourSchema = new mongoose.Schema({
    title: String,
    slug: String,
    category: String,
    duration: { days: Number, nights: Number },
    description: String,
    price: { amount: Number, currency: String, type: { type: String } },
    inclusions: [String],
    exclusions: [String],
    experience: [{ heading: String, text: String }],
    itinerary: [{ day: Number, title: String, description: String }],
    notSuitableFor: [String],
    notAllowed: [String],
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Tour = mongoose.models.Tour || mongoose.model('Tour', tourSchema);

const packagesData = [
    {
        "title": "07 Days | 06 Nights Buddhist Cultural Tour",
        "slug": "07-days-06-nights-buddhist-cultural-tour",
        "category": "tour-package",
        "duration": { "days": 7, "nights": 6 },
        "description": "A spiritual journey through Sri Lanka's most sacred Buddhist sites, including Anuradhapura, Polonnaruwa, Sigiriya, and Kandy.",
        "inclusions": [
            "Meeting at the airport upon arrival and assistance during the stay",
            "Transportation by air-conditioned vehicle according to the itinerary.",
            "Service of an English Speaking chauffer up to 6 pax and Guide service included from 7 pax onwards",
            "Accommodation at the Hotels as selected by you on Single, Double/Twin, Triple sharing",
            "Meal plan: Half Board (Breakfast and Dinner included)",
            "Two water bottles per day during tour"
        ],
        "exclusions": [
            "International Air Fare",
            "Peak period supplements",
            "Entrance fees to parks and archaeological sites",
            "Jeep charges, boat charges not mentioned",
            "Permits for photos / videos, tips and extras",
            "Optional excursions and additional services",
            "PCR, ETA and Travel Insurance payment",
            "Early check-in and late check-out"
        ],
        "notSuitableFor": ["Back problems", "Insect allergies", "Cold", "Kidney problems", "Recent surgeries", "Motion sickness"],
        "notAllowed": ["Pets", "Explosive substances", "Nudity", "Fireworks", "Alcohol and drugs", "Drones"],
        "itinerary": [
            { "day": 1, "title": "Negombo Arrival", "description": "Greeting at airport, transfer to Negombo. Evening sightseeing including Angurukaramulla Temple. Overnight Negombo." },
            { "day": 2, "title": "Anuradhapura", "description": "Leave for Anuradhapura, the first capital of Sri Lanka (4th century BC). Visit Ruwanveliseya, Abhayagiri, and Jetavana. Overnight Anuradhapura." },
            { "day": 3, "title": "Sigiriya & Mihintale", "description": "Visit Mihintale en-route to Sigiriya. Climb the 5th-century Sigiriya Rock Fortress in the evening. Overnight Sigiriya." },
            { "day": 4, "title": "Polonnaruwa", "description": "Explore the medieval capital Polonnaruwa, including Gal Vihare and Parakrama Samudraya. Optional safari at Minneriya. Overnight Sigiriya." },
            { "day": 5, "title": "Kandy", "description": "Visit Dambulla Cave Temple and Aluvihare Rock Temple. In Kandy, visit the Temple of the Tooth and enjoy a cultural dance. Overnight Kandy." },
            { "day": 6, "title": "Kandy - Colombo", "description": "Visit Lankathilake, Gadaladeniya, and Pinnawala Elephant Orphanage. Evening in Colombo. Overnight Colombo." },
            { "day": 7, "title": "Colombo - Departure", "description": "Colombo City tour (Galle Face, National Museum, Shopping). Transfer to airport for departure." }
        ]
    },
    {
        "title": "10 Days | 09 Nights Ramayana Trail Tour",
        "slug": "10-days-09-nights-ramayana-trail-tour",
        "category": "tour-package",
        "duration": { "days": 10, "nights": 9 },
        "description": "Follow the legendary Ramayana trail through Sri Lanka, visiting significant sites from the ancient epic.",
        "inclusions": [
            "Meeting at the airport upon arrival and assistance",
            "Transportation by private AC vehicle",
            "Professional chauffeur-guide service",
            "Half Board accommodation (Breakfast & Dinner)",
            "Two water bottles per day"
        ],
        "exclusions": ["International flights", "Entrance fees to temples", "Lunch and personal expenses"],
        "itinerary": [
            { "day": 1, "title": "Negombo", "description": "Arrival and transfer to Negombo. Overnight stay." },
            { "day": 2, "title": "Chilaw & Trincomalee", "description": "Visit Munneswaram & Manavari Temple (Chilaw), then Koneswaram Temple (Trincomalee). Overnight Trincomalee." },
            { "day": 3, "title": "Trincomalee", "description": "Visit Shankari Devi Peetham, Nilaveli Beach, and Pigeon Island. Overnight Trincomalee." },
            { "day": 4, "title": "Kandy", "description": "Visit Dambulla Cave Temple and Temple of the Tooth in Kandy. Overnight Kandy." },
            { "day": 5, "title": "Nuwara Eliya", "description": "Visit Hanuman Temple (Ramboda) and Gayathri Peedam (Nuwara Eliya). Overnight Nuwara Eliya." },
            { "day": 6, "title": "Nuwara Eliya", "description": "Visit Seetha Amman Temple, Ashoka Vatika, and Divurumpola. Overnight Nuwara Eliya." },
            { "day": 7, "title": "Ella", "description": "Visit Ravana Falls & Cave. Overnight stays in Bandarawela/Ella area." },
            { "day": 8, "title": "Kataragama & Galle", "description": "Visit Kataragama Temple and transfer to Galle. Overnight Galle." },
            { "day": 9, "title": "Galle & Colombo", "description": "Explore Galle Fort and visit Kelaniya Temple in Colombo. Overnight Colombo." },
            { "day": 10, "title": "Departure", "description": "Colombo City Tour (Anjaneyar Temple) and airport transfer." }
        ]
    },
    {
        "title": "05 Days | 04 Nights - Kandy, Nuwara Eliya, Bentota, Colombo",
        "slug": "05-days-04-nights-kandy-nuwara-eliya-bentota-colombo",
        "category": "tour-package",
        "duration": { "days": 5, "nights": 4 },
        "description": "A short and sweet tour covering the essential highlights of Sri Lanka: Kandy, the tea country, and the southern beaches.",
        "inclusions": ["AC vehicle with English speaking chauffeur", "Half Board meals", "Airport assistance", "Mineral water"],
        "itinerary": [
            { "day": 1, "title": "Kandy", "description": "Airport to Kandy. Visit Pinnawala Elephant Orphanage and Temple of the Tooth. Overnight Kandy." },
            { "day": 2, "title": "Nuwara Eliya", "description": "Visit Peradeniya Botanical Garden and a Tea Factory in Nuwara Eliya. Overnight Nuwara Eliya." },
            { "day": 3, "title": "Bentota", "description": "Visit Gregory Lake and proceed to Bentota beach. Overnight Bentota." },
            { "day": 4, "title": "Colombo", "description": "Madu River Safari, Turtle Hatchery, then transfer to Colombo. Overnight Colombo." },
            { "day": 5, "title": "Departure", "description": "Colombo City Tour and airport transfer." }
        ]
    },
    {
        "title": "10 Days - Nature, Culture & East Coast",
        "slug": "10-days-nature-culture-east-coast",
        "category": "tour-package",
        "duration": { "days": 10, "nights": 9 },
        "description": "A perfect blend of culture, nature, and relaxation on the pristine beaches of Trincomalee.",
        "itinerary": [
            { "day": 1, "title": "Negombo", "description": "Arrival and transfer to Negombo. Overnight stay." },
            { "day": 2, "title": "Trincomalee", "description": "Transfer to Nilaveli Beach in Trincomalee. Overnight Trincomalee." },
            { "day": 3, "title": "Trincomalee", "description": "Visit Koneswaram Temple and enjoy Nilaveli beach. Overnight Trincomalee." },
            { "day": 4, "title": "Sigiriya", "description": "Visit Polonnaruwa ancient city and Sigiriya Rock Fortress. Overnight Sigiriya." },
            { "day": 5, "title": "Kandy", "description": "Visit Dambulla Cave Temple, Spice Garden, and Temple of the Tooth. Overnight Kandy." },
            { "day": 6, "title": "Kandy", "description": "Visit Peradeniya Botanical Garden and enjoy Kandy shopping. Overnight Kandy." },
            { "day": 7, "title": "Colombo", "description": "Visit Pinnawala Elephant Orphanage and Colombo City Tour. Overnight Colombo." },
            { "day": 8, "title": "Galle Day Trip", "description": "Full day trip to Galle Fort and Turtle Hatchery. Overnight Colombo." },
            { "day": 9, "title": "Negombo", "description": "Leisure in Colombo, then transfer to Negombo for final night." },
            { "day": 10, "title": "Departure", "description": "Transfer to Airport." }
        ]
    }
];

// Reusing shared safety and lists
const sharedSafety = {
    notSuitableFor: ["Back problems", "Insect allergies", "Pregnant women", "Wheelchair users", "Recent surgeries", "Motion sickness", "Animal allergies", "Cold / Kidney problems"],
    notAllowed: ["Pets", "Explosive substances", "Nudity", "Fireworks", "Alcohol and drugs", "Drones", "Glass objects", "Drinks in the vehicle", "Making noise", "Touching / Feeding animals"]
};

async function seed() {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected!');

    for (const data of packagesData) {
        const tourData = {
            ...data,
            notSuitableFor: data.notSuitableFor || sharedSafety.notSuitableFor,
            notAllowed: data.notAllowed || sharedSafety.notAllowed,
            price: data.price || { amount: 450, currency: 'USD', type: 'from' },
            isActive: true
        };

        await Tour.findOneAndUpdate({ slug: data.slug }, { $set: tourData }, { upsert: true });
        console.log(`Upserted: ${data.title}`);
    }

    // Also adding the 3 remaining ones that weren't in the array yet
    const extraPackages = [
        {
            title: "08 Days Tour - Kandy, Nuwara Eliya & Bentota",
            slug: "08-days-tour-kandy-nuwara-eliya-bentota",
            category: "tour-package",
            duration: { days: 8, nights: 7 },
            description: "A classic week-long tour covering the cultural heart and beautiful beaches of Sri Lanka.",
            itinerary: [
                { day: 1, title: "Negombo", description: "Arrival and transfer to Negombo." },
                { day: 2, title: "Kandy", description: "Visit Pinnawala and Temple of the Tooth. Evening dance show. Overnight Kandy." },
                { day: 3, title: "Nuwara Eliya", description: "Botanical Garden, Tea Factory, and waterfalls. Overnight Nuwara Eliya." },
                { day: 4, title: "Bentota", description: "Gregory Lake and Kitulgala (white water rafting) en route to Bentota. Overnight Bentota." },
                { day: 5, title: "Bentota", description: "Leisure at Bentota beach. Overnight Bentota." },
                { day: 6, title: "Bentota", description: "Leisure at Bentota beach. Overnight Bentota." },
                { day: 7, title: "Galle Day Trip", description: "Madu River Safari, Turtle Hatchery, and Galle Fort. Overnight Bentota." },
                { day: 8, title: "Departure", description: "Transfer to Airport." }
            ]
        },
        {
            title: "Sri Lanka Classic & Northern Tour -10 Days | 09 Nights",
            slug: "sri-lanka-classic-northern-tour-10-days-09-nights",
            category: "tour-package",
            duration: { days: 10, nights: 9 },
            description: "Explore the ancient ruins and distinct culture of Northern Sri Lanka.",
            itinerary: [
                { day: 1, title: "Negombo", description: "Arrival and transfer. Overnight Negombo." },
                { day: 2, title: "Anuradhapura", description: "Explore the ancient city ruins of Anuradhapura. Overnight Anuradhapura." },
                { day: 3, title: "Jaffna", description: "Transfer to Jaffna. Visit Jaffna Fort and Nallur Kovil. Overnight Jaffna." },
                { day: 4, title: "Jaffna", description: "Sightseeing in Point Pedro, Keerimalai, and Nagadeepa. Overnight Jaffna." },
                { day: 5, title: "Trincomalee", description: "Drive to Trincomalee. Koneswaram Temple and Beach. Overnight Trincomalee." },
                { day: 6, title: "Sigiriya", description: "Visit Sigiriya Rock Fortress. Overnight Sigiriya/Dambulla." },
                { day: 7, title: "Kandy", description: "Dambulla Cave Temple, then Kandy Dance and Tooth Temple. Overnight Kandy." },
                { day: 8, title: "Nuwara Eliya", description: "Botanical Gardens, Tea Factory, and Hill Country scenery. Overnight Nuwara Eliya." },
                { day: 9, title: "Colombo", description: "Pinnawala Elephant Orphanage and Colombo City Tour. Overnight Negombo." },
                { day: 10, title: "Departure", description: "Airport Transfer." }
            ]
        },
        {
            title: "06 Days | 05 Nights Excursions from Kandy, Sigiriya & Colombo",
            slug: "06-days-05-nights-excursions-from-kandy-sigiriya-colombo",
            category: "tour-package",
            duration: { days: 6, nights: 5 },
            description: "A compact tour covering the most iconic sites in the central and southern parts of the island.",
            itinerary: [
                { day: 1, title: "Kandy", description: "Arrival, visit Pinnawala and Temple of the Tooth. Overnight Kandy." },
                { day: 2, title: "Hill Country", description: "Peradeniya Garden, Tea Factory, and Nuwara Eliya highlights. Overnight Kandy." },
                { day: 3, title: "Sigiriya", description: "Dambulla Cave Temple, Minneriya Safari, and Sigiriya. Overnight Sigiriya." },
                { day: 4, title: "Sigiriya - Colombo", description: "Climb Sigiriya Rock, then transfer for Colombo city tour. Overnight Colombo." },
                { day: 5, title: "Galle Day Trip", description: "Madu River Safari and Galle Fort day trip. Overnight Colombo." },
                { day: 6, title: "Departure", description: "City sightseeing and airport transfer." }
            ]
        }
    ];

    for (const data of extraPackages) {
        const tourData = {
            ...data,
            notSuitableFor: sharedSafety.notSuitableFor,
            notAllowed: sharedSafety.notAllowed,
            price: { amount: 350, currency: 'USD', type: 'from' },
            isActive: true
        };
        await Tour.findOneAndUpdate({ slug: data.slug }, { $set: tourData }, { upsert: true });
        console.log(`Upserted: ${data.title}`);
    }

    console.log('Done!');
    process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
