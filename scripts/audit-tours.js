const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb+srv://chithilamanul1_db_user:chithila123@taxiadmindash.l9tttdj.mongodb.net/?appName=taxiadmindash';

const tourSchema = new mongoose.Schema({
    title: String,
    category: String,
    itinerary: Array,
    experience: Array,
    inclusions: Array
});

const Tour = mongoose.models.Tour || mongoose.model('Tour', tourSchema);

async function audit() {
    try {
        await mongoose.connect(MONGODB_URI);
        const tours = await Tour.find({});
        console.log(`Total Tours: ${tours.length}`);

        tours.forEach(t => {
            const itineraryCount = t.itinerary?.length || 0;
            const experienceCount = t.experience?.length || 0;
            const inclusionsCount = t.inclusions?.length || 0;

            // Check if text matches heading (low fidelity)
            const lowFidelityExp = t.experience?.some(e => e.heading === e.text) || false;

            console.log(`[${t.category}] ${t.title}: Itinerary(${itineraryCount}), Experience(${experienceCount}), Inclusions(${inclusionsCount}), LowFidelityExp: ${lowFidelityExp}`);
        });

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.connection.close();
    }
}

audit();
