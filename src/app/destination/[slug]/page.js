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

    return {
        title: `Airport Taxi to ${destination.name} - Trusted Transfer & Rates - Airport Taxis Sri Lanka`,
        description: `Book a reliable 24/7 airport transfer from Colombo Airport (CMB) to ${destination.name}. Fixed rates starting from $${destination.price}. Comfortable vehicles and professional drivers.`,
        keywords: `Airport Taxi to ${destination.name}, Colombo Airport Transfer ${destination.name}, CMB to ${destination.name} Taxi, ${destination.name} Sri Lanka Taxi Service, ${destination.name} Airport Pickup`,
        openGraph: {
            title: `🚖 Airport Transfer from CMB to ${destination.name} - Sri Lanka`,
            description: `Safe and reliable airport taxi service to ${destination.name}. Book now for instant confirmation and best rates.`,
            url: `https://airporttaxis.lk/destination/${slug}`,
            images: [
                {
                    url: destination.img || '/hero-bg.jpg',
                    width: 1200,
                    height: 630,
                    alt: `Airport Taxi to ${destination.name}`,
                }
            ]
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

    return <DestinationClient destination={destination} />;
}
