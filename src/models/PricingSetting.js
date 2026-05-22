import mongoose from 'mongoose';

const PricingSettingSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true, // e.g., 'global_settings'
        default: 'global_settings'
    },
    longDistanceThreshold: {
        type: Number,
        default: 175, // Default 175km
        required: true
    },
    longDistanceDiscountPercentage: {
        type: Number,
        default: 10, // Default 10%
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    nameBoardPrice: {
        type: Number,
        default: 2000
    },
    waitingHourRate: {
        type: Number,
        default: 1000
    },
    roundTripPackages: [{
        id: String,
        hours: Number,
        vehicleType: String,
        tiers: [{
            km: Number,
            price: Number
        }]
    }],
    airportRoundTripPackages: [{
        id: String,
        hours: Number,
        distance: Number, // Fixed KM limit
        vehicleType: String,
        price: Number     // Flat price
    }],
    updatedBy: {
        type: String // Admin email or ID
    }
}, { timestamps: true });

export default mongoose.models.PricingSetting || mongoose.model('PricingSetting', PricingSettingSchema);
