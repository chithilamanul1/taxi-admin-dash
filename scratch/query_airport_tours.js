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
    
    const AirportTourSchema = new mongoose.Schema({}, { strict: false });
    const AirportTour = mongoose.model('AirportTour', AirportTourSchema, 'airportroundtours');
    
    const docs = await AirportTour.find({});
    console.log('--- Database airport round tours list ---');
    docs.forEach(doc => {
        console.log(JSON.stringify(doc));
    });
    
    await mongoose.disconnect();
}

run().catch(console.error);
