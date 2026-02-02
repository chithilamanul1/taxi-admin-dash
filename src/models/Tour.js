import mongoose from 'mongoose';

const itinerarySchema = new mongoose.Schema({
    day: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String },
    activities: { type: [String], default: [] }, // Array of strings for bullets
    overnightStay: { type: String }
}, { _id: false });

const tourSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    category: {
        type: String,
        enum: ['tour-package', 'day-trip', 'safari'],
        required: true,
        default: 'tour-package'
    },
    duration: {
        days: { type: Number, required: true },
        nights: { type: Number, required: true }
    },
    description: { type: String, required: true },
    shortDescription: { type: String }, // For card view (excerpt)
    images: { type: [String], default: [] },
    heroImage: { type: String },

    // Pricing
    price: {
        amount: { type: Number, required: true },
        currency: { type: String, default: 'USD' },
        type: { type: String, enum: ['fixed', 'from', 'per-person'], default: 'from' }
    },

    // Details
    destinations: { type: [String], default: [] }, // Tags: Kandy, Yala...
    inclusions: { type: [String], default: [] },
    exclusions: { type: [String], default: [] },
    itinerary: [itinerarySchema],

    // Meta
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 }
}, {
    timestamps: true
});

// Force model recompilation in Dev to pick up Enum changes
if (process.env.NODE_ENV !== 'production') {
    delete mongoose.models.Tour;
}

const Tour = mongoose.models.Tour || mongoose.model('Tour', tourSchema);

export default Tour;
