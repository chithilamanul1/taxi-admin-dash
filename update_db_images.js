require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');

async function updateImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: 'taxiadmindash' });
    console.log('Connected to DB');

    const collections = await mongoose.connection.db.listCollections().toArray();
    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      if (collectionName.startsWith('system.')) continue;
      const collection = mongoose.connection.db.collection(collectionName);
      
      const result1 = await collection.updateMany(
        { image: '/vehicles/sedan2.png' },
        { $set: { image: '/vehicles/sedancar.png' } }
      );
      const result2 = await collection.updateMany(
        { image: '/vehicles/sedan_luxury.png' },
        { $set: { image: '/vehicles/sedancar.png' } }
      );
      
      const modifiedCount = result1.modifiedCount + result2.modifiedCount;
      if (modifiedCount > 0) {
        console.log(`Updated ${modifiedCount} documents in ${collectionName}`);
      }
    }
    
    console.log('Done!');
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

updateImages();
