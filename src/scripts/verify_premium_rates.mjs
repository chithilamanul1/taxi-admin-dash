import { calculateBasePrice } from '../lib/pricing-util.js';

// --- MOCK DATA ---
const mockVehicle = {
    vehicleType: 'mini-car',
    basePrice: 2000,
    baseKm: 20, // Should be ignored by new logic
    perKmRate: 102, // Standard Rate
    tiers: []
};

const dynamicDestinations = [
    {
        id: 'loc-sigiriya',
        name: 'Sigiriya',
        title: 'Airport to Sigiriya',
        pricing: { 'Mini Car': 90 }, // 90 * 320 = 28800 LKR (Fixed)
        perKmRateOverride: 130 // PREMIUM ROUTE RATE
    },
    {
        id: 'loc-kandy',
        name: 'Kandy',
        title: 'Airport to Kandy',
        pricing: { 'Mini Car': 65 }, // 65 * 320 = 20800 LKR (Fixed)
        perKmRateOverride: 0 // NO OVERRIDE
    }
];

// --- TESTS ---

console.log("\n--- TEST 1: Premium Route (Sigiriya, Override 130) ---");
// Logic: (150km * 130) + 500 = 19500 + 500 = 20000 LKR
// Note: Fixed price is 28800. Since Override is applied, it MUST pick the distance calculated price.
const t1 = calculateBasePrice(150, mockVehicle, 'one-way', 'Airport', 'Sigiriya', dynamicDestinations);
console.log(`Result: ${t1} (Expected 20000)`);
if (t1 === 20000) console.log("PASS\n"); else console.error("FAIL\n");

console.log("--- TEST 2: Standard Route (Unknown/No Override) ---");
// Logic: (100km * 102) + 500 = 10200 + 500 = 10700 LKR
const t2 = calculateBasePrice(100, mockVehicle, 'one-way', 'Airport', 'UnknownCity', dynamicDestinations);
console.log(`Result: ${t2} (Expected 10700)`);
if (t2 === 10700) console.log("PASS\n"); else console.error("FAIL\n");

console.log("--- TEST 3: Popular Location, No Override, Fixed Cheaper ---");
// Logic: Kandy is 103km. 
// Distance Price = (103 * 102) + 500 = 10506 + 500 = 11006 LKR.
// Fixed Price = 20800 LKR.
// It should pick the lower of the two: 11006.
const t3 = calculateBasePrice(103, mockVehicle, 'one-way', 'Airport', 'Kandy', dynamicDestinations);
console.log(`Result: ${t3} (Expected 11006)`);
if (t3 === 11006) console.log("PASS\n"); else console.error("FAIL\n");

console.log("--- TEST 4: Round Trip Premium ---");
// Logic: 20000 * 2 = 40000
const t4 = calculateBasePrice(150, mockVehicle, 'round-trip', 'Airport', 'Sigiriya', dynamicDestinations);
console.log(`Result: ${t4} (Expected 40000)`);
if (t4 === 40000) console.log("PASS\n"); else console.error("FAIL\n");
