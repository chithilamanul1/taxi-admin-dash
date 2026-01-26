const express = require('express');
const router = express.Router();
const { createBooking, getBookings, updateBookingStatus } = require('../controllers/bookingController');

router.route('/')
    .post(createBooking)
    .get(getBookings);

router.route('/:id')
    .put(updateBookingStatus);

module.exports = router;
