import mongoose from 'mongoose';
import NormalRoundTour from './src/models/NormalRoundTour.js';
import AirportRoundTour from './src/models/AirportRoundTour.js';

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://admin:admin123@cluster0.abcde.mongodb.net/taxi-db";

const heavyTypes = ['kdh', 'van', 'mini-bus', 'bus', 'coaster', 'coach', 'kdh-van', 'kdh-flatroof', 'kdh-highroof'];

async function cleanup() {
    // Need to use regex to find any vehicleType that matches heavyTypes
    // Since we know the exact strings from ALL_VEHICLE_TYPES: 'normal-kdh', 'kdh-van', 'mini-bus', 'coach-bus', 'mini-van-every', 'mini-van-05'
    // 'mini-van-every' includes 'van'
    // 'mini-van-05' includes 'van'
    // 'normal-kdh' includes 'kdh'
    // 'kdh-van' includes 'kdh', 'van'
    // 'mini-bus' includes 'mini-bus'
    // 'coach-bus' includes 'bus', 'coach'
    
    // We will find and delete from NormalRoundTour where vehicleType is one of the heavy types
    const heavyVehicleTypes = [
        'mini-van-05', 'mini-van-every', 'normal-kdh', 'kdh-van', 'mini-bus', 'coach-bus'
    ];
    
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to DB.");
    
    const normalRes = await NormalRoundTour.deleteMany({ vehicleType: { $in: heavyVehicleTypes } });
    console.log(`Deleted ${normalRes.deletedCount} heavy vehicles from NormalRoundTour.`);
    
    const airportRes = await AirportRoundTour.deleteMany({ vehicleType: { $in: heavyVehicleTypes } });
    console.log(`Deleted ${airportRes.deletedCount} heavy vehicles from AirportRoundTour.`);
    
    process.exit(0);
}

cleanup().catch(console.error);
