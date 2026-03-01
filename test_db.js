const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

async function testConnection() {
    try {
        console.log('Testing connection to:', MONGODB_URI ? MONGODB_URI.split('@')[1] : 'UNDEFINED');
        await mongoose.connect(MONGODB_URI);
        console.log('SUCCESS: Connected to MongoDB.');
        await mongoose.connection.close();
    } catch (err) {
        console.error('ERROR: Could not connect to MongoDB:', err.message);
    }
    process.exit(0);
}

testConnection();
