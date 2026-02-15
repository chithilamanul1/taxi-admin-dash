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

// Initialize Firebase Admin
const admin = require('firebase-admin');
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        })
    });
}

// Start Discord Support Bot
const supportBot = require('./services/discordBot');
supportBot.start().catch(err => console.error('Discord Bot Error:', err));

// Start WhatsApp Bot
const whatsappBot = require('./services/whatsappBot');
whatsappBot.start().catch(err => console.error('WhatsApp Bot Error:', err));

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
