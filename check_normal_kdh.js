require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');
async function check() {
  await mongoose.connect(process.env.MONGODB_URI, { dbName: 'taxiadmindash' });
  const normal = await mongoose.connection.db.collection('normalroundtours').find({ vehicleType: 'normal-kdh' }).toArray();
  console.log(normal);
  process.exit();
}
check();
