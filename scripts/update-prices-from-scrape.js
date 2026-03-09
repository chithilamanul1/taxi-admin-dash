require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');

const scrapeData = {
    "tours": [
        { "title": "06 Days | 05 Nights Excursions from Kandy, Sigiriya & Colombo", "price": 300 },
        { "title": "Sri Lanka Classic & Northern Tour -10 Days | 09 Nights", "price": 350 },
        { "title": "08 Days Tour - Kandy, Nuwara Eliya & Bentota", "price": 450 },
        { "title": "10 Days - Nature, Culture & East Coast", "price": 450 },
        { "title": "Sri Lanka Culture Nature Tour - 12 Days | 11 Nights", "price": 750 },
        { "title": "05 Days | 04 Nights - Kandy, Nuwara Eliya, Bentota, Colombo", "price": 450 },
        { "title": "10 Days | 09 Nights Ramayana Trail Tour", "price": 450 },
        { "title": "07 Days | 06 Nights Buddhist Cultural Tour", "price": 450 }
    ],
    "dayTrips": [
        { "title": "Galle and Bentota Day-Tour From Colombo", "price": 59 },
        { "title": "From Colombo : Day Trip to Kandy | Pinnwala | Royal Gardens", "price": 50.63 },
        { "title": "From Colombo : Sigiriya and Dambulla Day Trip and Safari", "price": 69 },
        { "title": "From Colombo : Galle and Bentota Day Tour", "price": 50.22 },
        { "title": "From Colombo | Negambo : Sigiriya, Dambulla and Minneriya Day Trip", "price": 114.2 },
        { "title": "Private Sigiriya and Dambulla Day Tour from Colombo", "price": 94 },
        { "title": "Colombo: Galle and Bentota Day Trip From Colombo City", "price": 70.25 },
        { "title": "Colombo Full day city tour", "price": 39 },
        { "title": "Colombo Private Day Tour and shopping", "price": 26.25 },
        { "title": "From Negombo: Southern Coast Highlights Private Day Tour", "price": 120 },
        { "title": "From Negombo: Sigiriya Dambulla and Village Safari Day Tour", "price": 80 },
        { "title": "From Negombo: Ambuluwawa Tower & Tea Factory,Kandy Day Trip", "price": 67.55 },
        { "title": "Colombo & Negombo To Galle | Hikkaduwa | Mirissa Day Tour", "price": 94.56 },
        { "title": "Day excursion to Diyaluma waterfall from Galle Weligama", "price": 74 },
        { "title": "Udawalawe National Park Wildlife Safari from Galle", "price": 99 },
        { "title": "Yala National Park Wildlife safari from Galle", "price": 99 },
        { "title": "From Ella: All-Inclusive Day Trip to 5 Landmarks", "price": 66.57 },
        { "title": "Ella: Little Adam's Peak and Nine Arch Bridge Half-Day Tour", "price": 39 },
        { "title": "From Ella: Lipton Seat & Dambatenne Tea Factory Day Tour", "price": 47 },
        { "title": "From Kandy: Sigiriya Rock and Dambulla Cave Temple Day Tour", "price": 72.55 },
        { "title": "Kandy to Sigiriya Dambulla & Minneriya Park Safari Day Tour", "price": 42.2 },
        { "title": "Kandy City Tours", "price": 41.5 },
        { "title": "From Sigiriya, ANURADHAPURA UNESCO CITY day tour and safari", "price": 74.05 },
        { "title": "Fom Dambulla: Sigiriya Rock & Ancient City of Polonnaruwa", "price": 139 },
        { "title": "From Sigiriya : Polonnaruwa Ancient City Tour | Day Tour", "price": 46.67 },
        { "title": "Polonnaruwa Ancient City Tour with Minneriya Elephant Safari", "price": 80.72 }
    ]
};

async function updatePrices() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { dbName: 'taxiadmindash' });
        console.log("Connected to DB");

        const col = mongoose.connection.collection('tours');

        for (const item of [...scrapeData.tours, ...scrapeData.dayTrips]) {
            const priceObj = {
                amount: item.price,
                currency: 'USD',
                type: 'from'
            };

            // Using case-insensitive regex for title matching to be robust
            const result = await col.updateOne(
                { title: { $regex: new RegExp("^" + item.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + "$", "i") } },
                { $set: { price: priceObj } }
            );

            if (result.matchedCount > 0) {
                console.log(`Updated price for: ${item.title} -> $${item.price}`);
            } else {
                console.warn(`Could not find tour with title: ${item.title}`);
            }
        }

        console.log("Price sync complete.");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

updatePrices();
