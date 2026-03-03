import 'dotenv/config';
import dbConnect from './src/lib/db.js';
import Pricing from './src/models/Pricing.js';

async function listVehicles() {
    try {
        await dbConnect();
        const vehicles = await Pricing.find({});
        console.log(JSON.stringify(vehicles, null, 2));
    } catch (err) {
        console.error("List Error:", err);
    } finally {
        process.exit(0);
    }
}

listVehicles();
