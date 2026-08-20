const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb://chithila:chithila123@187.77.128.167:27017/admin?authSource=admin';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'admin' },
    isAdmin: { type: Boolean, default: true }
}, {
    timestamps: true
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function setupAdmin() {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(MONGODB_URI, { dbName: 'taxiadmindash' });
        console.log('Connected!');

        const email = 'airporttaxis.lk@gmail.com';
        const rawPassword = process.env.DEFAULT_ADMIN_PASSWORD;
        if (!rawPassword) {
            console.error('Error: DEFAULT_ADMIN_PASSWORD environment variable is not set.');
            process.exit(1);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(rawPassword, salt);

        const adminData = {
            name: 'Super Admin',
            email: email,
            password: hashedPassword,
            role: 'admin',
            isAdmin: true
        };

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            console.log('User already exists. Updating password and role...');
            existingUser.password = hashedPassword;
            existingUser.role = 'admin';
            existingUser.isAdmin = true;
            await existingUser.save();
            console.log('Admin user updated successfully.');
        } else {
            console.log('Creating new admin user...');
            await User.create(adminData);
            console.log('Admin user created successfully.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error setting up admin:', error);
        process.exit(1);
    }
}

setupAdmin();
