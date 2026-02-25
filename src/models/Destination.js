import mongoose from 'mongoose';

const destinationSchema = new mongoose.Schema({
    id: { type: String, unique: true, required: true },
    title: { type: String, required: true },
    name: { type: String, required: true },
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
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 99 }
}, {
    timestamps: true
});

import { slugify } from '@/lib/slugify';

destinationSchema.pre('save', function (next) {
    if (this.isModified('name') || !this.slug) {
        this.slug = slugify(this.name);
    }
    next();
});

const Destination = mongoose.models.Destination || mongoose.model('Destination', destinationSchema);

export default Destination;
