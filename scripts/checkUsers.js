const mongoose = require('mongoose');
const fs = require('fs');

const MONGODB_URI = process.env.MONGODB_URI;

async function checkUsers() {
    try {
        const conn = await mongoose.connect(MONGODB_URI, { dbName: 'taxiadmindash', bufferCommands: false });
        const collection = conn.connection.db.collection('users');
        const users = await collection.find({}).toArray();

        const result = users.map(u => ({
            name: u.name,
            email: u.email,
            role: u.role
        }));

        fs.writeFileSync('users_diag.json', JSON.stringify(result, null, 2));
        console.log('Results written to users_diag.json');
        await mongoose.disconnect();
    } catch (err) {
        console.error(`Error checking users:`, err.message);
    }
}

checkUsers();
