const mongoose = require('mongoose');
const fs = require('fs');

const MONGODB_URI = process.env.MONGODB_URI;

async function checkDetailed(dbName) {
    const result = { dbName, status: 'unknown' };
    try {
        const conn = await mongoose.connect(MONGODB_URI, { dbName, bufferCommands: false });
        result.status = 'connected';
        result.connectionName = conn.connection.name;

        const collection = conn.connection.db.collection('bookings');
        result.totalBookings = await collection.countDocuments();
        result.pendingBookings = await collection.countDocuments({ status: 'pending' });

        const recent = await collection.find({}).sort({ createdAt: -1 }).limit(20).toArray();
        result.recentBookings = recent.map(b => ({
            id: b._id,
            status: b.status,
            customerEmail: b.customerEmail,
            customerName: b.customerName,
            scheduledDate: b.scheduledDate,
            createdAt: b.createdAt
        }));

        await mongoose.disconnect();
    } catch (err) {
        result.status = 'error';
        result.error = err.message;
    }
    return result;
}

async function run() {
    if (!MONGODB_URI) {
        fs.writeFileSync('diag_result.json', JSON.stringify({ error: 'No MONGODB_URI' }));
        return;
    }
    const taxiadmindash = await checkDetailed('taxiadmindash');
    const test = await checkDetailed('test');

    fs.writeFileSync('diag_result.json', JSON.stringify({ taxiadmindash, test }, null, 2));
    console.log('Results written to diag_result.json');
}

run();
