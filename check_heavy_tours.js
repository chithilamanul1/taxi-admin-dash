require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');
async function check() {
  await mongoose.connect(process.env.MONGODB_URI, { dbName: 'taxiadmindash' });
  const heavy = await mongoose.connection.db.collection('heavyfleetnormaltours').find({}).toArray();
  const normal = await mongoose.connection.db.collection('normalroundtours').find({}).toArray();
  console.log('Heavy vehicleTypes:', [...new Set(heavy.map(t => t.vehicleType))]);
  console.log('Normal vehicleTypes:', [...new Set(normal.map(t => t.vehicleType))]);
  
  // also check pricing
  const pricings = await mongoose.connection.db.collection('pricings').find({ category: 'tours' }).toArray();
  console.log('Pricing Tours:', pricings.map(p => ({ id: p._id, vehicleType: p.vehicleType, name: p.name })));
  
  process.exit();
}
check();
