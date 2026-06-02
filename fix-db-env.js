const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
const mongoUriMatch = env.match(/MONGODB_URI=([^\r\n]+)/);
const uri = mongoUriMatch ? mongoUriMatch[1].replace(/['"]/g, '') : '';

const mongoose = require('mongoose');

async function fix() {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri);
    const db = mongoose.connection.db;
    
    // Fix destinationRoundTripPackages in settings
    const settingsColl = db.collection('settings');
    const settings = await settingsColl.findOne({ _id: 'global_pricing' });
    if (settings && settings.destinationRoundTripPackages) {
        let modified = false;
        settings.destinationRoundTripPackages.forEach(pkg => {
            if (pkg.vehicleType === 'kdh-van' && pkg.tiers && pkg.tiers.length === 4 && pkg.tiers[0].km === 50 && pkg.tiers[0].price === 0) {
                pkg.tiers = [
                    { km: 60, price: 0 },
                    { km: 70, price: 0 },
                    { km: 80, price: 0 },
                    { km: 90, price: 0 }
                ];
                modified = true;
            }
        });
        if (modified) {
            await settingsColl.updateOne({ _id: 'global_pricing' }, { $set: { destinationRoundTripPackages: settings.destinationRoundTripPackages } });
            console.log('Fixed KDH Van defaults in settings DB');
        }
    }

    const heavyColl = db.collection('heavynormaltours');
    const kdhTours = await heavyColl.find({ vehicleType: 'kdh-van' }).toArray();
    for (const tour of kdhTours) {
        if (tour.tiers && tour.tiers.length === 4 && tour.tiers[0].km === 50 && tour.tiers[0].price === 0) {
            await heavyColl.updateOne({ _id: tour._id }, { $set: { tiers: [
                { km: 60, price: 0 },
                { km: 70, price: 0 },
                { km: 80, price: 0 },
                { km: 90, price: 0 }
            ]}});
            console.log('Fixed KDH Van defaults in heavy tours DB');
        }
    }
    
    await mongoose.disconnect();
}
fix().catch(console.error);
