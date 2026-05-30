import mongoose from 'mongoose';
import dbConnect from './src/lib/db.js';
import PricingSetting from './src/models/PricingSetting.js';
import AirportRoundTour from './src/models/AirportRoundTour.js';
import NormalRoundTour from './src/models/NormalRoundTour.js';

async function migrate() {
    console.log('Connecting to DB...');
    await dbConnect();
    
    console.log('Fetching PricingSettings...');
    const settings = await PricingSetting.findOne({ key: 'global_settings' });
    
    if (!settings) {
        console.log('No global_settings found.');
        process.exit(0);
    }
    
    console.log('Migrating Airport Round Tour Packages...');
    if (settings.airportRoundTripPackages && settings.airportRoundTripPackages.length > 0) {
        await AirportRoundTour.deleteMany({});
        await AirportRoundTour.insertMany(settings.airportRoundTripPackages);
        console.log(`Migrated ${settings.airportRoundTripPackages.length} Airport Round Tour Packages.`);
    } else {
        console.log('No Airport Round Tour Packages to migrate.');
    }
    
    console.log('Migrating Normal Round Tour Packages...');
    if (settings.roundTripPackages && settings.roundTripPackages.length > 0) {
        await NormalRoundTour.deleteMany({});
        await NormalRoundTour.insertMany(settings.roundTripPackages);
        console.log(`Migrated ${settings.roundTripPackages.length} Normal Round Tour Packages.`);
    } else {
        console.log('No Normal Round Tour Packages to migrate.');
    }
    
    console.log('Migration Complete!');
    process.exit(0);
}

migrate().catch(err => {
    console.error(err);
    process.exit(1);
});
