import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional - for linked user accounts
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    address: { type: String },
    nic: { type: String, unique: true, sparse: true }, // Changed required: true to optional for legacy support

    vehicleType: { type: String, required: true }, // e.g., 'Car', 'Van', 'Bus'
    vehicleModel: { type: String },
    vehicleNumber: { type: String, required: true },
    vehicleYear: { type: String },

    documents: {
        licenseFront: { type: String },
        licenseBack: { type: String },
        nicFront: { type: String },
        nicBack: { type: String },
        policeReport: { type: String },
    },

    verificationStatus: {
        type: String,
        enum: ['unverified', 'pending', 'verified', 'rejected'],
        default: 'unverified'
    },

    bankDetails: {
        bankName: { type: String },
        branch: { type: String },
        accountNumber: { type: String },
        accountName: { type: String }
    },

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

