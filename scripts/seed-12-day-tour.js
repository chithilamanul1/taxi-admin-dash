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

const tourData = {
    "title": "Sri Lanka Culture Nature Tour - 12 Days | 11 Nights",
    "slug": "sri-lanka-culture-nature-tour-12-days-11-nights",
    "category": "tour-package",
    "duration": { "days": 12, "nights": 11 },
    "description": "Experience the natural beauty and rich cultural heritage of Sri Lanka on this comprehensive 12-day journey. From the ancient rock fortress of Sigiriya to the lush Sinharaja rainforest, this tour covers the island's most iconic landmarks and hidden gems.",
    "inclusions": [
        "Meeting at the airport upon arrival and assistance during the stay",
        "Transportation by air-conditioned vehicle according to the itinerary.",
        "Service of an English Speaking chauffer up to 6 pax and Guide service included from 7 pax onwards",
        "Accommodation at the Hotels as selected by you when requesting the quotation on Single, Double/Twin, Triple sharing",
        "Meal plan according to the itinerary, half board (dinner and breakfast included) will start from the dinner on the arrival day and ends with Breakfast on departure. Full board (Lunch, dinner and breakfast included) will start from Lunch on arrival day and ends with breakfast on departure.",
        "Two water bottles per day during tour"
    ],
    "exclusions": [
        "International Air Fare",
        "Peak period supplements",
        "Entrance fees to parks and archaeological sites not entered for quote in the itinerary",
        "Jeep charges, boat charges not mentioned in the itinerary",
        "Permits for photos / videos, tips and extras where applicable.",
        "Optional excursions and additional services not covered by the program.",
        "PCR, ETA and Travel Insurance payment",
        "Early check in and late check out. Check in at hotels is expected no earlier than 14:00 hours. The checkout is categorically expected by 11:00"
    ],
    "notSuitableFor": [
        "Back problems",
        "Insect allergies",
        "Cold",
        "Kidney problems",
        "Recent surgeries",
        "Motion sickness",
        "Animal allergies",
        "Pregnant women",
        "Wheelchair user"
    ],
    "notAllowed": [
        "Pets",
        "Explosive substances",
        "Nudity",
        "Fireworks",
        "Alcohol and drugs",
        "Drones",
        "Glass object",
        "Drinks in the vehicle",
        "Making noise",
        "Alcoholic drinks in the vehicle",
        "Touching/Feeding animals"
    ],
    "itinerary": [
        {
            "day": 1,
            "title": "Negombo",
            "description": "Arrival at the Bandaranaike International Airport. Our AIRPORT TAXIS (PVT) LTD representative and transfer to hotel in Negombo will welcome clients. Check in to the hotel and relax. Overnight stay at the hotel in Negombo."
        },
        {
            "day": 2,
            "title": "Negombo - Sigiriya",
            "description": "After a leisurely breakfast, set off to the Sigiriya. Check into the hotel & unwind. In the evening leave for visit Sigiriya rock fortress. Sigiriya Rock fortress Sigiriya. Sigiriya (Lion's rock) is an ancient rock fortress and palace built during the reign of King Kassapa I (AD 477 – 495). Contemporary with the paintings of Ajantha and Ellora Caves in India, highlights being the Frescoes, Mirror Wall and the Lion's Paw, and it is one of the Seven World Heritage Sites of Sri Lanka. Overnight stay in Sigiriya."
        },
        {
            "day": 3,
            "title": "Sigiriya - Hiriwadunna - Pollonaruwa",
            "description": "After a leisurely breakfast leave for visit Polonnaruwa, the next majestic city in 11th Century BC, after Anuradhapura. The glories of the past heyday is still visible in the archaeological treasures unearthed and resurrected. From the tall statue assumed to be of the Great King Parakramabahu to the famed Parakrama Samudraya which is as extensive as an ocean, Polonnaruwa has it all in a compact core. Afterwards leave for, Hiriwaduna to live a life experience in contact with the local population. The tour includes a nature walk, a walk aboard a wagon pulled by oxen, a test kitchen and lunch. Opportunity to attend a performance of Angampora, the ancient martial art of Sri Lanka. In the evening visit Ritigala, a world-famous ancient Buddhist monastery and mountain range. Overnight stay in Sigiriya."
        },
        {
            "day": 4,
            "title": "Sigiriya - Mahiyangana",
            "description": "Breakfast at the hotel and leave for Mahiyangana, where Gautama Buddha is said to have visited. Optional: Dambana Aboriginal Village Tour, Mahiyangana Raja Maha Vihara, Mawaragala forest monastery. Overnight stay in Mahiyangana."
        },
        {
            "day": 5,
            "title": "Mahiyangana - Kandy",
            "description": "Breakfast at the hotel, leave for Kandy, the last capital of Sinhala monarchy. Visit the Temple of the Tooth Relic, a UNESCO World Heritage Site. Overnight stay in Kandy."
        },
        {
            "day": 6,
            "title": "Kandy",
            "description": "Breakfast at the hotel. Sightseeing includes the Temple of Tooth Relic, Royal Botanical Gardens Peradeniya, an arts and crafts workshop, oriental marketplace, and a gem lapidary. In the evening enjoy a cultural dance show. Overnight stay in Kandy."
        },
        {
            "day": 7,
            "title": "Kandy - Nuwara Eliya",
            "description": "Breakfast at the hotel, leave for Nuwara Eliya, nicknamed 'Little England'. See mountains covered with tea bushes and cascading waterfalls. Overnight stay in Nuwara Eliya."
        },
        {
            "day": 8,
            "title": "Nuwara Eliya - Ella",
            "description": "Breakfast at the hotel. Take a scenic train ride to Ella. Visit Nine Arches Bridge and trek to Little Adam's Peak. Overnight stay in Ella."
        },
        {
            "day": 9,
            "title": "Ella - Udawalawe",
            "description": "Breakfast at the hotel. Leave for Udawalawe, visiting Ravana Falls and Elephant Transit Home ('Ath Athuru Sevana') en route. Overnight stay in Udawalawe."
        },
        {
            "day": 10,
            "title": "Udawalawe - Sinharaja",
            "description": "Breakfast at the hotel followed by a jeep safari in Udawalawe National Park, famous for free-roaming elephants. Later, leave for Sinharaja. Check in at the hotel and relax. Overnight stay in Sinharaja."
        },
        {
            "day": 11,
            "title": "Sinharaja - South West Coast",
            "description": "Breakfast at the hotel. Hike in Sinharaja rain forest, a UNESCO Natural World Heritage site teeming with endemic life. Afterwards, leave for a beach hotel on the South West Coast. Overnight stay in South West Coast."
        },
        {
            "day": 12,
            "title": "South West Coast - Airport",
            "description": "Breakfast at the hotel and leave for the airport for your onward flight."
        }
    ],
    "price": { "amount": 750, "currency": "USD", "type": "from" },
    "isActive": true
};

async function seed() {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected!');

    await Tour.findOneAndUpdate(
        { slug: tourData.slug },
        { $set: tourData },
        { upsert: true, new: true }
    );

    console.log('Update complete for: ' + tourData.title);
    process.exit(0);
}

seed().catch(err => {
    console.error(err);
    process.exit(1);
});
