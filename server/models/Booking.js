const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional if guest booking
    guestPhone: { type: String }, // For guest checkout
    pickupLocation: {
        address: { type: String, required: true },
        lat: { type: Number },
        lng: { type: Number }
    },
    dropoffLocation: {
        address: { type: String, required: true },
        lat: { type: Number },
        lng: { type: Number }
    },
    vehicleType: { type: String, required: true },
    distanceKm: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending', 'assigned', 'ongoing', 'completed', 'cancelled'],
        default: 'pending'
    },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    paymentMethod: { type: String, enum: ['cash', 'card'], default: 'cash' }
}, {
    timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);
