const Booking = require('../models/Booking');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Public
const createBooking = async (req, res) => {
    try {
        const {
            pickupLocation,
            dropoffLocation,
            vehicleType,
            distanceKm,
            totalPrice,
            guestPhone,
            date,
            time
        } = req.body;

        const booking = await Booking.create({
            // customer: req.user ? req.user._id : undefined, // TODO: Add auth
            guestPhone,
            pickupLocation,
            dropoffLocation,
            vehicleType,
            distanceKm,
            totalPrice,
            scheduledDate: date, // Assuming schema needs this or timestamp
            scheduledTime: time
        });

        res.status(201).json(booking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Admin
const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id
// @access  Admin
const updateBookingStatus = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (booking) {
            booking.status = req.body.status || booking.status;
            const updatedBooking = await booking.save();
            res.json(updatedBooking);
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createBooking,
    getBookings,
    updateBookingStatus
}
