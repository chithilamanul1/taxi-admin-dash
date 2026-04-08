require('dotenv').config();
const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: String,
    slug: String,
    content: String,
    excerpt: String,
    imageUrl: String,
    tags: [String],
    isPublished: Boolean,
    seo: {
        metaTitle: String,
        metaDescription: String,
        keywords: [String]
    },
    author: String
}, { timestamps: true });

const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);

const blogPosts = [
    {
        title: "How to Avoid Scams at Colombo Airport (BIA): A Complete Guide",
        slug: "how-to-avoid-scams-colombo-airport",
        excerpt: "Navigate Bandaranaike International Airport like a pro and avoid common taxi and travel scams with our expert guide.",
        content: `
# How to Avoid Scams at Colombo Airport (BIA)

Welcome to Sri Lanka! Arriving at Bandaranaike International Airport (BIA) in Katunayake is the start of your adventure. However, like any major international gateway, it can be overwhelming, and unsuspecting travelers can sometimes fall prey to local scams. 

Here is everything you need to know to stay safe and ensure a smooth start to your journey.

## 1. The "Official" Representative Scam
One of the most common sights in the arrival hall is people dressed in official-looking shirts or holding generic signs claiming to be "Tourist Information" or "Official Airport Taxis." They may approach you aggressively.
**The Fix:** Real official taxi counters are located inside the arrival hall *before* you exit the building. If you have pre-booked with a service like Airport Taxis Pvt (Ltd), look for your driver holding a sign with **your specific name** and our company logo.

## 2. The "Hotel is Closed" Tactic
During the drive, some unscrupulous drivers might tell you that the hotel you booked has closed down, is under renovation, or is in a "dangerous area." They do this to redirect you to another hotel where they receive a high commission.
**The Fix:** Always have your hotel's phone number ready. If a driver makes such a claim, insist on going there anyway or call the hotel yourself to verify.

## 3. The Broken Meter
If you pick up a local "Tuk-Tuk" or a non-pre-booked cab, they might claim the meter is broken and try to charge you a significantly higher "fixed price" at the end of the trip.
**The Fix:** Always pre-book a fixed-price transfer. At Airport Taxis Sri Lanka, our prices are all-inclusive and fixed at the time of booking. No surprises, no "broken meters."

## 4. Highway Tolls "Extra"
Some drivers might try to charge you double or triple for the highway tolls (Expressway tolls).
**The Fix:** Standard expressway tolls are usually between 300-600 LKR depending on the distance. Verify if your booking includes tolls. At Airport Taxis, we are transparent about these costs.

## Conclusion
The best way to avoid stress is to have your transportation organized before you land. A pre-booked private transfer not only saves you from scams but also ensures you have a professional, vetted driver waiting to take you directly to your destination in comfort.

Safe travels in the Pearl of the Indian Ocean!
        `,
        imageUrl: "/sigiriya-2.png",
        tags: ["Travel Tips", "Safety", "Colombo Airport"],
        isPublished: true,
        seo: {
            metaTitle: "Avoid Colombo Airport Taxi Scams | Sri Lanka Travel Guide",
            metaDescription: "Expert advice on avoiding common tourist scams at Colombo Airport (BIA). Learn how to book safe, reliable transportation in Sri Lanka.",
            keywords: ["Colombo airport scams", "BIA taxi safety", "Sri Lanka travel tips", "airport transfer safety"]
        },
        author: "Travel Expert"
    },
    {
        title: "Travel Times Between Major Sri Lankan Cities: 2024 Route Guide",
        slug: "sri-lanka-travel-times-guide",
        excerpt: "Plan your itinerary perfectly with our comprehensive guide to travel times between Colombo, Kandy, Galle, and more.",
        content: `
# Travel Times Between Major Sri Lankan Cities: 2024 Route Guide

Timing is everything when exploring the diverse landscapes of Sri Lanka. From the coastal sun of Galle to the misty mountains of Ella, knowing how long it takes to move between destinations is crucial for a stress-free holiday.

## 1. Colombo Airport (BIA) to Colombo City
**Distance:** 35 km
**Travel Time:** 45 - 60 minutes via the E03 Expressway.
*Note: During peak rush hours (8 AM - 10 AM and 5 PM - 7 PM), this can take up to 90 minutes.*

## 2. Colombo to Kandy
**Distance:** 115 km
**Travel Time:** 3 to 4 hours.
The road to Kandy involves winding mountain paths. While the distance isn't huge, the traffic in towns like Kegalle can slow things down.

## 3. Colombo to Galle
**Distance:** 125 km
**Travel Time:** 2 hours via the Southern Expressway (E01).
This is one of the fastest and smoothest routes in the country.

## 4. Kandy to Ella
**Distance:** 140 km
**Travel Time:** 4.5 to 5.5 hours.
While the train is famous for this route, a private taxi allows you to stop at tea factories and waterfalls like Ravana Falls at your own pace.

## 5. Colombo to Sigiriya
**Distance:** 175 km
**Travel Time:** 4 hours.
The road is generally good, but passing through Kurunegala can be slow during the day.

## Pro Tip for Travelers
Always add an extra 30-45 minutes to your planned travel time for unexpected stops, road construction, or just to enjoy a fresh king coconut by the roadside!

Need a reliable ride? Check out our [Price List](/prices) for fixed-rate transfers across all these routes.
        `,
        imageUrl: "/ella.jpg",
        tags: ["Itinerary Planning", "Road Trip", "Travel Guide"],
        isPublished: true,
        seo: {
            metaTitle: "Sri Lanka Travel Times & Distances | 2024 Route Planner",
            metaDescription: "Complete guide to travel times between Colombo, Kandy, Galle, and Ella. Plan your Sri Lankan holiday with accurate local knowledge.",
            keywords: ["Sri Lanka travel times", "Colombo to Kandy time", "Galle to airport distance", "Sri Lanka route guide"]
        },
        author: "Route Specialist"
    },
    {
        title: "The Best Vehicles for Sri Lankan Hill Country Roads: Comfort vs. Power",
        slug: "best-vehicles-hill-country-roads",
        excerpt: "Choosing the right car for the mountains is vital. We compare Sedans, SUVs, and Vans for the winding roads of Nuwara Eliya and Ella.",
        content: `
# The Best Vehicles for Sri Lankan Hill Country Roads

Sri Lanka's hill country—including Nuwara Eliya, Ella, and Kandy—is breathtaking. But the roads are steep, winding, and sometimes narrow. Choosing the right vehicle can make the difference between a nauseous ride and a comfortable scenic tour.

## 1. Prime Choice: The Toyota Prius or Hybrid Sedan
For couples or small groups of 2-3, a modern hybrid sedan like the Toyota Prius or Axio is excellent. 
**Pros:** Smooth acceleration, extremely quiet (great for nature), and comfortable suspension.
**Cons:** Limited luggage space if you have more than 2 large suitcases.

## 2. The Powerhouse: SUVs
If you are heading into deeper rural areas or estates, a 4WD or SUV provides higher ground clearance.
**Pros:** Better visibility and handles rougher patches of road with ease.
**Cons:** Can be more expensive than standard sedans.

## 3. Group Travel: The KDH Luxury Van
For families of 5 or more, the Toyota Hiace KDH is the gold standard in Sri Lanka.
**Pros:** Dual A/C (vital for the climb), massive windows for sightseeing, and enough power to tackle the steepest inclines even when fully loaded.
**Cons:** Larger size means it’s slightly slower on very tight mountain hairpins.

## 4. Why A/C Matters in the Hills
You might think that because it's cooler in the mountains, you don't need A/C. However, A/C is essential for **de-misting the windows** during the frequent rain and fog in the highlands. Always ensure your taxi hire has a fully functional A/C system.

## Summary
For the best balance of comfort and views, we recommend the **Luxury Van (KDH)** for groups and the **Premier Sedan** for couples. Our fleet at Airport Taxis Sri Lanka is specifically maintained to handle these challenging terrains.

[View our full fleet here](/services)
        `,
        imageUrl: "/Hero/ella.jpg",
        tags: ["Fleet", "Hill Country", "Travel Comfort"],
        isPublished: true,
        seo: {
            metaTitle: "Best Cars for Sri Lanka Mountains | Hill Country Travel Guide",
            metaDescription: "Compare the best vehicles for traveling to Nuwara Eliya and Ella. Why vehicle choice matters for Sri Lanka's winding mountain roads.",
            keywords: ["best car for hill country", "Sri Lanka mountain driving", "KDH van vs sedan", "Nuwara Eliya transport"]
        },
        author: "Fleet Manager"
    }
];

async function seed() {
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/airport-taxis";
    try {
        await mongoose.connect(mongoUri);
        console.log("Connected to MongoDB for seeding...");

        for (const post of blogPosts) {
            await Post.findOneAndUpdate(
                { slug: post.slug },
                post,
                { upsert: true, new: true }
            );
            console.log(`Seeded post: ${post.title}`);
        }

        console.log("Seeding completed successfully!");
        process.exit(0);
    } catch (err) {
        console.error("Seeding failed:", err);
        process.exit(1);
    }
}

seed();
