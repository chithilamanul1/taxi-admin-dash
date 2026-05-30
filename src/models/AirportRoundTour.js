import mongoose from 'mongoose';

const tierSchema = new mongoose.Schema({
    km: { type: Number, required: true },
    price: { type: Number, required: true }
}, { _id: false });

const AirportRoundTourSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    hours: { type: Number, required: true },
    vehicleType: { type: String, required: true },
    tiers: [tierSchema]
}, { timestamps: true });

// Create a compound index so we can easily query by hours and vehicle type
AirportRoundTourSchema.index({ hours: 1, vehicleType: 1 }, { unique: true });

export default mongoose.models.AirportRoundTour || mongoose.model('AirportRoundTour', AirportRoundTourSchema);
