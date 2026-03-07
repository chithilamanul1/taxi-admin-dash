const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

// Re-define schema for script use
const tourSchema = new mongoose.Schema({
    title: String,
    destinations: [String],
    itinerary: [{
        title: String,
        location: String,
        lat: Number,
        lng: Number
    }],
    experience: [{
        heading: String,
        lat: Number,
        lng: Number
    }]
});

const Tour = mongoose.models.Tour || mongoose.model('Tour', tourSchema);

async function geocode(address) {
    if (!address) return null;
    try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address + ', Sri Lanka')}&key=${GOOGLE_MAPS_API_KEY}`);
        const data = await response.json();
        if (data.status === 'OK' && data.results.length > 0) {
            return data.results[0].geometry.location;
        }
        console.warn(`Geocoding failed for ${address}: ${data.status}`);
        return null;
    } catch (error) {
        console.error(`Geocoding error for ${address}:`, error);
        return null;
    }
}

async function run() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const tours = await Tour.find({});
        console.log(`Found ${tours.length} tours to geocode.`);

        for (const tour of tours) {
            console.log(`Processing: ${tour.title}`);
            let updated = false;

            // Optional: Geocode Destinations if you want to use them for waypoints
            // For now, let's focus on Experience headings since that's what's visible in the UI
            if (tour.experience && tour.experience.length > 0) {
                for (let exp of tour.experience) {
                    if (!exp.lat || !exp.lng) {
                        const coords = await geocode(exp.heading);
                        if (coords) {
                            exp.lat = coords.lat;
                            exp.lng = coords.lng;
                            updated = true;
                        }
                    }
                }
            }

            // Geocode Itinerary locations
            if (tour.itinerary && tour.itinerary.length > 0) {
                for (let item of tour.itinerary) {
                    if (!item.lat || !item.lng) {
                        const searchStr = item.location || item.title;
                        const coords = await geocode(searchStr);
                        if (coords) {
                            item.lat = coords.lat;
                            item.lng = coords.lng;
                            updated = true;
                        }
                    }
                }
            }

            if (updated) {
                await tour.save();
                console.log(`Updated coordinates for ${tour.title}`);
            }
        }

        console.log('Geocoding complete!');
    } catch (err) {
        console.error('Run error:', err);
    } finally {
        await mongoose.connection.close();
    }
}

run();
