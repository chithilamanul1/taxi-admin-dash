require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

const tourSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    category: {
        type: String,
        enum: ['tour-package', 'day-trip', 'safari', 'city-tour'],
        required: true,
        default: 'tour-package'
    },
    duration: {
        days: { type: Number, required: true, default: 1 },
        nights: { type: Number, required: true, default: 0 }
    },
    description: { type: String, required: true },
    shortDescription: { type: String },
    images: { type: [String], default: [] },
    heroImage: { type: String },
    price: {
        amount: { type: Number, required: true, default: 0 },
        currency: { type: String, default: 'LKR' },
        type: { type: String, enum: ['fixed', 'from', 'per-person'], default: 'from' }
    },
    destinations: { type: [String], default: [] },
    inclusions: { type: [String], default: [] },
    exclusions: { type: [String], default: [] },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Tour = mongoose.models.Tour || mongoose.model('Tour', tourSchema);

async function run() {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to DB');
    
    try {
        const udawalawe = new Tour({
            title: 'Udawalawe National Park Safari',
            slug: 'udawalawe-safari',
            category: 'safari',
            duration: { days: 1, nights: 0 },
            description: 'Experience the wild beauty of Sri Lanka with a thrilling safari at Udawalawe National Park. See majestic herds of elephants, exotic birds, and breathtaking landscapes on this unforgettable adventure. Perfect for nature lovers and photographers.',
            shortDescription: 'Witness the majestic elephants of Udawalawe National Park on an unforgettable guided safari.',
            heroImage: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc63?q=80&w=1240&auto=format&fit=crop',
            price: { amount: 150, currency: 'USD', type: 'per-person' },
            destinations: ['Udawalawe'],
            inclusions: ['4x4 Safari Jeep', 'Park Entrance Fees', 'Professional Guide', 'Hotel Pickup & Drop-off'],
            exclusions: ['Meals & Drinks', 'Gratuities'],
            isFeatured: true,
            isActive: true
        });
        
        await udawalawe.save();
        console.log('Udawalawe Safari added successfully!');
    } catch (e) {
        if (e.code === 11000) {
            console.log('Safari already exists.');
        } else {
            console.error('Error inserting:', e);
        }
    }
    
    mongoose.disconnect();
}

run();
