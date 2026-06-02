require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');

async function checkImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const pricings = await mongoose.connection.db.collection('pricings').find({}).toArray();
    pricings.forEach(p => console.log(p.vehicleType, '->', p.image));
    console.log('Done!');
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

checkImages();
