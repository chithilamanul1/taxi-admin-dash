const mongoose = require('mongoose');
const fs = require('fs');

async function run() {
    let uri = process.env.MONGODB_URI;
    if (!uri && fs.existsSync('.env')) {
        const env = fs.readFileSync('.env', 'utf8');
        const match = env.match(/MONGODB_URI\s*=\s*(.*)/);
        if (match) uri = match[1].trim().replace(/['"]/g, '');
    }
    if (!uri && fs.existsSync('.env.local')) {
        const env = fs.readFileSync('.env.local', 'utf8');
        const match = env.match(/MONGODB_URI\s*=\s*(.*)/);
        if (match) uri = match[1].trim().replace(/['"]/g, '');
    }
    
    if (!uri) {
        console.error('No MONGODB_URI found.');
        return;
    }

    console.log('Connecting to:', uri);
    await mongoose.connect(uri);
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('--- Collections ---');
    collections.forEach(c => console.log(c.name));
    
    await mongoose.disconnect();
}

run().catch(console.error);
