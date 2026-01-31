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
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 99 } // For custom display order
}, {
    timestamps: true
});

pricingSchema.index({ vehicleType: 1, category: 1 }, { unique: true });

// Calculate price based on distance, trip type, and waiting hours
pricingSchema.methods.calculatePrice = function (distanceKm, tripType = 'one-way', waitingHours = 0) {
    let totalPrice = 0;

    // 1. Find the matching tier based on TOTAL distance
    // Tiers should be defined as ranges: 0-20, 21-40, 41-50, etc.
    // We look for the tier where min <= distance <= max
    const matchingTier = this.tiers.find(t => distanceKm >= t.min && distanceKm <= (t.max || Infinity));

    if (matchingTier) {
        if (matchingTier.type === 'flat') {
            totalPrice = matchingTier.price;
        } else if (matchingTier.type === 'per_km') {
            // For Per KM, usually it implies Total Distance * Rate for this tier
            totalPrice = distanceKm * matchingTier.rate;
        }
    } else {
        // Fallback: Use Base Price + (Dist - BaseKm) * PerKmRate
        // This handles cases where no tier is defined (legacy)
        if (distanceKm <= this.baseKm) {
            totalPrice = this.basePrice;
        } else {
            const extraKm = distanceKm - this.baseKm;
            totalPrice = this.basePrice + (extraKm * this.perKmRate);
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
            // Fallback hourly rate
            totalPrice += waitingHours * (this.hourlyRate || 0);
        }
    }

    return Math.round(totalPrice);
};

const Pricing = mongoose.models.Pricing || mongoose.model('Pricing', pricingSchema);

export default Pricing;
