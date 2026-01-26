const Pricing = require('../models/Pricing');

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
    // Add other vehicles... but for brevity let's start with these two to confirm it works
];

// @desc    Get all pricing rates
// @route   GET /api/pricing
// @access  Public
const getPricing = async (req, res) => {
    try {
        const pricing = await Pricing.find({});
        res.json(pricing);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update pricing for a vehicle type
// @route   PUT /api/pricing/:id
// @access  Private/Admin
const updatePricing = async (req, res) => {
    const { basePrice, baseKm, perKmRate, tiers } = req.body;

    try {
        const pricing = await Pricing.findById(req.params.id);

        if (pricing) {
            pricing.basePrice = basePrice || pricing.basePrice;
            pricing.baseKm = baseKm || pricing.baseKm;
            pricing.perKmRate = perKmRate || pricing.perKmRate;
            pricing.tiers = tiers || pricing.tiers;

            const updatedPricing = await pricing.save();
            res.json(updatedPricing);
        } else {
            res.status(404).json({ message: 'Pricing plan not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Initialize default pricing (if empty)
// @route   POST /api/pricing/init
// @access  Private/Admin
const initPricing = async (req, res) => {
    try {
        const count = await Pricing.countDocuments();
        if (count === 0) {
            await Pricing.insertMany(SEED_DATA);
            res.status(201).json({ message: 'Default pricing initialized', count: SEED_DATA.length });
        } else {
            res.json({ message: 'Pricing already initialized' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getPricing, updatePricing, initPricing };
