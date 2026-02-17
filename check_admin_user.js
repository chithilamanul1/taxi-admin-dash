const mongoose = require('mongoose');
require('dotenv').config();

async function checkAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({}, { strict: false }), 'users');
        const user = await User.findOne({ email: 'admin@airporttaxis.lk' });
        if (user) {
            console.log(`Found User: ${user.email}`);
            console.log(`Role: ${user.role}`);
            console.log(`isAdmin: ${user.isAdmin}`);
        } else {
            console.log("Admin user not found.");
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkAdmin();
