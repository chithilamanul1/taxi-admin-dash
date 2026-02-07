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
    isAdmin: { type: Boolean, default: false }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function listUsers() {
    try {
        await dbConnect();
        const users = await User.find({});
        console.log('Total Users:', users.length);
        users.forEach(u => {
            console.log(`- ${u.email} [${u.role}] (isAdmin: ${u.isAdmin})`);
        });
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

listUsers();
