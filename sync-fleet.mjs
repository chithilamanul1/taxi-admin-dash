import 'dotenv/config';
import dbConnect from './src/lib/db.js';
import Pricing from './src/models/Pricing.js';

const DESIRED_FLEET = [
    {
        vehicleType: 'mini-car',
        name: 'Mini Car',
        capacity: 3,
        luggage: 2,
        handLuggage: 2,
        image: '/vehicles/minicar.png',
        basePrice: 3500,
        perKmRate: 102,
        baseKm: 20
    },
    {
        vehicleType: 'sedan',
        name: 'Sedan',
        capacity: 4,
        luggage: 3,
        handLuggage: 2,
        image: '/vehicles/sedancar.png',
        basePrice: 4500,
        perKmRate: 110,
        baseKm: 20
    },
    {
        vehicleType: 'vezel',
        name: 'Honda Vezel',
        capacity: 4,
        luggage: 3,
        handLuggage: 2,
        image: '/vehicles/Hondavezel.png',
        basePrice: 5500,
        perKmRate: 135,
        baseKm: 20
    },
    {
        vehicleType: 'mini-van-every',
        name: 'Mini Van',
        capacity: 4,
        luggage: 4,
        handLuggage: 2,
        image: '/vehicles/susukievery.png',
        basePrice: 4500,
        perKmRate: 110,
        baseKm: 20
    },
    {
        vehicleType: 'suv',
        name: 'SUV',
        capacity: 4,
        luggage: 4,
        handLuggage: 2,
        image: '/vehicles/Hondavezel.png', // White SUV placeholder
        basePrice: 6500,
        perKmRate: 135,
        baseKm: 20
    },
    {
        vehicleType: 'normal-kdh',
        name: 'Normal Van',
        capacity: 9,
        luggage: 6,
        handLuggage: 2,
        image: '/vehicles/kdh-flat.png',
        basePrice: 6000,
        perKmRate: 120,
        baseKm: 20
    },
    {
        vehicleType: 'kdh-van',
        name: 'KDH High Roof Van',
        capacity: 9,
        luggage: 8,
        handLuggage: 2,
        image: '/vehicles/toyota-highroof.png',
        basePrice: 6000,
        perKmRate: 120,
        baseKm: 20
    },
    {
        vehicleType: 'mini-bus',
        name: 'Mini Bus',
        capacity: 20,
        luggage: 15,
        handLuggage: 2,
        image: '/vehicles/costerbus.png',
        basePrice: 7500,
        perKmRate: 155,
        baseKm: 20
    },
    {
        vehicleType: 'coach-bus',
        name: 'Luxury Coach Bus',
        capacity: 45,
        luggage: 40,
        handLuggage: 10,
        image: '/vehicles/coach-bus.png',
        basePrice: 25000,
        perKmRate: 450,
        baseKm: 20
    }
];

async function syncFleet() {
    try {
        await dbConnect();

        const categories = ['airport-transfer', 'ride-now'];
        const activeTypes = DESIRED_FLEET.map(v => v.vehicleType);

        for (const category of categories) {
            console.log(`Syncing category: ${category}`);

            for (const v of DESIRED_FLEET) {
                const filter = { vehicleType: v.vehicleType, category };
                const update = {
                    ...v,
                    category,
                    isActive: true,
                    // Ensure tiers exist if missing, using base prices
                    $setOnInsert: {
                        tiers: [
                            { min: 0, max: v.baseKm, type: 'flat', price: v.basePrice, rate: 0 },
                            { min: v.baseKm + 1, max: 9999, type: 'per_km', price: 0, rate: v.perKmRate }
                        ]
                    }
                };

                await Pricing.findOneAndUpdate(filter, update, { upsert: true, new: true });
                console.log(`  - Upserted ${v.name} (${v.vehicleType})`);
            }

            // Optional: Deactivate or delete vehicles NOT in our list for this category
            const res = await Pricing.updateMany(
                { category, vehicleType: { $nin: activeTypes } },
                { isActive: false }
            );
            console.log(`  - Deactivated ${res.modifiedCount} redundant vehicles`);
        }

        console.log('Fleet Sync Complete!');
    } catch (err) {
        console.error("Sync Error:", err);
    } finally {
        process.exit(0);
    }
}

syncFleet();
