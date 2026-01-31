import mongoose from 'mongoose';

const TourSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    description: { type: String, required: true },
    category: {
        type: String,
        enum: ['Day Tours', 'City Tours', 'Safari', 'Multi-Day'],
        default: 'Day Tours'
    },
    duration: { type: Number, required: true, default: 1 }, // Days
    price: { type: Number, required: true }, // Base price in USD usually
    image: { type: String, required: true }, // Main thumbnail
    images: { type: [String], default: [] }, // Gallery
    rating: { type: Number, default: 4.8 },
    highlights: { type: [String], default: [] },
    itinerary: [{
        day: Number,
        title: String,
        description: String,
        activity: String
    }],
    inclusions: { type: [String], default: [] },
    exclusions: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 } // For sorting
}, { timestamps: true });

export default mongoose.models.Tour || mongoose.model('Tour', TourSchema);
