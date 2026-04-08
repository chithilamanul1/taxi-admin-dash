import DestinationClient from '@/components/DestinationClient'
import { destinations } from '@/lib/destinations';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const destination = destinations.find(d =>
        d.id.toLowerCase() === slug?.toLowerCase() ||
        d.name.toLowerCase() === slug?.toLowerCase()
    );

    if (!destination) return { title: 'Destination Not Found' };

    const baseUrl = 'https://srilankantaxi.lk';
    const city = destination.name;

    return {
        title: `Colombo Airport to ${city} Taxi - Fixed Price $${destination.price} - 24/7 Service`,
        description: `Looking for a taxi from Colombo Airport (CMB) to ${city}? Book a reliable private transfer with Airport Taxis Pvt (Ltd). Fixed rates from $${destination.price}. Professional drivers and 24/7 support. ${destination.description.slice(0, 100)}...`,
        keywords: `Taxi from Colombo Airport to ${city}, CMB to ${city} Taxi, Colombo Airport Transfer to ${city}, ${city} Sri Lanka Taxi Service, ${city} Airport Pickup`,
        alternates: {
            canonical: `${baseUrl}/destination/${slug}`,
        },
        openGraph: {
            title: `🚖 Reliable Airport Transfer: CMB to ${city}`,
            description: `Safe and comfortable airport taxi service to ${city}. Fixed price of $${destination.price}. Book now for instant confirmation!`,
            url: `${baseUrl}/destination/${slug}`,
            images: [
                {
                    url: destination.img || '/hero-bg.jpg',
                    width: 1200,
                    height: 630,
                    alt: `Private Taxi from Colombo Airport to ${city}`,
                }
            ],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: `Airport Taxi to ${city}`,
            description: `Fixed rate airport transfers to ${city}. Reliable, professional, and 24/7.`,
            images: [destination.img || '/hero-bg.jpg'],
        }
    };
}

export default async function DestinationPage({ params }) {
    const { slug } = await params;

    const destination = destinations.find(d =>
        d.id.toLowerCase() === slug?.toLowerCase() ||
        d.name.toLowerCase() === slug?.toLowerCase()
    );

    if (!destination) {
        notFound();
    }

    // JSON-LD Structured Data
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": `Airport Transfer to ${destination.name}`,
        "description": destination.longDescription || destination.description,
        "image": `https://srilankantaxi.lk${destination.img}`,
        "offers": {
            "@type": "Offer",
            "price": destination.price,
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "url": `https://srilankantaxi.lk/destination/${slug}`
        },
        "brand": {
            "@type": "Brand",
            "name": "Airport Taxis Sri Lanka"
        }
    };

    // FAQ Schema if available
    const faqJsonLd = destination.faqs ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": destination.faqs.map(faq => ({
            "@type": "Question",
            "name": faq.q,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.a
            }
        }))
    } : null;

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {faqJsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
                />
            )}
            <DestinationClient destination={destination} />
        </>
    );
}
