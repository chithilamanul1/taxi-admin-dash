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
    vehicleRateOverrides: { type: Map, of: Number }, // Map of vehicleType to Per KM Rate
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 99 }
}, {
    timestamps: true
});

// Helper to slugify text within the model to avoid import issues in certain environments
function slugify(text) {
    if (!text) return '';
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w-]+/g, '')     // Remove all non-word chars
        .replace(/--+/g, '-')       // Replace multiple - with single -
        .slice(0, 100);              // Limit length
}

destinationSchema.pre('save', function (next) {
    if (this.isModified('name') || !this.slug) {
        this.slug = slugify(this.name);
    }
    next();
});

const Destination = mongoose.models.Destination || mongoose.model('Destination', destinationSchema);

export default Destination;
