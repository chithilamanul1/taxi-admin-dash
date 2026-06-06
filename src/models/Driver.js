import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Linked user account
    name: { type: String, required: true },
    password: { type: String },                    // Legacy/direct login password or PIN
    image: { type: String },                       // Photo URL
    phone: { type: String },                       // Contact
    vehicleType: { type: String },                 // e.g. "Sedan", "Van"
    vehicleNumber: { type: String },               // License plate number
    vehicleDetails: { type: String },               // e.g. "Toyota Axio - WP CAS 1234"
    experience: { type: String },                  // e.g. "10 Years"
    trips: { type: Number, default: 0 },            // Trip count
    rating: { type: Number, default: 5.0 },         // Star count
    languages: [{ type: String }],                
    description: { type: String },                 
    isActive: { type: Boolean, default: true },
    isOnline: { type: Boolean, default: false },    // For real-time tracking
    currentLocation: {
        lat: { type: Number },
        lng: { type: Number }
    },
    walletBalance: { type: Number, default: 0 },    // Commission prepay balance
    minBalanceThreshold: { type: Number, default: 5000 }, // Minimum balance to go online
    status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
    sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Driver || mongoose.model('Driver', driverSchema);
