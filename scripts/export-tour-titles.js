const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const MONGODB_URI = 'mongodb+srv://chithilamanul1_db_user:chithila123@taxiadmindash.l9tttdj.mongodb.net/?appName=taxiadmindash';

const tourSchema = new mongoose.Schema({ title: String, slug: String });
const Tour = mongoose.models.Tour || mongoose.model('Tour', tourSchema);

async function exportTitles() {
    await mongoose.connect(MONGODB_URI);
    const tours = await Tour.find({}, 'title slug');
    fs.writeFileSync(path.join(__dirname, 'existing-tours.json'), JSON.stringify(tours, null, 2));
    console.log(`Exported ${tours.length} tours.`);
    await mongoose.connection.close();
}
exportTitles();
