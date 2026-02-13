
import dbConnect from './src/lib/db.js';
import Booking from './src/models/Booking.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function checkBooking() {
    try {
        await dbConnect();
        const id = '697d97f389e532c20d45237e';
        console.log(`Checking booking ID: ${id}`);

        const booking = await Booking.findById(id).lean();
        if (booking) {
            console.log('--- BOOKING FOUND ---');
            console.log('ID:', booking._id);
            console.log('Customer:', booking.customerName);
            console.log('Total Price:', booking.totalPrice);
            console.log('Currency:', booking.currency);
            console.log('Payment Status:', booking.paymentStatus);
        } else {
            console.log('Booking NOT found in database.');
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
}

checkBooking();
