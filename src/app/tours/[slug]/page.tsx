import TourDetailsClient from '@/components/TourDetailsClient';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const host = process.env.VERCEL_URL || 'localhost:3000';

    try {
        const res = await fetch(`${protocol}://${host}/api/tours?slug=${slug}`);
        const data = await res.json();
        if (!data.success || !data.data) return { title: 'Tour Not Found' };

        const tour = data.data;
        return {
            title: `${tour.title} - Sri Lanka Tour Experience - Airport Taxis Pvt (Ltd)`,
            description: `${tour.description.slice(0, 160)}... Explore ${tour.destinations?.join(', ')} with our premium tour service. Instant confirmation and expert guides.`,
            keywords: `${tour.title}, ${tour.category} Sri Lanka, ${tour.destinations?.join(', ')} Trip, Professional Tour Sri Lanka`,
            openGraph: {
                title: tour.title,
                description: tour.description,
                url: `https://airporttaxis.lk/tours/${slug}`,
                images: [{ url: tour.heroImage || tour.images?.[0], width: 1200, height: 630, alt: tour.title }]
            }
        };
    } catch (e) {
        return { title: 'Tour Package Sri Lanka' };
    }
}

export default async function TourPage({ params }) {
    const { slug } = await params;

    // We need the full URL for the server-side fetch in metadata and page
    // In Next.js App Router, we usually fetch from a DB directly in server components
    // But since there's an API already, we use it.
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const host = process.env.VERCEL_URL || 'localhost:3000';

    let tour = null;
    try {
        const res = await fetch(`${protocol}://${host}/api/tours?slug=${slug}`);
        const data = await res.json();
        if (data.success) {
            tour = data.data;
        }
    } catch (e) {
        console.error("Fetch error", e);
    }

    if (!tour) {
        notFound();
    }

    return <TourDetailsClient tour={tour} />;
}
