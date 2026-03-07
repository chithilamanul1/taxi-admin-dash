const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb+srv://chithilamanul1_db_user:chithila123@taxiadmindash.l9tttdj.mongodb.net/?appName=taxiadmindash';

const tourSchema = new mongoose.Schema({ title: String });
const Tour = mongoose.models.Tour || mongoose.model('Tour', tourSchema);

async function list() {
    await mongoose.connect(MONGODB_URI);
    const tours = await Tour.find({}, 'title');
    console.log(JSON.stringify(tours.map(t => t.title), null, 2));
    await mongoose.connection.close();
}
list();
