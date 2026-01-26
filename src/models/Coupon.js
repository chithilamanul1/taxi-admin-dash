import mongoose from 'mongoose';

const CouponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    discountType: {
        type: String,
        enum: ['percentage', 'flat'],
        default: 'percentage'
    },
    value: {
        type: Number,
        required: true
    },
    expiryDate: {
        type: Date
    },
    usageLimit: {
        type: Number,
        default: null
    },
    usedCount: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    applicableLocations: {
        type: [String],
        default: [] // e.g. ['galle', 'kandy'] - if empty, valid everywhere
    }
}, { timestamps: true });

export default mongoose.models.Coupon || mongoose.model('Coupon', CouponSchema);
