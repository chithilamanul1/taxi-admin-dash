const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('MONGODB_URI is not defined in .env');
    process.exit(1);
}

const SUPER_ADMINS = [
    'chithilamanul1@gmail.com',
    'airporttaxis.lk@gmail.com',
    'airporttaxis@gmail.com'
];

// Minimal User Schema
const UserSchema = new mongoose.Schema({
    email: String,
    role: String,
    isAdmin: Boolean,
    name: String
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function verifyAdmins() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected successfully.\n');

        for (const email of SUPER_ADMINS) {
            const user = await User.findOne({ email });
            if (user) {
                console.log(`[FOUND] ${email}`);
                console.log(`  - Name: ${user.name}`);
                console.log(`  - Role: ${user.role}`);
                console.log(`  - isAdmin: ${user.isAdmin}`);
                console.log(`  - Permissions: ${user.permissions || 'N/A'}`);
            } else {
                console.log(`[NOT FOUND] ${email}`);
            }
            console.log('-------------------');
        }

        // List all admins in the DB
        console.log('\nListing all users with role "admin":');
        const admins = await User.find({ role: 'admin' });
        if (admins.length > 0) {
            admins.forEach(u => {
                console.log(` - ${u.email} (${u.name})`);
            });
        } else {
            console.log(' No users found with role "admin".');
        }

    } catch (error) {
        console.error('Verification failed:', error);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
}

verifyAdmins();
