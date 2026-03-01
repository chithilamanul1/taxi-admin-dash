import mongoose from 'mongoose';

const tourSchema = new mongoose.Schema({
    title: String,
    category: String,
    isActive: Boolean
});

const Tour = mongoose.models.Tour || mongoose.model('Tour', tourSchema);

async function checkTours() {
    const uri = "mongodb+srv://chithilamanul1_db_user:chithila123@taxiadmindash.l9tttdj.mongodb.net/taxiadmindash?appName=taxiadmindash";
    try {
        await mongoose.connect(uri);
        const tours = await Tour.find({});
        console.log(`Found ${tours.length} tours.`);
        tours.forEach(t => console.log(`- ${t.title} (${t.category}) [Active: ${t.isActive}]`));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkTours();
