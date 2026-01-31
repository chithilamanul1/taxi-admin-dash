const fs = require('fs');
const mongoose = require('mongoose');

// Manual Env Load
try {
    const envPath = '.env';
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf8');
        envConfig.split(/\r?\n/).forEach(line => {
            const parts = line.split('=');
            if (parts.length >= 2) {
                const key = parts[0].trim();
                const val = parts.slice(1).join('=').trim().replace(/^["'](.*)["']$/, '$1');
                if (key && val && !key.startsWith('#')) {
                    process.env[key] = val;
                }
            }
        });
    }
} catch (e) {
    console.error('Env load error:', e);
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.error('MONGODB_URI not found');
    process.exit(1);
}

const tourSchema = new mongoose.Schema({
    title: String,
    image: String,
    images: [String],
    category: String
}, { strict: false });

const Tour = mongoose.models.Tour || mongoose.model('Tour', tourSchema);

const IMAGE_MAP = {
    'Galle': 'https://images.unsplash.com/photo-1578586883464-500b5220fa26?q=80&w=800&auto=format&fit=crop', // Galle Fort
    'Bentota': 'https://images.unsplash.com/photo-1588258387067-160fa1f9748b?q=80&w=800&auto=format&fit=crop', // Beach
    'Colombo': 'https://images.unsplash.com/photo-1580894080106-963d76b4a20e?q=80&w=800&auto=format&fit=crop', // Lotus Tower
    'Kandy': 'https://images.unsplash.com/photo-1590766940554-634a7ed01ce8?q=80&w=800&auto=format&fit=crop', // Temple
    'Sigiriya': 'https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?q=80&w=800&auto=format&fit=crop', // Sigiriya Rock
    'Ella': 'https://images.unsplash.com/photo-1588661962642-12af03b8cc42?q=80&w=800&auto=format&fit=crop', // Nine Arch
    'Safari': 'https://images.unsplash.com/photo-1534177616072-ef7dc12044f9?q=80&w=800&auto=format&fit=crop', // Elephant
    'Yala': 'https://images.unsplash.com/photo-1547970810-dc1eac37d174?q=80&w=800&auto=format&fit=crop', // Leopard
    'Whale': 'https://images.unsplash.com/photo-1568430462989-44163eb1752f?q=80&w=800&auto=format&fit=crop', // Whale
    'Airport': 'https://images.unsplash.com/photo-1556388169-d10206122e2a?q=80&w=800&auto=format&fit=crop', // Road
};

async function updateImages() {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(MONGODB_URI);

        const tours = await Tour.find({});
        console.log(`Found ${tours.length} tours.`);

        for (const tour of tours) {
            let selectedImage = null;
            const titleLower = tour.title.toLowerCase();

            // Match keyword
            for (const [key, url] of Object.entries(IMAGE_MAP)) {
                if (titleLower.includes(key.toLowerCase()) || (tour.category && tour.category.includes(key))) {
                    selectedImage = url;
                    break;
                }
            }

            // Fallback by Category
            if (!selectedImage) {
                if (tour.category === 'Safari') selectedImage = IMAGE_MAP['Safari'];
                else if (tour.category === 'City Tours') selectedImage = IMAGE_MAP['Colombo'];
                else if (tour.category === 'Multi-Day') selectedImage = IMAGE_MAP['Sigiriya'];
                else selectedImage = IMAGE_MAP['Bentota']; // General Beach/Nature
            }

            // Update
            tour.image = selectedImage;

            // Allow gallery to start with this image too if empty
            if (!tour.images || tour.images.length === 0) {
                tour.images = [selectedImage];
            }

            await tour.save();
            console.log(`Updated: ${tour.title} -> ${selectedImage.substring(0, 30)}...`);
        }

        console.log('All images updated.');
        process.exit(0);

    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

updateImages();
