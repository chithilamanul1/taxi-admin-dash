import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load env
const envLocalPath = path.join(process.cwd(), '.env.local');
const envPath = path.join(process.cwd(), '.env');

if (fs.existsSync(envLocalPath)) {
    dotenv.config({ path: envLocalPath });
} else if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.error('Missing MONGODB_URI');
    process.exit(1);
}

const tourSchema = new mongoose.Schema({
    title: String,
    slug: { type: String, unique: true },
    category: String,
    images: [String],
    heroImage: String,
}, { strict: false });

const Tour = mongoose.models.Tour || mongoose.model('Tour', tourSchema);

const imageMap = {
    // Kandy
    'Kandy Cultural Day Tour': 'https://images.unsplash.com/photo-1588258219511-64eb629cb833?q=80&w=1600&auto=format&fit=crop',
    'Kandy & Pinnawala Cultural Day Tour': 'https://images.unsplash.com/photo-1625736300986-a5b6ce19226d?q=80&w=1600&auto=format&fit=crop',
    'Kandy: The Last Kingdom Tour': 'https://images.unsplash.com/photo-1588258219511-64eb629cb833?q=80&w=1600&auto=format&fit=crop',
    'Kandy Cultural Immersion': 'https://images.unsplash.com/photo-1625736300986-a5b6ce19226d?q=80&w=1600&auto=format&fit=crop',
    'Ambuluwawa Tower & Kandy Heritage Tour': 'https://images.unsplash.com/photo-1628155985834-01334845a720?q=80&w=1600&auto=format&fit=crop',

    // Sigiriya & Dambulla
    'Sigiriya Rock Fortress & Dambulla': 'https://images.unsplash.com/photo-1588614959060-4d144f28b2ea?q=80&w=1600&auto=format&fit=crop',
    'Sigiriya Rock & Dambulla Cave Temple Day Trip': 'https://images.unsplash.com/photo-1580881761697-359f47bc57c0?q=80&w=1600&auto=format&fit=crop',
    'Private Sigiriya & Dambulla Heritage Tour': 'https://images.unsplash.com/photo-1588614959060-4d144f28b2ea?q=80&w=1600&auto=format&fit=crop',
    'Sigiriya Rock & Minneriya Safari from Negombo': 'https://images.unsplash.com/photo-1580881761697-359f47bc57c0?q=80&w=1600&auto=format&fit=crop',
    'Sigiriya and Dambulla Highlights': 'https://images.unsplash.com/photo-1588614959060-4d144f28b2ea?q=80&w=1600&auto=format&fit=crop',

    // Safaris
    'Yala National Park Safari': 'https://images.unsplash.com/photo-1549488398-aa66870ac45b?q=80&w=1600&auto=format&fit=crop',
    'Yala National Park Leopard Safari': 'https://images.unsplash.com/photo-1549488398-aa66870ac45b?q=80&w=1600&auto=format&fit=crop',
    'Udawalawe National Park Wildlife Safari': 'https://images.unsplash.com/photo-1616128417859-3a984dd35f02?q=80&w=1600&auto=format&fit=crop',
    'Minneriya / Kaudulla Wildlife Safari': 'https://images.unsplash.com/photo-1586861635167-e52a3a1e262c?q=80&w=1600&auto=format&fit=crop',

    // Ella
    'Ella Scenic Train Journey': 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?q=80&w=1600&auto=format&fit=crop',
    'Ella Explorer: Nine Arch Bridge & Little Adams Peak': 'https://images.unsplash.com/photo-1590603740183-980e7f6920eb?q=80&w=1600&auto=format&fit=crop',

    // Coastal / Galle / Mirissa
    'Galle Fort & Coastal Explorer': 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1600&auto=format&fit=crop',
    'Galle and Bentota Day-Tour From Colombo': 'https://images.unsplash.com/photo-1550977186-b4fb553a06ad?q=80&w=1600&auto=format&fit=crop',
    'Southern Coast Discovery: Galle & Bentota': 'https://images.unsplash.com/photo-1544644181-1484b3fdfc63?q=80&w=1600&auto=format&fit=crop',
    'Southern Coast Explorer From Negombo': 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1600&auto=format&fit=crop',
    'Ultimate South Coast: Galle, Hikkaduwa & Mirissa': 'https://images.unsplash.com/photo-1544644181-1484b3fdfc63?q=80&w=1600&auto=format&fit=crop',
    'Galle Fort & Southern Coast (Whale Watching)': 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1600&auto=format&fit=crop',
    'Whale Watching in Mirissa': 'https://images.unsplash.com/photo-1568430462989-44163eb1752f?q=80&w=1600&auto=format&fit=crop',
    'Mirissa Whale Watching Expedition': 'https://images.unsplash.com/photo-1568430462989-44163eb1752f?q=80&w=1600&auto=format&fit=crop',
    'Hikkaduwa Marine Park & Corals': 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?q=80&w=1600&auto=format&fit=crop',

    // Colombo
    'Colombo City Highlights & Heritage Tour': 'https://images.unsplash.com/photo-1584968143431-155e966f9175?q=80&w=1600&auto=format&fit=crop',
    'Colombo Exclusive Shopping & City Experience': 'https://images.unsplash.com/photo-1584968143431-155e966f9175?q=80&w=1600&auto=format&fit=crop',

    // Architecture / History
    'Anuradhapura: The First Capital Heritage Tour': 'https://images.unsplash.com/photo-1582239454124-7186104bc7a0?q=80&w=1600&auto=format&fit=crop',
    'Polonnaruwa Ancient City Cycle Tour': 'https://images.unsplash.com/photo-1606130438186-e48356d78873?q=80&w=1600&auto=format&fit=crop',

    // Adventure / Nature
    'Kitulgala White Water Rafting & Adventure': 'https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?q=80&w=1600&auto=format&fit=crop',
    'Sinharaja Rainforest Guided Trek': 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=1600&auto=format&fit=crop',
    'Ratnapura: City of Gems Experience': 'https://images.unsplash.com/photo-1647891938250-954adede9c51?q=80&w=1600&auto=format&fit=crop',

    // Highlands
    'Nuwara Eliya & Tea Gardens Full-Day Tour': 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?q=80&w=1600&auto=format&fit=crop',

    // Misc
    'Pinnawala Elephant Experience': 'https://images.unsplash.com/photo-1516715667032-70482c450d2e?q=80&w=1600&auto=format&fit=crop',
    'Negombo Heritage & Lagoon Tour': 'https://images.unsplash.com/photo-1580554522437-12499645f78a?q=80&w=1600&auto=format&fit=crop',
    '7 Days Classic Sri Lanka': 'https://images.unsplash.com/photo-1550977186-b4fb553a06ad?q=80&w=1600&auto=format&fit=crop'
};

