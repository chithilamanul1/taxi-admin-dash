const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(process.cwd(), '.env.local') });
dotenv.config({ path: path.join(process.cwd(), '.env') });

const dbConnect = async () => {
    if (mongoose.connection.readyState >= 1) {
        return;
    }
    return mongoose.connect(process.env.MONGODB_URI);
};

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, required: true },
    role: { type: String, default: 'user' },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function checkAdmin(email) {
    try {
        await dbConnect();
        const user = await User.findOne({ email: email });
        if (user) {
            console.log(`User: ${user.email}`);
            console.log(`Role: ${user.role}`);
        } else {
            console.log('User not found');
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

const targetEmail = process.argv[2];
checkAdmin(targetEmail);
