import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String },                       // Photo URL
    phone: { type: String },                       // Contact
    vehicleType: { type: String },                 // e.g. "Sedan", "Van"
    vehicleDetails: { type: String },               // e.g. "Toyota Axio - WP CAS 1234"
    experience: { type: String },                  // e.g. "10 Years"
    trips: { type: Number, default: 0 },            // Trip count
    rating: { type: Number, default: 5.0 },         // Star count
    languages: [{ type: String }],                
    description: { type: String },                 
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Driver || mongoose.model('Driver', driverSchema);
