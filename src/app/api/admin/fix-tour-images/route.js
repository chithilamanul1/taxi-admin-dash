import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import Tour from '../../../../models/Tour';

export const dynamic = 'force-dynamic';

export async function GET(req) {
    try {
        await dbConnect();

        const tours = await Tour.find({});
        let updatedCount = 0;

        for (const tour of tours) {
            const imageMap = {
                'Anuradhapura': '/images/tours/anuradhapura.jpg',
                'Kitulgala': '/images/tours/kitulgala.jpg',
                'Nuwara Eliya': '/images/tours/nuwara-eliya.jpg',
                'Sinharaja': '/images/tours/sinharaja.jpg',
                'Polonnaruwa': '/images/tours/polonnaruwa.jpg',
                'Ratnapura': '/images/tours/ratnapura.jpg',
                'Sigiriya': '/images/tours/sigiriya.jpg',
                'Kandy': '/images/tours/kandy.jpg',
                'Galle': '/images/tours/galle.jpg',
                'Yala': '/images/tours/yala.jpg',
                'Udawalawe': '/images/tours/udawalawe.jpg',
                'Mirissa': '/images/tours/mirissa.jpg',
                'Tangalle': '/images/tours/tangalle.jpg',
                'Kataragama': '/images/tours/kataragama.jpg',
                'Jaffna': '/images/tours/jaffna.jpg',
                'Minneriya': '/images/tours/minneriya.jpg',
                'Wilpattu': '/images/tours/wilpattu.jpg',
                'Bundala': '/images/tours/bundala.jpg',
                'Kumana': '/images/tours/kumana.jpg',
                'Wasgamuwa': '/images/tours/wasgamuwa.jpg',
                'Gal Oya': '/images/tours/gal-oya.jpg',
                'Maduru Oya': '/images/tours/maduru-oya.jpg',
                'Somawathiya': '/images/tours/somawathiya.jpg',
                'Lahugala': '/images/tours/lahugala.jpg',
                'Lunugamvehera': '/images/tours/lunugamvehera.jpg',
                'Madu Ganga': '/images/tours/madu-ganga.jpg',
                'Muthurajawela': '/images/tours/muthurajawela.jpg',
                'Knuckles': '/images/tours/knuckles.jpg',
                'Pidurutalagala': '/images/tours/pidurutalagala.jpg',
                'Hakgala': '/images/tours/hakgala.jpg',
                'Peradeniya': '/images/tours/peradeniya.jpg',
                'Henarathgoda': '/images/tours/henarathgoda.jpg',
                'Seethawaka': '/images/tours/seethawaka.jpg',
                'Mirijjawila': '/images/tours/mirijjawila.jpg',
                'Dry Zone': '/images/tours/dry-zone.jpg',
                'Wet Zone': '/images/tours/wet-zone.jpg',
                'Intermediate Zone': '/images/tours/intermediate-zone.jpg',
            };

            let matchedImage = '/images/tours/placeholder.jpg';
            for (const [key, value] of Object.entries(imageMap)) {
                if (tour.title.toLowerCase().includes(key.toLowerCase())) {
                    matchedImage = value;
                    break;
                }
            }

            tour.image = matchedImage;
            tour.heroImage = matchedImage;
            tour.images = [matchedImage];
            await tour.save();
            updatedCount++;
        }

        return NextResponse.json({ success: true, message: `Updated ${updatedCount} tours with local images.` });
    } catch (error) {
        console.error('Error fixing tour images:', error);
        return NextResponse.json({ success: false, error: 'Failed to fix tour images' }, { status: 500 });
    }
}
