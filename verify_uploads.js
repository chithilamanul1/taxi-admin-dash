const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/airport-taxi";

async function verifyUploads() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const drivers = await mongoose.connection.db.collection('drivers').find({}).toArray();
        console.log(`Found ${drivers.length} drivers`);

        drivers.forEach(driver => {
            console.log(`Driver: ${driver.name} | Phone: ${driver.phone}`);
            console.log('Documents:', driver.documents);
        });

        const uploadDir = path.join(process.cwd(), 'public', 'vehicles');
        if (fs.existsSync(uploadDir)) {
            const files = fs.readdirSync(uploadDir);
            console.log(`\nFiles in public/vehicles (${files.length}):`);
            files.slice(0, 10).forEach(f => console.log(' -', f));
        } else {
            console.log('\npublic/vehicles directory does NOT exist.');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

verifyUploads();
