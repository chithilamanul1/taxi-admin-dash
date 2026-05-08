import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional if guest booking
    guestPhone: { type: String }, // For guest checkout
    whatsappNumber: { type: String }, // Customer WhatsApp number
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
    type: { type: String, enum: ['transfer', 'tour', 'day-trip'], default: 'transfer' }, // Extended Type Field
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
        luggage: { type: Number, default: 0 },
        handLuggage: { type: Number, default: 0 }
    },
    distanceKm: { type: Number },
    duration: { type: String },
    waitingHours: { type: Number, default: 0 },
    totalPrice: { type: Number }, // Can be 0 for inquiries
    status: {
        type: String,
        enum: ['pending', 'assigned', 'arrived', 'ongoing', 'completed', 'cancelled'],
        default: 'pending'
    },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'partial'], default: 'pending' },
    paymentMethod: { type: String, enum: ['cash', 'card'], default: 'cash' },
    paymentType: { type: String, enum: ['full', 'partial'], default: 'full' },
    currency: { type: String, default: 'LKR' },
    paidAmount: { type: Number, default: 0 }, // Amount to be paid online (LKR)
    balanceAmount: { type: Number, default: 0 }, // Amount filtered to be paid to driver (LKR)
    surchargeAmount: { type: Number, default: 0 }, // Added surcharges (convenience/cash fee) (LKR)
    displayPrice: { type: Number }, // Price in customer's selected currency
    displayPaidAmount: { type: Number }, // Paid amount in customer's selected currency
    displayBalanceAmount: { type: Number }, // Balance amount in customer's selected currency
    paymentReference: { type: String },
    paymentTimestamp: { type: Date },
    scheduledDate: { type: String },
    scheduledTime: { type: String },
    arrivalDate: { type: String },
    arrivalTime: { type: String },
    returnDate: { type: String },
    returnTime: { type: String },
    customerName: { type: String },
    customerEmail: { type: String },
    passport: { type: String },
    nameBoard: {
        enabled: { type: Boolean, default: false },
        text: { type: String }
    },
    flightNumber: { type: String },
    couponCode: { type: String },
    appliedCoupons: [String],
    gatewayResponse: { type: String }, // Store raw JSON from bank
    gatewayReason: { type: String },   // Store readable error message
    billingDetails: {
        billingName: String,
        billingAddress: String,
        city: String,
        country: String
    },
    isManual: { type: Boolean, default: false }, // For manually generated invoices
    notes: { type: String },
    rating: { type: Number, min: 1, max: 5 }, // Customer rating (1-5)
    review: { type: String } // Customer feedback text
}, {
    timestamps: true
});

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

export default Booking;
