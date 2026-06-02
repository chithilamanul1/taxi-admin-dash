require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');
async function check() {
  await mongoose.connect(process.env.MONGODB_URI, { dbName: 'taxiadmindash' });
  const pricings = await mongoose.connection.db.collection('pricings').find({ category: 'airport-transfer' }).toArray();
  pricings.forEach(p => console.log(p.name, '->', p.vehicleType));
  process.exit();
}
check();
