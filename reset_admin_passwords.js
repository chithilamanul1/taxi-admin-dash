const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');

dotenv.config({ path: path.join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('MONGODB_URI is not defined in .env');
    process.exit(1);
}

const ADMIN_EMAILS = [
    'airporttaxis.lk@gmail.com',
    'chithilamanul1@gmail.com'
];

const NEW_PASSWORD = 'AdminPass123!';

const UserSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function resetPasswords() {
    try {
        console.log('Connecting to MongoDB (taxiadmindash)...');
        await mongoose.connect(MONGODB_URI, { dbName: 'taxiadmindash' });
        console.log('Connected successfully.\n');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(NEW_PASSWORD, salt);

        for (const email of ADMIN_EMAILS) {
            console.log(`Resetting password for ${email}...`);
            const result = await User.findOneAndUpdate(
                { email },
                { password: hashedPassword },
                { new: true }
            );

            if (result) {
                console.log(`[SUCCESS] Password reset for ${email}`);
            } else {
                console.log(`[NOT FOUND] User ${email} not found.`);
            }
        }

    } catch (error) {
        console.error('Reset failed:', error);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
}

resetPasswords();
