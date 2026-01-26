const mongoose = require('mongoose');

const pricingSchema = mongoose.Schema({
    vehicleType: {
        type: String,
        required: true,
        unique: true,
        enum: ['mini-car', 'sedan', 'mini-van-every', 'mini-van-05', 'suv', 'kdh-van', 'mini-bus']
    },
    name: { type: String, required: true },
    basePrice: { type: Number, required: true }, // e.g., Flat rate for first X km
    baseKm: { type: Number, required: true }, // e.g., 20 km
    perKmRate: { type: Number, required: true }, // Standard rate
    tiers: [{
        max: { type: Number }, // Max km for this tier
        type: { type: String, enum: ['flat', 'per_km'] },
        price: { type: Number },
        rate: { type: Number }
    }],
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('Pricing', pricingSchema);
