const mongoose = require('mongoose');
const fs = require('fs');

async function run() {
    let uri = process.env.MONGODB_URI;
    if (!uri && fs.existsSync('.env')) {
        const env = fs.readFileSync('.env', 'utf8');
        const match = env.match(/MONGODB_URI\s*=\s*(.*)/);
        if (match) uri = match[1].trim().replace(/['"]/g, '');
    }
    
    await mongoose.connect(uri, { dbName: 'taxiadmindash' });
    const db = mongoose.connection.db;

    const docs = await db.collection('airportroundtours').find({ vehicleType: 'mini-car' }).toArray();
    console.log('--- All Mini Car packages in airportroundtours ---');
    console.log(JSON.stringify(docs, null, 2));

    await mongoose.disconnect();
}

run().catch(console.error);
