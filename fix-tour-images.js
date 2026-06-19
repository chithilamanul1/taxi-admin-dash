require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    const schema = new mongoose.Schema({}, { strict: false, collection: 'tours' });
    const Tour = mongoose.model('TourUpd', schema);

    const imageMap = {
        'Yala': '/yala-new.png',
        'Udawalawe': '/wilpattu-new.png',
        'Sigiriya': '/sigiriya-new-hero.png',
        'Minneriya': '/sigiriya-new-hero.png',
        'Pinnawala': '/kandy-new.png',
        'Mirissa': '/mirissa-new-fix.png',
        'Wilpattu': '/wilpattu-new.png',
    };

    const safaris = await Tour.find({ category: 'safari' });
    for (const s of safaris) {
        for (const [key, img] of Object.entries(imageMap)) {
            if (s.title.includes(key)) {
                await Tour.updateOne({ _id: s._id }, { heroImage: img, images: [img] });
                console.log('Updated:', s.title, '->', img);
                break;
            }
        }
    }

    // Also update other tours with broken unsplash images
    const allTours = await Tour.find({});
    const tourImageMap = {
        'Anuradhapura': '/sigiriya-new-hero.png',
        'Kitulgala': '/ella.jpg',
        'Colombo City': '/galle-new.png',
        'Colombo Exclusive': '/galle-new.png',
        'Southern Coast Discovery': '/bentota-new.png',
        'Southern Coast Explorer': '/bentota-new.png',
        'Ambuluwawa': '/kandy-new.png',
        'Ultimate South Coast': '/hikkaduwa-new.png',
        'Nuwara Eliya': '/nuwara-eliya-new.png',
        'Ella Explorer': '/ella.jpg',
        'Sinharaja': '/ella.jpg',
        'Polonnaruwa': '/sigiriya-new-hero.png',
        'Hikkaduwa': '/hikkaduwa-new.png',
        'Negombo Heritage': '/bentota-new.png',
        'Kandy: The Last': '/kandy-new.png',
        'Ratnapura': '/ella.jpg',
    };
    for (const t of allTours) {
        if (t.heroImage && t.heroImage.includes('unsplash.com')) {
            for (const [key, img] of Object.entries(tourImageMap)) {
                if (t.title.includes(key)) {
                    await Tour.updateOne({ _id: t._id }, { heroImage: img, images: [img] });
                    console.log('Fixed image:', t.title, '->', img);
                    break;
                }
            }
        }
    }

    console.log('Done!');
    process.exit(0);
});
