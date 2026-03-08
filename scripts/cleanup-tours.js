const mongoose = require('mongoose');

const MONGO_URI = "mongodb+srv://chithilamanul1_db_user:chithila123@taxiadmindash.l9tttdj.mongodb.net/?appName=taxiadmindash";

async function cleanupTours() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const Tour = mongoose.connection.db.collection('tours');
        const allTours = await Tour.find({}).toArray();

        // Slugs of the 36 NEW tours (from our seeding scripts)
        const newSlugs = [
            // Day Trips (28)
            "galle-and-bentota-day-tour-from-colombo",
            "kandy-pinnawala-royal-gardens-from-colombo",
            "sigiriya-dambulla-day-trip-with-safari-from-colombo",
            "sigiriya-dambulla-minneriya-day-trip-from-negombo",
            "ambuluwawa-tower-tea-factory-from-negombo",
            "colombo-private-day-tour-shopping",
            "from-negombo-southern-coast-highlights-private-day-tour",
            "kandy-sigiriya-rock-dambulla-cave-temple-day-tour",
            "kandy-city-tours",
            "from-sigiriya-anuradhapura-unesco-city-day-tour-safari",
            "from-dambulla-sigiriya-rock-ancient-city-polonnaruwa",
            "from-sigiriya-polonnaruwa-ancient-city-tour-day-tour",
            "polonnaruwa-ancient-city-tour-with-minneriya-elephant-safari",
            "kandy-sigiriya-dambulla-minneriya-park-safari-day-tour",
            "kandy-city-tours-short-version",
            "kitulgala-white-water-rafting-adventure-from-colombo-negombo",
            "nuwara-eliya-little-england-day-tour-from-kandy",
            "ella-highlights-day-trip-from-kandy-nuwara-eliya",
            "udawalawe-national-park-safari-from-southern-hotels-galle",
            "mirissa-whale-watching-day-trip-from-galle-bentota",
            "negombo-lagoon-dutch-canal-boat-tour",
            "hikkaduwa-glass-bottom-boat-snorkeling",
            "horton-plains-worlds-end-trek-from-nuwara-eliya",
            "ratnapura-city-of-gems-day-tour-from-colombo",
            "kalutara-bodhiya-richmond-castle-from-bentota-beruwala",
            "sinharaja-rain-forest-trekking-from-galle-bentota",
            "jaffna-day-tour-from-anuradhapura",
            "wilpattu-national-park-safari-from-negombo-colombo",
            // Tour Packages (8)
            "06-days-05-nights-excursions-kandy-sigiriya-colombo",
            "05-days-04-nights-essential-kandy-nuwara-eliya-bentota-colombo",
            "08-days-tour-kandy-nuwara-eliya-bentota",
            "sri-lanka-classic-northern-tour-10-days-09-nights",
            "10-days-09-nights-nature-culture-east-coast",
            "10-days-09-nights-ramayana-trail-tour",
            "07-days-06-nights-buddhist-cultural-tour",
            "12-days-11-nights-sri-lanka-culture-nature-tour"
        ];

        const oldTours = allTours.filter(t => !newSlugs.includes(t.slug));
        const newTours = allTours.filter(t => newSlugs.includes(t.slug));

        console.log(`Found ${oldTours.length} old tours and ${newTours.length} new tours.`);

        for (const newTour of newTours) {
            // Try to find a match in old tours to preserve images
            // Match by title or substring of title
            const match = oldTours.find(old =>
                old.title.toLowerCase().includes(newTour.title.toLowerCase().substring(0, 15)) ||
                newTour.title.toLowerCase().includes(old.title.toLowerCase().substring(0, 15))
            );

            if (match) {
                console.log(`Matched "${newTour.title}" with old "${match.title}". Copying images...`);
                await Tour.updateOne(
                    { _id: newTour._id },
                    {
                        $set: {
                            image: match.image,
                            images: match.images,
                            heroImage: match.heroImage,
                            location: match.location || newTour.location,
                            destinations: match.destinations || newTour.destinations
                        }
                    }
                );
            }
        }

        // Now delete all old tours
        console.log("Deleting old tours...");
        const result = await Tour.deleteMany({ slug: { $nin: newSlugs } });
        console.log(`Deleted ${result.deletedCount} old tours.`);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

cleanupTours();
