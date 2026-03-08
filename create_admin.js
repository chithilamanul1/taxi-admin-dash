const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('MONGODB_URI is not defined in .env');
    process.exit(1);
}

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'admin' },
    isAdmin: { type: Boolean, default: true },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function createAdmin() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to DB');

        const email = 'airporttaxis.lk@gmail.com';
        const password = 'admin-secure-pass-2026';
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await User.findOneAndUpdate(
            { email },
            {
                name: 'System Admin',
                email,
                password: hashedPassword,
                role: 'admin',
                isAdmin: true
            },
            { upsert: true, new: true }
        );

        console.log('Admin user updated/created successfully:');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);

    } catch (err) {
        console.error('Error creating admin:', err);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
}

createAdmin();
