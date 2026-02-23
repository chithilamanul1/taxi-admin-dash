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
    currency: {
        type: String,
        enum: ['LKR', 'USD', 'EUR'],
        default: 'USD'
    },
    badge: {
        type: String,
        default: 'Special Offer'
    },
    image: {
        type: String,
        default: '/test-product.jpg'
    },
    allowedPaymentMode: {
        type: String,
        enum: ['full', 'partial', 'both'],
        default: 'both'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export default mongoose.models.QuickLink || mongoose.model('QuickLink', QuickLinkSchema);
