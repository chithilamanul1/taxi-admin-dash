require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');
async function check() {
  await mongoose.connect(process.env.MONGODB_URI, { dbName: 'taxiadmindash' });
  const heavy = await mongoose.connection.db.collection('heavyfleetnormaltours').find({}).toArray();
  const types = [...new Set(heavy.map(t => t.vehicleType))];
  for (const t of types) {
    const pkg = heavy.find(p => p.vehicleType === t);
    console.log(t, '->', pkg.tiers);
  }
  process.exit();
}
check();
