const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

// Load env vars from server directory
dotenv.config({ path: path.join(__dirname, '.env') });

// Connect to DB
const connectDB = require('./config/db');
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
    res.send('Airport Taxi V2 API is running...');
});

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/pricing', require('./routes/pricingRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
