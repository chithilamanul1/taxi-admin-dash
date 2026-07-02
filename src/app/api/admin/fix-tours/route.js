import dbConnect from '@/lib/db';
import Tour from '@/models/Tour';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await dbConnect();
        
        const tours = await Tour.find({});
        let updatedCount = 0;
        
        for (const tour of tours) {
            let needsUpdate = false;
            
            // Fix heroImage
            if (tour.heroImage && !tour.heroImage.startsWith('http') && !tour.heroImage.startsWith('/')) {
                tour.heroImage = '/' + tour.heroImage;
                needsUpdate = true;
            }
            
            // Fix image
            if (tour.image && !tour.image.startsWith('http') && !tour.image.startsWith('/')) {
                tour.image = '/' + tour.image;
                needsUpdate = true;
            }
            
            // Fix images array
            if (tour.images && Array.isArray(tour.images)) {
                const newImages = tour.images.map(img => {
                    if (img && !img.startsWith('http') && !img.startsWith('/')) {
                        needsUpdate = true;
                        return '/' + img;
                    }
                    return img;
                });
                
                if (needsUpdate) {
                    tour.images = newImages;
                }
            }
            
            if (needsUpdate) {
                await tour.save();
                updatedCount++;
            }
        }
        
        return NextResponse.json({ success: true, message: `Updated ${updatedCount} tours with relative image paths.` });
    } catch (error) {
        console.error('Error fixing tours:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