const runUpdate = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const tours = await Tour.find({});
        console.log(`Checking ${tours.length} tours for image updates...`);

        let updateCount = 0;

        for (const tour of tours) {
            const mappedImageUrl = imageMap[tour.title];
            if (mappedImageUrl) {
                tour.heroImage = mappedImageUrl;
                tour.images = [mappedImageUrl]; // Assuming one main image for now as requested
                await tour.save();
                console.log(`Updated images for: ${tour.title}`);
                updateCount++;
            } else {
                // Keyword fallback for partial matches if needed
                if (tour.title.toLowerCase().includes('kandy')) {
                    tour.heroImage = 'https://images.unsplash.com/photo-1588258219511-64eb629cb833?q=80&w=1600&auto=format&fit=crop';
                } else if (tour.title.toLowerCase().includes('sigiriya')) {
                    tour.heroImage = 'https://images.unsplash.com/photo-1588614959060-4d144f28b2ea?q=80&w=1600&auto=format&fit=crop';
                } else if (tour.title.toLowerCase().includes('galle')) {
                    tour.heroImage = 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1600&auto=format&fit=crop';
                } else if (tour.title.toLowerCase().includes('safari')) {
                    tour.heroImage = 'https://images.unsplash.com/photo-1549488398-aa66870ac45b?q=80&w=1600&auto=format&fit=crop';
                } else if (!tour.heroImage || tour.heroImage.includes('onboarding@resend.dev')) { // fallback generic
                    tour.heroImage = 'https://images.unsplash.com/photo-1550977186-b4fb553a06ad?q=80&w=1600&auto=format&fit=crop';
                }

                if (tour.isModified('heroImage')) {
                    tour.images = [tour.heroImage];
                    await tour.save();
                    console.log(`Applied keyword fallback update for: ${tour.title}`);
                    updateCount++;
                }
            }
        }

        console.log(`Successfully updated ${updateCount} tours.`);
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
};

runUpdate();
