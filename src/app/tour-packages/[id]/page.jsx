import TourPackageDetailsClient from '../../../components/TourPackageDetailsClient'
import { notFound } from 'next/navigation'
import dbConnect from '@/lib/db';
import Tour from '@/models/Tour';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
    const { id: slug } = await params
    const tour = await getTour(slug);

    if (!tour) return { title: 'Tour Not Found' }

    return {
        title: `${tour.title} - Sri Lanka Tour Package - Airport Taxis (Pvt) Ltd`,
        description: `${tour.description?.slice(0, 160) || ''}... Book this multi-day tour package across ${tour.destinations?.join(', ')}. Professional guides and premium transport included.`,
        keywords: `${tour.title}, Sri Lanka Tour ${tour.slug}, ${tour.destinations?.join(', ')} Tour, Sri Lanka Multi-day Trip, Private Tour Sri Lanka`,
        openGraph: {
            title: tour.title,
            description: tour.description || '',
            url: `https://airporttaxis.lk/tour-packages/${slug}`,
            images: [{ url: tour.heroImage || tour.images?.[0], width: 1200, height: 630, alt: tour.title }]
        }
    }
}

export default async function TourPackagePage({ params }) {
    const { id: slug } = await params
    const tour = await getTour(slug);

    if (!tour) notFound()

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": tour.title,
        "description": tour.description,
        "image": tour.heroImage || tour.images?.[0],
        "offers": {
            "@type": "Offer",
            "price": tour.price,
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "url": `https://airporttaxis.lk/tour-packages/${slug}`
        },
        "brand": {
            "@type": "Brand",
            "name": "Airport Taxis Sri Lanka"
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <TourPackageDetailsClient tour={tour} />
        </>
    );
}
