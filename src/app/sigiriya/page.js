import { notFound } from 'next/navigation';
import { destinations } from '@/lib/destinations';
import DestinationClient from '@/components/DestinationClient';

export async function generateMetadata() {
    const dest = destinations.find(d => d.id === 'sigiriya');

    if (!dest) {
        return {
            title: 'Destination Not Found | Airport Taxis Sri Lanka',
        };
    }

    return {
        title: dest.seoTitle || `${dest.title} | Airport Taxis Sri Lanka`,
        description: dest.seoDescription || `Book a private airport taxi to ${dest.name} from Colombo Airport (CMB). Fixed rates from $${dest.price}. ${dest.description}`,
        keywords: dest.seoKeywords || [
            `taxi to ${dest.name}`,
            `airport transfer to ${dest.name}`,
            `${dest.name} taxi`,
            `${dest.name} airport transfer`,
            `CMB to ${dest.name} taxi`,
            `Colombo airport to ${dest.name}`,
            `private taxi ${dest.name} Sri Lanka`,
        ],
        alternates: {
            canonical: `https://airporttaxis.lk/sigiriya`,
        },
        openGraph: {
            title: dest.seoTitle || `${dest.title} | Airport Taxis Sri Lanka`,
            description: dest.seoDescription || `Fixed-rate airport taxi to ${dest.name}. Starting from $${dest.price}. Professional drivers, 24/7 service.`,
            url: `https://airporttaxis.lk/sigiriya`,
            siteName: 'Airport Taxis (Pvt) Ltd Sri Lanka',
            images: [
                {
                    url: dest.img || '/og-image.jpg',
                    width: 1200,
                    height: 630,
                    alt: `Airport Taxi to ${dest.name}, Sri Lanka`,
                },
            ],
            locale: 'en_US',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: dest.seoTitle || `Taxi to ${dest.name} | Airport Taxis Sri Lanka`,
            description: dest.seoDescription || `Fixed-rate private taxi from Colombo Airport to ${dest.name}. From $${dest.price}. Book instantly!`,
            images: [dest.img || '/og-image.jpg'],
        },
    };
}

export default async function SigiriyaPage() {
    const dest = destinations.find(d => d.id === 'sigiriya');

    if (!dest) {
        notFound();
    }

    // JSON-LD structured data for this destination
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'TaxiService',
        name: `Airport Taxi to ${dest.name}`,
        description: dest.description,
        url: `https://airporttaxis.lk/sigiriya`,
        provider: {
            '@type': 'LocalBusiness',
            name: 'Airport Taxis (Pvt) Ltd Sri Lanka',
            telephone: '+94716885880',
            url: 'https://airporttaxis.lk',
        },
        areaServed: {
            '@type': 'Place',
            name: dest.fullAddress || `${dest.name}, Sri Lanka`,
            geo: dest.coords ? {
                '@type': 'GeoCoordinates',
                latitude: dest.coords.lat,
                longitude: dest.coords.lon,
            } : undefined,
        },
        offers: {
            '@type': 'Offer',
            price: dest.price,
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            description: `Private airport taxi from Colombo Airport (CMB) to ${dest.name}`,
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <DestinationClient destination={dest} />
        </>
    );
}
