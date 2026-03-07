const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb+srv://chithilamanul1_db_user:chithila123@taxiadmindash.l9tttdj.mongodb.net/?appName=taxiadmindash';

const tourSchema = new mongoose.Schema({}, { strict: false });
const Tour = mongoose.models.Tour || mongoose.model('Tour', tourSchema);

async function verify() {
    await mongoose.connect(MONGODB_URI);

    const sample1 = await Tour.findOne({ title: /12 Days/i });
    console.log('--- 12 Day Tour ---');
    console.log('Itinerary Length:', sample1.itinerary.length);
    console.log('First Day Title:', sample1.itinerary[0].title);
    console.log('Inclusions:', sample1.included.length);

    const sample2 = await Tour.findOne({ title: /Galle and Bentota Day-Tour/i });
    console.log('--- Galle & Bentota Day Tour ---');
    console.log('Description:', sample2.description.substring(0, 50) + '...');
    console.log('Experiences:', sample2.experience.length);

    await mongoose.connection.close();
}
verify();
