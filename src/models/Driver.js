import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    experience: { type: String, required: true }, // e.g., "15 Years"
    trips: { type: String, required: true },      // e.g., "1200+ Safe Trips"
    languages: [{ type: String }],                // Optional: English, Sinhala, etc.
    description: { type: String },                 // Optional bio
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Driver || mongoose.model('Driver', driverSchema);
