import TourDetailsClient from '@/components/TourDetailsClient';
import { notFound } from 'next/navigation';

async function getTour(slug) {
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const host = process.env.VERCEL_URL || 'localhost:3000';

    try {
        const res = await fetch(`${protocol}://${host}/api/tours?slug=${slug}`, { next: { revalidate: 3600 } });
        const data = await res.json();
        return data.success ? data.data : null;
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
        description: `${tour.description.slice(0, 160)}... Explore ${tour.destinations?.join(', ')} with our premium day trip service. Instant confirmation and expert guides.`,
        keywords: `${tour.title}, ${tour.category} Sri Lanka, ${tour.destinations?.join(', ')} Trip, Professional Day Tour Sri Lanka`,
        openGraph: {
            title: tour.title,
            description: tour.description,
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
