import { calculateBasePrice } from './src/lib/pricing-util.js';

const miniCar = {
    vehicleType: 'mini-car',
    category: 'airport-transfer',
    basePrice: 3500,
    baseKm: 20,
    perKmRate: 100,
    tiers: [
        { min: 0, max: 20, type: 'flat', price: 5000 }, // User said they set 20km to 5000
        { min: 21, max: 40, type: 'flat', price: 4000 }, // Suspicious lower price for longer trip
        { min: 41, max: 130, type: 'per_km', rate: 100 }
    ]
};

console.log("--- Testing Mini Car Pricing (0-20km Tier) ---");
const price20 = calculateBasePrice(20, miniCar, 'one-way');
console.log(`Distance: 20km | Expected: 5000 | Result: ${price20}`);

const price19 = calculateBasePrice(19, miniCar, 'one-way');
console.log(`Distance: 19km | Expected: 5000 | Result: ${price19}`);

const price21 = calculateBasePrice(21, miniCar, 'one-way');
console.log(`Distance: 21km | Expected: 4000 | Result: ${price21}`);

if (price20 === 5000) {
    console.log("\n✅ SUCCESS: 20km tier is correctly prioritized.");
} else {
    console.log("\n❌ FAILURE: 20km tier logic issue.");
}
