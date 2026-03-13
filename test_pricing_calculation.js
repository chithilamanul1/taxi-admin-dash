const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const testCases = [
    { type: 'normal-kdh', name: 'VAN', distances: [15, 35, 70, 120, 180, 250] },
    { type: 'mini-van-05', name: 'MINI VAN', distances: [15, 35, 70, 120, 180, 250] },
    { type: 'vezel', name: 'SUV', distances: [15, 35, 70, 120, 180, 250] },
    { type: 'mini-bus', name: 'MINI BUS', distances: [15, 35, 70, 120, 180, 250] },
    { type: 'bus', name: 'BUS', distances: [15, 35, 70, 120, 250, 400] },
    { type: 'coach-bus', name: 'COACH BUS', distances: [15, 35, 70, 120, 250, 400] },
];

async function verify() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { dbName: 'taxiadmindash' });
        
        const tierSchema = new mongoose.Schema({
            min: Number,
            max: Number,
            type: { type: String, enum: ['flat', 'per_km'] },
            price: Number,
            rate: Number
        }, { _id: false });

        const pricingSchema = new mongoose.Schema({
            vehicleType: String,
            category: String,
            tiers: [tierSchema]
        }, { collection: 'pricings' });

        pricingSchema.methods.calculatePrice = function(distanceKm) {
            const matchingTier = this.tiers.find(t => distanceKm >= t.min && distanceKm <= (t.max || Infinity));
            if (matchingTier) {
                if (matchingTier.type === 'flat') return matchingTier.price;
                if (matchingTier.type === 'per_km') return distanceKm * matchingTier.rate;
            }
            return 0;
        };

        const Pricing = mongoose.models.Pricing || mongoose.model('Pricing', pricingSchema);

        for (const tc of testCases) {
            const vehicle = await Pricing.findOne({ vehicleType: tc.type, category: 'airport-transfer' });
            if (!vehicle) {
                console.log(`[ERROR] Vehicle ${tc.type} not found!`);
                continue;
            }

            console.log(`\n--- Verification for ${tc.name} (${tc.type}) ---`);
            tc.distances.forEach(dist => {
                const price = vehicle.calculatePrice(dist);
                console.log(`${dist} km -> Rs ${price.toLocaleString()}`);
            });
        }

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

verify();
