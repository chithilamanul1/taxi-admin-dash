import { calculateBasePrice } from './src/lib/pricing-util.js';
import { destinations } from './src/lib/destinations.js';

const miniCar = {
    vehicleType: 'mini-car',
    category: 'airport-transfer',
    basePrice: 3500,
    baseKm: 20,
    perKmRate: 100,
    tiers: [
        { min: 0, max: 20, type: 'flat', price: 3500 },
        { min: 21, max: 40, type: 'flat', price: 4000 },
        { min: 41, max: 130, type: 'per_km', rate: 100 }
    ]
};

// Mock dynamic destinations (from DB)
const dynamicDestinations = [
    {
        name: "Test City",
        title: "Airport to Test City",
        vehicleTiers: {
            "mini-car": [
                { minKm: 0, maxKm: 20, type: 'flat', value: 5000 }
            ]
        }
    }
];

console.log("--- SCENARIO 1: Airport to Test City (20km) ---");
// Currently, isAirportRide will be true, so matchedOverride will be null
const result1 = calculateBasePrice(20, miniCar, 'one-way', 'Airport', 'Test City', dynamicDestinations);
console.log(`Result: ${result1}`);

console.log("\n--- SCENARIO 2: Non-Airport to Test City (20km) ---");
const result2 = calculateBasePrice(20, miniCar, 'one-way', 'Colombo', 'Test City', dynamicDestinations);
console.log(`Result: ${result2}`);

if (result1 === 3500 && result2 === 5000) {
    console.log("\n⚠️ CONFIRMED: Airport rides IGNORE destination overrides.");
}
