const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const MONGODB_URI = 'mongodb+srv://chithilamanul1_db_user:chithila123@taxiadmindash.l9tttdj.mongodb.net/?appName=taxiadmindash';

const tourSchema = new mongoose.Schema({}, { strict: false });
const Tour = mongoose.models.Tour || mongoose.model('Tour', tourSchema);

async function debug() {
    await mongoose.connect(MONGODB_URI);

    // Check the Ramayana tour (the one from the screenshot)
    const tour = await Tour.findOne({ title: /Ramayana/i }).lean();

    const output = {
        title: tour.title,
        slug: tour.slug,
        fieldNames: Object.keys(tour),
        itinerary: tour.itinerary,
        itineraryLength: tour.itinerary ? tour.itinerary.length : 0,
        included: tour.included,
        includedLength: tour.included ? tour.included.length : 0,
        excluded: tour.excluded,
        excludedLength: tour.excluded ? tour.excluded.length : 0,
        experience: tour.experience,
        experienceLength: tour.experience ? tour.experience.length : 0,
        description: tour.description ? tour.description.substring(0, 100) : null,
        notSuitableFor: tour.notSuitableFor,
        notAllowed: tour.notAllowed,
        // Check alternative field names
        inclusions: tour.inclusions,
        exclusions: tour.exclusions,
    };

    fs.writeFileSync(path.join(__dirname, 'debug-tour-output.json'), JSON.stringify(output, null, 2));
    console.log('Debug output written.');
    await mongoose.connection.close();
}
debug();
