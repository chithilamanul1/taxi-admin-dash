
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Pricing from '../src/models/Pricing.js'; // Adjust path if needed, usually running from root

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('MONGODB_URI is missing');
    process.exit(1);
}

const updatePricing = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to DB');

        // Set 1: Bus (Mini Bus)
        // 0-20: 20k, 20-40: 30k, 40-100: 50k, 100-150: 70k, 140-200: 85k (Using 150-200 range), 200-300: 120k, >300: 400/km
        const busTiers = [
            { min: 0, max: 20, type: 'flat', price: 20000 },
            { min: 21, max: 40, type: 'flat', price: 30000 },
            { min: 41, max: 100, type: 'flat', price: 50000 },
            { min: 101, max: 150, type: 'flat', price: 70000 },
            { min: 151, max: 200, type: 'flat', price: 85000 },
            { min: 201, max: 300, type: 'flat', price: 120000 },
            { min: 301, max: 9999, type: 'per_km', rate: 400 } // Over 300 logic usually handled by fallback perKmRate, but tiers can handle it too. 
            // Wait, logic says "Over 300, Rs 400 per km". This usually means for the WHOLE distance or minimal?
            // "Per Km Rate" in model logic:
            // if (distance > 300) -> use perKmRate?
            // The model has `perKmRate`.
            // I will set `perKmRate` to 400.
            // And tiers up to 300.
            // If distance > 300, no tier matches (max 300), so it falls back to basePrice + (dist-base) * rate or just dist * rate.
            // Model fallback: `totalPrice = this.basePrice + (extraKm * this.perKmRate);`
            // So for > 300, we need a base price + rate. 
            // OR if the user means "Total Distance * 400", then I should add a tier 301-9999 type 'per_km'.
            // "Over 300, Rs 400 per km" usually means "Total * 400" or "Base + Extra".
            // Given the flat rates are high (300km * 400 = 120k, which matches the 200-300 tier price).
            // So likely it's a linear extension.
            // I'll add the tier 301+ as per_km rate 400.
        ];

        const busUpdate = {
            tiers: busTiers,
            perKmRate: 400,
            basePrice: 20000,
            baseKm: 20
        };

        const resBus = await Pricing.updateMany(
            { vehicleType: 'bus' },
            { $set: busUpdate }
        );
        console.log(`Updated Bus: ${resBus.modifiedCount} docs`);


        // Set 2: Coach Bus
        // 0-20: 25k, 20-40: 45k, 40-100: 60k, 100-150: 85k, 140-200: 95k, 200-300: 135k, >300: 450/km
        const coachTiers = [
            { min: 0, max: 20, type: 'flat', price: 25000 },
            { min: 21, max: 40, type: 'flat', price: 45000 },
            { min: 41, max: 100, type: 'flat', price: 60000 },
            { min: 101, max: 150, type: 'flat', price: 85000 },
            { min: 151, max: 200, type: 'flat', price: 95000 },
            { min: 201, max: 300, type: 'flat', price: 135000 },
            { min: 301, max: 9999, type: 'per_km', rate: 450 }
        ];

        const coachUpdate = {
            tiers: coachTiers,
            perKmRate: 450,
            basePrice: 25000,
            baseKm: 20
        };

        const resCoach = await Pricing.updateMany(
            { vehicleType: 'coach-bus' },
            { $set: coachUpdate }
        );
        console.log(`Updated Coach: ${resCoach.modifiedCount} docs`);

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

updatePricing();
