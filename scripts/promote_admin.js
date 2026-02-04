const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(process.cwd(), '.env.local') });
dotenv.config({ path: path.join(process.cwd(), '.env') });

// Since the User model is in ES module format (export default), we need a dynamic import or define the schema here.
// For simplicity in a script, defining the schema inline is often safer to avoid module resolution issues.

const dbConnect = async () => {
    if (mongoose.connection.readyState >= 1) {
        return;
    }
    return mongoose.connect(process.env.MONGODB_URI);
};

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, select: false },
    image: String,
    role: { type: String, default: 'user' },
    provider: { type: String, default: 'credentials' },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function promoteToAdmin(email) {
    try {
        console.log('Connecting to DB...');
        await dbConnect();
        console.log('Connected.');

        if (!email) {
            console.log('Please provide an email as argument.');
            process.exit(1);
        }

        const user = await User.findOneAndUpdate(
            { email: email },
            { role: 'admin' },
            { new: true }
        );

        if (user) {
            console.log(`Successfully promoted ${user.email} to '${user.role}'`);
        } else {
            console.log(`User with email ${email} not found.`);
        }

    } catch (error) {
        console.error('Error promoting user:', error);
    } finally {
        await mongoose.disconnect();
    }
}

// Get email from command line argument
const targetEmail = process.argv[2];
promoteToAdmin(targetEmail);
