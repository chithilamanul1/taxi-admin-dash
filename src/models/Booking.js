import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional if guest booking
    guestPhone: { type: String }, // For guest checkout
    pickupLocation: {
        address: { type: String, required: true },
        lat: { type: Number },
        lng: { type: Number }
    },
    waypoints: [{
        address: { type: String },
        lat: { type: Number },
        lng: { type: Number }
    }],
    dropoffLocation: {
        address: { type: String, required: true },
        lat: { type: Number },
        lng: { type: Number }
    },
    vehicleType: { type: String, required: false }, // Made optional for tours
    type: { type: String, enum: ['transfer', 'tour'], default: 'transfer' }, // New Type Field
    tourDetails: {
        tourId: String,
        tourTitle: String,
        duration: String,
        inclusions: [String]
    },
    tripType: { type: String, enum: ['one-way', 'round-trip'], default: 'one-way' },
    passengerCount: {
        adults: { type: Number, default: 1 },
        children: { type: Number, default: 0 },
        infants: { type: Number, default: 0 },
        bags: { type: Number, default: 0 }
    },
    distanceKm: { type: Number },
    waitingHours: { type: Number, default: 0 },
    totalPrice: { type: Number }, // Can be 0 for inquiries
    status: {
        type: String,
        enum: ['pending', 'assigned', 'ongoing', 'completed', 'cancelled'],
        default: 'pending'
    },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'partial'], default: 'pending' },
    paymentMethod: { type: String, enum: ['cash', 'card'], default: 'cash' },
    paymentType: { type: String, enum: ['full', 'partial'], default: 'full' },
    currency: { type: String, default: 'LKR' },
    paidAmount: { type: Number, default: 0 }, // Amount to be paid online
    balanceAmount: { type: Number, default: 0 }, // Amount filtered to be paid to driver
    surchargeAmount: { type: Number, default: 0 }, // Added surcharges (convenience/cash fee)
    paymentReference: { type: String },
    paymentTimestamp: { type: Date },
    scheduledDate: { type: String },
    scheduledTime: { type: String },
    customerName: { type: String },
    customerEmail: { type: String },
    nameBoard: {
        enabled: { type: Boolean, default: false },
        text: { type: String }
    },
    couponCode: { type: String },
}, {
    timestamps: true
});

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

export default Booking;
