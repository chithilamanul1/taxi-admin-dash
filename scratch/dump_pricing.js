const mongoose = require('mongoose');
const fs = require('fs');

async function run() {
    let uri = process.env.MONGODB_URI;
    if (!uri && fs.existsSync('.env')) {
        const env = fs.readFileSync('.env', 'utf8');
        const match = env.match(/MONGODB_URI\s*=\s*(.*)/);
        if (match) uri = match[1].trim().replace(/['"]/g, '');
    }
    
    if (!uri) {
        console.error('No MONGODB_URI found.');
        return;
    }

    console.log('Connecting to:', uri);
    await mongoose.connect(uri, { dbName: 'taxiadmindash' }); // explicitly pass dbName
    
    const PricingSettings = mongoose.model('PricingSettings', new mongoose.Schema({}, { strict: false }), 'pricingsettings');
    const settings = await PricingSettings.find({});
    console.log('--- PricingSettings ---');
    settings.forEach(s => console.log(JSON.stringify(s)));

    const AirportRoundTour = mongoose.model('AirportRoundTour', new mongoose.Schema({}, { strict: false }), 'airportroundtours');
    const tours = await AirportRoundTour.find({});
    console.log('--- AirportRoundTour ---');
    tours.forEach(t => console.log(JSON.stringify(t)));
    
    await mongoose.disconnect();
}

run().catch(console.error);
