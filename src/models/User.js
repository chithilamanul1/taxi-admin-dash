import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },  // Optional for Google OAuth users
    image: { type: String },  // Profile picture from OAuth
    provider: { type: String, default: 'credentials' }, // credentials, google
    role: { type: String, enum: ['admin', 'user', 'customer', 'driver'], default: 'user' },
    isAdmin: { type: Boolean, default: false },
    permissions: { type: [String], default: [] }, // For granular access control
    pushSubscription: { type: Object } // For Web Push Notifications
}, {
    timestamps: true
});

// Password Hash Middleware
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Password Match Method
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
