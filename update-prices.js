const mongoose = require('mongoose');
require('./src/models/Tour');

const MONGO_URI = 'mongodb://chithila:chithila123@187.77.128.167:27017/admin?authSource=admin';

const dayTripPrices = [
    { title: "Galle and Bentota Day-Tour From Colombo", price: 59 },
    { title: "Day Trip to Kandy | Pinnwala | Royal Gardens", price: 102.26 },
    { title: "Sigiriya and Dambulla Day Trip and Safari", price: 69 },
    { title: "Galle and Bentota Day Tour", price: 50.22 },
    { title: "Sigiriya, Dambulla and Minneriya Day Trip", price: 127 },
    { title: "Private Sigiriya and Dambulla Day Tour from Colombo", price: 94 },
    { title: "Galle and Bentota Day Trip From Colombo City", price: 74 },
    { title: "Colombo Full day city tour", price: 39 },
    { title: "Colombo Private Day Tour and shopping", price: 26.25 },
    { title: "From Negombo: Southern Coast Highlights Private Day Tour", price: 120 },
    { title: "From Negombo: Sigiriya Dambulla and Village Safari Day Tour", price: 89 },
    { title: "From Negombo: Ambuluwawa Tower & Tea Factory,Kandy Day Trip", price: 77.35 },
    { title: "Colombo & Negombo To Galle | Hikkaduwa | Mirissa Day Tour", price: 105.18 },
    { title: "Colombo & Negombo To Galle | Hikkaduwa | Mirissa Day Tour (Alternative)", price: 65 },
    { title: "Day excursion to Diyaluma waterfall from Galle Weligama", price: 74 },
    { title: "Udawalawe National Park Wildlife Safari from Galle", price: 99 },
    { title: "Yala National Park Wildlife safari from Galle", price: 99 },
    { title: "From Ella: All-Inclusive Day Trip to 5 Landmarks", price: 77.32 },
    { title: "Ella: Little Adam's Peak and Nine Arch Bridge Half-Day Tour", price: 39 },
    { title: "From Ella: Lipton Seat & Dambatenne Tea Factory Day Tour", price: 47 },
    { title: "From Kandy: Sigiriya Rock and Dambulla Cave Temple Day Tour", price: 80.72 },
    { title: "Kandy to Sigiriya Dambulla & Minneriya Park Safari Day Tour", price: 47 },
    { title: "Kandy City Tours", price: 49 },
    { title: "ANURADHAPURA UNESCO CITY day tour and safari", price: 78 },
    { title: "Sigiriya Rock & Ancient City of Polonnaruwa", price: 139 },
    { title: "Polonnaruwa Ancient City Tour | Day Tour", price: 46.67 },
    { title: "Polonnaruwa Ancient City Tour with Minneriya Elephant Safari", price: 80.72 },
    { title: "Polonnaruwa Ancient City Tour with Minneriya Elephant Safari (Short)", price: 41.56 }
];

const tourPackagePrices = [
    { title: "06 Days | 05 Nights Excursions from Kandy, Sigiriya & Colombo", price: 300 },
    { title: "Sri Lanka Classic & Northern Tour -10 Days | 09 Nights", price: 350 },
    { title: "08 Days Tour - Kandy, Nuwara Eliya & Bentota", price: 450 },
    { title: "10 Days - Nature, Culture & East Coast", price: 450 },
    { title: "Sri Lanka Culture Nature Tour - 12 Days | 11 Nights", price: 750 },
    { title: "05 Days | 04 Nights - Kandy, Nuwara Eliya, Bentota, Colombo", price: 450 },
    { title: "10 Days | 09 Nights Ramayana Trail Tour", price: 450 },
    { title: "07 Days | 06 Nights Buddhist Cultural Tour", price: 450 }
];

async function updatePrices() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const Tour = mongoose.model('Tour');

        for (const item of [...dayTripPrices, ...tourPackagePrices]) {
            // Try to find by partial title match astitles in local DB might differ slightly
            const tour = await Tour.findOne({ title: { $regex: item.title, $options: 'i' } });

            if (tour) {
                tour.price = {
                    amount: item.price,
                    currency: 'USD',
                    type: 'from'
                };
                await tour.save();
                console.log(`Updated price for: ${tour.title} -> $${item.price}`);
            } else {
                console.log(`Tour not found for title: ${item.title}`);
            }
        }

        console.log('Price update completed');
        process.exit(0);
    } catch (err) {
        console.error('Error updating prices:', err);
        process.exit(1);
    }
}

updatePrices();
