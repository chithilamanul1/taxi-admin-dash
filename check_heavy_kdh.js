require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');
async function check() {
  await mongoose.connect(process.env.MONGODB_URI, { dbName: 'taxiadmindash' });
  const heavy = await mongoose.connection.db.collection('heavyfleetnormaltours').find({ vehicleType: 'normal-kdh' }).toArray();
  console.log(heavy);
  process.exit();
}
check();
