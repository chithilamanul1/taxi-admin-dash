const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const MONGODB_URI = 'mongodb+srv://chithilamanul1_db_user:chithila123@taxiadmindash.l9tttdj.mongodb.net/?appName=taxiadmindash';

const tourSchema = new mongoose.Schema({}, { strict: false });
const Tour = mongoose.models.Tour || mongoose.model('Tour', tourSchema);

async function debugData() {
    await mongoose.connect(MONGODB_URI);

    const packageTour = await Tour.findOne({ category: 'tour-package', title: /Ramayana/i }).lean();
    const dayTrip = await Tour.findOne({ category: 'day-trip' }).lean();

    const output = {
        packageTour: packageTour ? {
            title: packageTour.title,
            inclusions: packageTour.inclusions,
            included: packageTour.included,
            exclusions: packageTour.exclusions,
            excluded: packageTour.excluded,
            description: packageTour.description,
            itinerary: packageTour.itinerary,
            destinations: packageTour.destinations
        } : null,
        dayTrip: dayTrip ? {
            title: dayTrip.title,
            inclusions: dayTrip.inclusions,
            included: dayTrip.included,
            exclusions: dayTrip.exclusions,
            excluded: dayTrip.excluded,
            description: dayTrip.description,
            itinerary: dayTrip.itinerary,
            experience: dayTrip.experience,
            destinations: dayTrip.destinations
        } : null
    };

    fs.writeFileSync(path.join(__dirname, 'debug-tours-detailed.json'), JSON.stringify(output, null, 2));
    console.log('Detailed debug output written to debug-tours-detailed.json');
    await mongoose.connection.close();
}
debugData();
