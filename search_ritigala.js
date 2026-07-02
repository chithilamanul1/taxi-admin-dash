import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => mongoose.connection.db.collection('tours').find({ title: /ritigala/i }).toArray())
  .then(res => { console.log('Tours:', res.length); return mongoose.connection.db.collection('pricing').find({ name: /ritigala/i }).toArray(); })
  .then(res => { console.log('Pricing:', res.length); return mongoose.connection.db.collection('destinations').find({ name: /ritigala/i }).toArray(); })
  .then(res => { console.log('Destinations:', res.length); process.exit(0); })
  .catch(console.error);
