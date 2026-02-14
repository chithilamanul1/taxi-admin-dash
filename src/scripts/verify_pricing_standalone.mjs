
// Standalone Verification Script

const destinations = [
    {
        id: 'galle',
        name: 'Galle',
        pricing: { 'Mini Car': 55 } // 55 * 320 = 17600
    },
    {
        id: 'sigiriya',
        name: 'Sigiriya',
        pricing: { 'Mini Car': 90 } // 90 * 320 = 28800
    }
];

const calculateBasePrice = (distanceKm, vehicleData, tripType = 'one-way', pickup = '', dropoff = '') => {
    if (!vehicleData || distanceKm === 0) return 0;

    const distKm = Math.ceil(distanceKm);
    let baseTotal = 0;

    const isFromAirport = pickup?.toLowerCase().includes('airport');
    const isToAirport = dropoff?.toLowerCase().includes('airport');

    let fixedPrice = 0;
    if (isFromAirport || isToAirport) {
        const destinationName = isFromAirport ? dropoff : pickup;
        const popDest = destinations.find(d =>
            destinationName.toLowerCase().includes(d.name.toLowerCase()) ||
            destinationName.toLowerCase().includes(d.id.toLowerCase())
        );

        if (popDest && popDest.pricing) {
            const vehicleMap = {
                'mini-car': 'Mini Car',
                'sedan': 'Sedan',
                'mini-van-every': 'Mini Van',
                'mini-van-05': 'Mini Van',
                'kdh-van': 'KDH Van',
                'suv': 'Sedan',
                'mini-bus': 'KDH Van'
            };
            const priceUSD = popDest.pricing[vehicleMap[vehicleData.vehicleType]];
            if (priceUSD) {
                const conversionRate = 320;
                fixedPrice = Math.round(priceUSD * conversionRate);
                console.log(`[Pricing] Popular destination match: ${popDest.name} - LKR ${fixedPrice}`);
            }
        }
    }

    const tiers = (vehicleData.tiers || []).sort((a, b) => a.min - b.min);

    // Calculate distance-based price
    let distancePrice = 0;
    if (tiers.length > 0) {
        const matchingTier = tiers.find(t => distKm >= t.min && distKm <= (t.max || Infinity));
        if (matchingTier) {
            if (matchingTier.type === 'flat') {
                distancePrice = matchingTier.price || matchingTier.rate || 0;
            } else {
                distancePrice = distKm * (matchingTier.rate || matchingTier.price || 0);
            }
        }
    }

    if (distancePrice === 0) {
        const basePrice = vehicleData.basePrice || 0;
        const baseKm = vehicleData.baseKm || 0;
        const perKmRate = vehicleData.perKmRate || 0;
        if (distKm <= baseKm) {
            distancePrice = basePrice;
        } else {
            distancePrice = basePrice + ((distKm - baseKm) * perKmRate);
        }
    }

    // Final Comparison: Take fixedPrice ONLY if it is lower than distancePrice
    if (fixedPrice > 0 && distancePrice > 0) {
        baseTotal = Math.min(fixedPrice, distancePrice);
        console.log(`[Pricing] Comparison: Fixed ${fixedPrice} vs Distance ${distancePrice}. Selected: ${baseTotal}`);
    } else {
        baseTotal = fixedPrice || distancePrice;
    }

    // 3. Round Trip Multiplier
    if (tripType === 'round-trip') {
        baseTotal *= 2;
    }

    return Math.round(baseTotal);
};


// --- TESTS ---

const mockVehicle = {
    vehicleType: 'mini-car',
    basePrice: 2000,
    baseKm: 20,
    perKmRate: 100,
    tiers: [
        { min: 0, max: 20, type: 'flat', price: 2000 },
        { min: 21, max: 9999, type: 'per_km', rate: 100 }
    ]
};

console.log("\n--- TEST 1: Fixed Price (High) vs Distance (Low) ---");
// Sigiriya: 150km. Fixed: 28800. Distance: 150 * 100 = 15000.
// Expected: 15000
const t1 = calculateBasePrice(150, mockVehicle, 'one-way', 'Airport', 'Sigiriya');
console.log(`Result: ${t1} (Expected 15000)`);
if (t1 === 15000) console.log("PASS"); else console.error("FAIL");

console.log("\n--- TEST 2: Fixed Price (Low) vs Distance (High) ---");
// Galle: 145km. Fixed: 17600. Distance: 145 * 100 = 14500.
// Wait, 14500 < 17600. So it picks distance. 
// I need a case where Fixed is LOWER.
// Let's create a fake destination "CheapCity"
destinations.push({ id: 'cheap', name: 'CheapCity', pricing: { 'Mini Car': 10 } }); // 3200
// Distance 100km -> 10000. Fixed 3200.
// Expected: 3200.
const t2 = calculateBasePrice(100, mockVehicle, 'one-way', 'Airport', 'CheapCity');
console.log(`Result: ${t2} (Expected 3200)`);
if (t2 === 3200) console.log("PASS"); else console.error("FAIL");

console.log("\n--- TEST 3: No Fixed Price ---");
// Unknown: 100km -> 10000.
const t3 = calculateBasePrice(100, mockVehicle, 'one-way', 'Airport', 'Unknown');
console.log(`Result: ${t3} (Expected 10000)`);
if (t3 === 10000) console.log("PASS"); else console.error("FAIL");

console.log("\n--- TEST 4: Round Trip ---");
// Unknown 100km -> 10000 * 2 = 20000
const t4 = calculateBasePrice(100, mockVehicle, 'round-trip', 'Airport', 'Unknown');
console.log(`Result: ${t4} (Expected 20000)`);
if (t4 === 20000) console.log("PASS"); else console.error("FAIL");

