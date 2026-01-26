import mongoose from 'mongoose';

const LocationOfferSchema = new mongoose.Schema({
    locationKeyword: {
        type: String,
        required: true,
        trim: true
    },
    discountPercentage: {
        type: Number,
        required: true,
        min: 1,
        max: 100
    },
    isActive: {
        type: Boolean,
        default: true
    },
    description: {
        type: String,
        default: ''
    }
}, { timestamps: true });

export default mongoose.models.LocationOffer || mongoose.model('LocationOffer', LocationOfferSchema);
