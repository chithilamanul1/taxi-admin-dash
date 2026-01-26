import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional - for linked user accounts
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    vehicleType: { type: String, required: true }, // e.g., 'KDH', 'Sedan'
    vehicleNumber: { type: String, required: true },
    isOnline: { type: Boolean, default: false },
    currentLocation: {
        lat: { type: Number },
        lng: { type: Number }
    },
    status: { type: String, enum: ['free', 'busy'], default: 'free' },
    ratings: { type: Number, default: 5.0 },
    totalRides: { type: Number, default: 0 }
}, {
    timestamps: true
});

const Driver = mongoose.models.Driver || mongoose.model('Driver', driverSchema);

export default Driver;

