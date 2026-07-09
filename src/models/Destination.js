import mongoose from 'mongoose';

const destinationSchema = new mongoose.Schema({
    id: { type: String, unique: true, required: true },
    title: { type: String, required: true },
    name: { type: String, required: true },
    pickupLocation: { type: String },
    slug: { type: String, unique: true },
    price: { type: Number, default: 0 },
    badge: { type: String },
    img: { type: String },
    meta: { type: String },
    description: { type: String },
    distance: { type: String },
    time: { type: String },
    highlights: { type: [String], default: [] },
    pricing: { type: Map, of: Number }, // Map of vehicleType/Label to Price
    perKmRateOverride: { type: Number }, // Manual override for Per KM Rate for this destination
    vehicleRateOverrides: { type: Map, of: Number }, // Map of vehicleType to Per KM Rate
    // Tiered Rates (e.g. 0-20km flat rate, 20-50km per-km rate)
    // Map of vehicleType -> Array of tiers
    vehicleTiers: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
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
    applicableRideType: { type: String, enum: ['all', 'airport-only', 'non-airport-only'], default: 'all' },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 99 }
}, {
    timestamps: true
});

const Destination = mongoose.models.Destination || mongoose.model('Destination', destinationSchema);

export default Destination;
