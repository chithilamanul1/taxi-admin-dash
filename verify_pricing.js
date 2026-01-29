const fs = require('fs');

async function testPricing() {
    const API_BASE = 'http://localhost:3000';
    console.log('--- STARTING PRICING VERIFICATION ---');

    // Wait for server? We assume it's up.

    // 1. SEED
    /*
    console.log('[1] Seeding...');
    try {
        const seedRes = await fetch(`${API_BASE}/api/seed`);
        if (!seedRes.ok) throw new Error(`Seed status: ${seedRes.status}`);
        console.log('Seed OK:', await seedRes.json());
    } catch (e) {
        console.error('Seeding failed:', e.message);
        return;
    }
    */

    // 2. CHECK RATES
    try {
        const airRes = await fetch(`${API_BASE}/api/pricing?category=airport-transfer`);
        const rideRes = await fetch(`${API_BASE}/api/pricing?category=ride-now`);

        const airData = await airRes.json();
        const rideData = await rideRes.json();

        const airMini = airData.find(v => v.vehicleType === 'mini-car');
        const rideMini = rideData.find(v => v.vehicleType === 'mini-car');

        if (airMini && rideMini) {
            console.log(`Airport Rate: ${airMini.perKmRate}`);
            console.log(`RideNow Rate: ${rideMini.perKmRate}`);
            if (airMini.perKmRate !== rideMini.perKmRate) {
                console.log('SUCCESS: Rates differ.');
            } else {
                console.error('FAIL: Rates are same.');
            }
        } else {
            console.error('FAIL: Missing pricing data for mini-car.');
            console.log('Airport Data:', JSON.stringify(airData).slice(0, 100));
            console.log('RideNow Data:', JSON.stringify(rideData).slice(0, 100));
        }

    } catch (e) {
        console.error('Fetch failed:', e.message);
    }
}

testPricing();
