const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(process.cwd(), '.env') });

const dbConnect = async () => {
    if (mongoose.connection.readyState >= 1) return;
    return mongoose.connect(process.env.MONGODB_URI);
};

const userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function resetPassword() {
    try {
        await dbConnect();
        const email = 'admin@airporttaxitours.lk';
        const newPassword = 'Admin@Taxi2026!'; // Temporary secure password

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const user = await User.findOneAndUpdate(
            { email },
            { password: hashedPassword, role: 'admin' },
            { new: true }
        );

        if (user) {
            console.log('SUCCESS: Password reset for admin@airporttaxitours.lk');
            console.log('New Password: ' + newPassword);
        } else {
            console.log('ERROR: User not found.');
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

resetPassword();
