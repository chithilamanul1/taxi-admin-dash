require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function check() {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: 'taxiadmindash' });

    console.log("Tour Packages:");
    const tours = await mongoose.connection.collection('tours').find({ category: 'tour-package' }, { projection: { title: 1, slug: 1, price: 1, heroImage: 1, image: 1, images: 1 } }).toArray();
    tours.forEach(t => console.log(`- ${t.title} | ${t.slug} | Price: ${JSON.stringify(t.price)} | Img: !!${t.heroImage || t.image || (t.images && t.images[0])}!!`));

    console.log("\nDay Trips:");
    const dayTrips = await mongoose.connection.collection('tours').find({ category: 'day-trip' }, { projection: { title: 1, slug: 1, price: 1, heroImage: 1, image: 1, images: 1 } }).toArray();
    dayTrips.forEach(t => console.log(`- ${t.title} | ${t.slug} | Price: ${JSON.stringify(t.price)} | Img: !!${t.heroImage || t.image || (t.images && t.images[0])}!!`));

    process.exit(0);
}
check().catch(console.error);
