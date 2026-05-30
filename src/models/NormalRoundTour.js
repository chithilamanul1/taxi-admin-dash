import mongoose from 'mongoose';

const tierSchema = new mongoose.Schema({
    km: { type: Number, required: true },
    price: { type: Number, required: true }
}, { _id: false });

const NormalRoundTourSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    hours: { type: Number, required: true },
    vehicleType: { type: String, required: true },
    tiers: [tierSchema]
}, { timestamps: true });

// Create a compound index so we can easily query by hours and vehicle type
NormalRoundTourSchema.index({ hours: 1, vehicleType: 1 }, { unique: true });

export default mongoose.models.NormalRoundTour || mongoose.model('NormalRoundTour', NormalRoundTourSchema);
