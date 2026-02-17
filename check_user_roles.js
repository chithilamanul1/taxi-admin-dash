const mongoose = require('mongoose');
require('dotenv').config();

async function checkUsers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB.");

        const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({}, { strict: false }), 'users');

        const admins = await User.find({ $or: [{ role: 'admin' }, { isAdmin: true }] });
        console.log(`Found ${admins.length} potential admins:`);
        admins.forEach(u => {
            console.log(`- Name: ${u.name}, Email: ${u.email}, Role: ${u.role}, isAdmin: ${u.isAdmin}`);
        });

        const allUsers = await User.find().limit(10);
        console.log("\nFirst 10 Users:");
        allUsers.forEach(u => {
            console.log(`- Email: ${u.email}, Role: ${u.role}`);
        });

        process.exit(0);
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
}

checkUsers();
