
import dbConnect from './src/lib/db.js';
import Booking from './src/models/Booking.js';
import mongoose from 'mongoose';

async function checkBooking() {
    await dbConnect();
    const id = '697d97f389e532c20d45237e';
    console.log(`Checking booking ID: ${id}`);

    try {
        const booking = await Booking.findById(id);
        if (booking) {
            console.log('Booking found:', JSON.stringify(booking, null, 2));
        } else {
            console.log('Booking NOT found in database.');
        }
    } catch (error) {
        console.error('Error finding booking:', error.message);
    }

    process.exit();
}

checkBooking();
