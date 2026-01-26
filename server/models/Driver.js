const mongoose = require('mongoose');

const driverSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
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

module.exports = mongoose.model('Driver', driverSchema);
