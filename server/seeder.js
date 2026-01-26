const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Pricing = require('./models/Pricing');

dotenv.config();

const SEED_DATA = [
    {
        vehicleType: 'mini-car',
        name: 'Budget',
        model: 'Suzuki Alto / Wagon R',
        image: '/vehicles/wagon-r.jpeg',
        maxPassengers: 2,
        basePrice: 3500,
        baseKm: 20,
        perKmRate: 92.50,
        tiers: [
            { max: 20, type: 'flat', price: 3500 },
            { max: 40, type: 'flat', price: 4000 },
            { max: 130, type: 'per_km', rate: 100 },
            { max: Infinity, type: 'per_km', rate: 92.50 }
        ]
    },
    {
        vehicleType: 'sedan',
        name: 'City',
        model: 'Toyota Vios / Axio',
        image: '/vehicles/sedan.png',
        maxPassengers: 3,
        basePrice: 4500,
        baseKm: 20,
        perKmRate: 110,
        tiers: [
            { max: 20, type: 'flat', price: 4500 },
            { max: 40, type: 'flat', price: 6000 },
            { max: 50, type: 'per_km', rate: 150 },
            { max: Infinity, type: 'per_km', rate: 110 }
        ]
    },
    {
        vehicleType: 'mini-van-every',
        name: 'Semi',
        model: 'Suzuki Every',
        image: '/vehicles/every.jpg',
        maxPassengers: 3,
        basePrice: 4500,
        baseKm: 20,
        perKmRate: 110,
        tiers: [
            { max: 20, type: 'flat', price: 4500 },
            { max: 40, type: 'flat', price: 6000 },
            { max: Infinity, type: 'per_km', rate: 110 }
        ]
    },
    {
        vehicleType: 'mini-van-05',
        name: 'Car',
        model: 'Toyota Tank / Roomy',
        image: '/vehicles/minivan-4.jpg',
        maxPassengers: 4,
        basePrice: 6000,
        baseKm: 20,
        perKmRate: 120,
        tiers: [
            { max: 20, type: 'flat', price: 6000 },
            { max: Infinity, type: 'per_km', rate: 120 }
        ]
    },
    {
        vehicleType: 'kdh-van',
        name: '9 Seater',
        model: 'Toyota KDH',
        image: '/vehicles/Van.jpg',
        maxPassengers: 9,
        basePrice: 6000,
        baseKm: 20,
        perKmRate: 120,
        tiers: [
            { max: 20, type: 'flat', price: 6000 },
            { max: Infinity, type: 'per_km', rate: 120 }
        ]
    },
    {
        vehicleType: 'mini-bus',
        name: '14 Seater',
        model: 'Toyota Coaster/Mini',
        image: '/vehicles/minibus.jpg',
        maxPassengers: 14,
        basePrice: 7500,
        baseKm: 20,
        perKmRate: 130,
        tiers: [
            { max: 20, type: 'flat', price: 7500 },
            { max: Infinity, type: 'per_km', rate: 130 }
        ]
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeding');

        // Clear existing data to avoid duplicates if re-running
        await Pricing.deleteMany({});
        console.log('Existing Pricing Data Cleared');

        await Pricing.insertMany(SEED_DATA);
        console.log('Pricing Data Seeded Successfully');

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
