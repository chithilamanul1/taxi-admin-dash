const mongoose = require('mongoose');
require('dotenv').config();

async function promoteToAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const User = require('../src/models/User').default || mongoose.model('User');

        const email = 'chithilamanul1@gmail.com';
        const user = await User.findOne({ email });

        if (!user) {
            console.log('User not found:', email);
            return;
        }

        console.log('Current Role:', user.role);

        user.role = 'admin';
        user.isAdmin = true;
        user.permissions = ['all'];

        await user.save();
        console.log('User promoted to ADMIN successfully');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

promoteToAdmin();
