const mongoose = require('mongoose');
const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/airport-taxi';

async function fix() {
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

    // Also fix heavy-normal-tours
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
