require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const normal = await mongoose.connection.db.collection('normalroundtours').distinct('hours');
  const heavy = await mongoose.connection.db.collection('heavyfleetnormaltours').distinct('hours');
  console.log('Normal Hours:', normal.sort((a,b)=>a-b));
  console.log('Heavy Hours:', heavy.sort((a,b)=>a-b));
  process.exit(0);
}).catch(console.error);
