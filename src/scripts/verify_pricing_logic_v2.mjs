
import { calculateBasePrice } from '../lib/pricing-util.js';

// Mock Data
const mockVehicle = {
    vehicleType: 'mini-car',
    basePrice: 2000,
    baseKm: 20,
    perKmRate: 100,
    tiers: [
        { min: 0, max: 20, type: 'flat', price: 2000 },
        { min: 21, max: 200, type: 'per_km', rate: 100 }
    ]
};

const mockDestinations = [
    {
        names: ['Sigiriya'],
        pricing: { 'Mini Car': 90 } // 90 * 320 = 28800
    },
    {
        names: ['CheapPlace'],
        pricing: { 'Mini Car': 10 } // 10 * 320 = 3200
    }
];

// Mocking the destinations import by overriding or assuming the util uses the imported one. 
// Since I cannot easily mock the internal import of 'destinations.js' in 'pricing-util.js' without a complex setup or dependency injection,
// I will rely on the actual 'destinations.js' file. 
// I need to pick a real destination from 'destinations.js' to test.
// From viewed file: Sigiriya (90 USD), Galle (55 USD ~ 17600), Kandy (65 USD).

console.log("--- Starting Pricing Logic Verification ---");

// Test Case 1: Fixed Price High, Distance Price Low
// Sigiriya: 150km. Fixed: ~28800. Distance (150*100): 15000.
// Expected: 15000
const price1 = calculateBasePrice(150, mockVehicle, 'one-way', 'Airport', 'Sigiriya');
console.log(`Test 1 (High Fixed): Distance 150km, Dest Sigiriya. Expected ~15000. Got: ${price1}`);

// Test Case 2: Fixed Price Low (Hypothetical, might not exist in real data, but let's try a short distance popular spot if any)
// Let's use a manual calculation check.
// If I use a destination NOT in the list, it should use distance.
const price2 = calculateBasePrice(100, mockVehicle, 'one-way', 'Airport', 'UnknownCity');
console.log(`Test 2 (No Fixed): Distance 100km, Dest Unknown. Expected 10000 (100*100). Got: ${price2}`);

// Test Case 3: Round Trip
const price3 = calculateBasePrice(100, mockVehicle, 'round-trip', 'Airport', 'UnknownCity');
console.log(`Test 3 (Round Trip): Distance 100km. Expected 20000. Got: ${price3}`);

// Test Case 4: Base Price Fallback (Short Distance)
// 10km. Tier 0-20 is flat 2000.
const price4 = calculateBasePrice(10, mockVehicle, 'one-way', 'Airport', 'Nearby');
console.log(`Test 4 (Short Dist): Distance 10km. Expected 2000. Got: ${price4}`);
