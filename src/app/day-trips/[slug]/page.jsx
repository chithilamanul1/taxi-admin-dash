import TourDetailsClient from '@/components/TourDetailsClient';
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/db';
import Tour from '@/models/Tour';

async function getTour(slug) {
    try {
        await dbConnect();
        const tour = await Tour.findOne({ slug }).lean();
        if (tour) {
            return JSON.parse(JSON.stringify(tour));
        }
        return null;
    } catch (e) {
        console.error("Tour fetch error", e);
        return null;
    }
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const tour = await getTour(slug);

    if (!tour) return { title: 'Tour Not Found' };

    return {
        title: `${tour.title} - Sri Lanka Day Trip - Airport Taxis Pvt (Ltd)`,
        description: `${tour.description?.slice(0, 160) || ''}... Explore ${tour.destinations?.join(', ')} with our premium day trip service. Instant confirmation and expert guides.`,
        keywords: `${tour.title}, ${tour.category} Sri Lanka, ${tour.destinations?.join(', ')} Trip, Professional Day Tour Sri Lanka`,
        openGraph: {
            title: tour.title,
            description: tour.description || '',
            url: `https://airporttaxis.lk/day-trips/${slug}`,
            images: [{ url: tour.heroImage || tour.images?.[0], width: 1200, height: 630, alt: tour.title }]
        }
    };
}

export default async function DayTripPage({ params }) {
    const { slug } = await params;
    const tour = await getTour(slug);

    if (!tour) {
        notFound();
    }

    return <TourDetailsClient tour={tour} />;
}
