import mongoose from 'mongoose';

const tierSchema = new mongoose.Schema({
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    type: { type: String, enum: ['flat', 'per_km'], required: true },
    price: { type: Number, default: 0 }, // For flat rate
    rate: { type: Number, default: 0 }   // For per_km
}, { _id: false });

const pricingSchema = new mongoose.Schema({
    vehicleType: {
        type: String,
        required: true,
        enum: ['mini-car', 'sedan', 'mini-van-every', 'mini-van-05', 'suv', 'kdh-van', 'mini-bus']
    },
    category: {
        type: String,
        required: true,
        enum: ['airport-transfer', 'ride-now', 'tours', 'rentals'],
        default: 'airport-transfer'
    },
    name: { type: String, required: true },
    image: { type: String, default: '' },
    capacity: { type: Number, default: 4 },
    luggage: { type: Number, default: 2 },
    handLuggage: { type: Number, default: 2 },
    features: { type: [String], default: [] },
    basePrice: { type: Number, required: true },
    baseKm: { type: Number, default: 20 },
    perKmRate: { type: Number, required: true },
    hourlyRate: { type: Number, default: 0 }, // Fallback if waitingCharges not defined
    waitingCharges: { type: [Number], default: [] }, // Specific rates for [1hr, 2hr, 3hr...]
    tiers: [tierSchema],
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true
});

pricingSchema.index({ vehicleType: 1, category: 1 }, { unique: true });

// Calculate price based on distance, trip type, and waiting hours
pricingSchema.methods.calculatePrice = function (distanceKm, tripType = 'one-way', waitingHours = 0) {
    let totalPrice = 0;
    let remainingKm = distanceKm;

    // Sort tiers by min km
    const sortedTiers = [...this.tiers].sort((a, b) => a.min - b.min);

    for (const tier of sortedTiers) {
        if (remainingKm <= 0) break;

        const tierStart = tier.min;
        const tierEnd = tier.max;
        const kmInTier = Math.min(remainingKm, tierEnd - tierStart + 1);

        if (distanceKm >= tierStart) {
            if (tier.type === 'flat') {
                totalPrice = tier.price;
            } else if (tier.type === 'per_km') {
                const kmToCharge = Math.min(remainingKm, tierEnd - Math.max(tierStart, distanceKm - remainingKm + 1) + 1);
                totalPrice += kmToCharge * tier.rate;
            }
            remainingKm -= kmInTier;
        }
    }

    // Apply Round Trip Multiplier
    if (tripType === 'round-trip') {
        totalPrice = totalPrice * 2;
    }

    // Add Waiting Charges
    if (waitingHours > 0) {
        if (this.waitingCharges && this.waitingCharges.length >= waitingHours) {
            totalPrice += this.waitingCharges[waitingHours - 1];
        } else {
            totalPrice += waitingHours * (this.hourlyRate || 0);
        }
    }

    return Math.round(totalPrice);
};

const Pricing = mongoose.models.Pricing || mongoose.model('Pricing', pricingSchema);

export default Pricing;
