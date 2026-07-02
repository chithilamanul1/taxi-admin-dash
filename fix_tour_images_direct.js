import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGODB_URI;

const tourSchema = new mongoose.Schema({}, { strict: false });
const Tour = mongoose.model('Tour', tourSchema);

async function fixTours() {
    try {
        await mongoose.connect(uri);
        console.log('Connected to DB');
        
        const tours = await Tour.find({});
        let updatedCount = 0;
        
        for (const tour of tours) {
            let needsUpdate = false;
            let updates = {};
            
            if (tour.get('heroImage') && !tour.get('heroImage').startsWith('http') && !tour.get('heroImage').startsWith('/')) {
                updates.heroImage = '/' + tour.get('heroImage');
                needsUpdate = true;
            }
            
            if (tour.get('image') && !tour.get('image').startsWith('http') && !tour.get('image').startsWith('/')) {
                updates.image = '/' + tour.get('image');
                needsUpdate = true;
            }
            
            const images = tour.get('images');
            if (images && Array.isArray(images)) {
                let imagesChanged = false;
                const newImages = images.map(img => {
                    if (img && typeof img === 'string' && !img.startsWith('http') && !img.startsWith('/')) {
                        imagesChanged = true;
                        return '/' + img;
                    }
                    return img;
                });
                
                if (imagesChanged) {
                    updates.images = newImages;
                    needsUpdate = true;
                }
            }
            
            if (needsUpdate) {
                await Tour.updateOne({ _id: tour._id }, { $set: updates });
                updatedCount++;
                console.log(`Updated tour: ${tour.get('title') || tour._id}`);
            }
        }
        
        console.log(`Update complete. Fixed ${updatedCount} tours.`);
    } catch (error) {
        console.error('Error fixing tours:', error);
    } finally {
        await mongoose.disconnect();
    }
}

fixTours();
