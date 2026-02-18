import mongoose from 'mongoose';

const QuickLinkSchema = new mongoose.Schema({
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    badge: {
        type: String,
        default: 'Special Offer'
    },
    image: {
        type: String,
        default: '/test-product.jpg'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export default mongoose.models.QuickLink || mongoose.model('QuickLink', QuickLinkSchema);
