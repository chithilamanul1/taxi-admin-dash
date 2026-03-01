const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('MONGODB_URI is not defined in .env');
    process.exit(1);
}

const EMAILS_TO_PROMOTE = [
    'airporttaxis.lk@gmail.com',
    'chithilamanul1@gmail.com',
    'airporttaxis@gmail.com'
];

const UserSchema = new mongoose.Schema({
    email: String,
    role: String,
    isAdmin: Boolean,
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function promoteUsers() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected successfully.\n');

        for (const email of EMAILS_TO_PROMOTE) {
            console.log(`Updating ${email}...`);
            const result = await User.findOneAndUpdate(
                { email },
                { role: 'admin', isAdmin: true },
                { new: true, upsert: false }
            );

            if (result) {
                console.log(`[SUCCESS] Updated ${email}. Role: ${result.role}, isAdmin: ${result.isAdmin}`);
            } else {
                console.log(`[NOT FOUND] User with email ${email} does not exist in the database.`);
            }
        }

    } catch (error) {
        console.error('Promotion failed:', error);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
}

promoteUsers();
