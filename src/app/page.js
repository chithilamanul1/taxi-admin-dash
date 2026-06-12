import HomeClient from '../components/HomeClient'

export const metadata = {
    title: '🚖 Airport Taxis Sri Lanka - #1 Trusted Airport Transfers & Multi-Day Tours',
    description: 'Book your Airport Taxi in Sri Lanka with instant confirmation. 24/7 Colombo Airport (CMB) transfers, private chauffeurs, and luxury KDH vans. Fixed rates, no hidden fees. Trusted by 10,000+ happy travelers for airport pickups and all-island tours.',
    keywords: [
        'Sri Lanka Airport Taxi', 'Airport Transfer Sri Lanka', 'Colombo Airport Taxi', 'Taxi Service Sri Lanka',
        'Airport Cab Booking', 'Airport Shuttle Sri Lanka', 'CMB Airport Taxi', 'Private Taxi Sri Lanka',
        'Airport Taxi Service near me', 'Airport Pickup Colombo', 'Taxi Booking Colombo Airport',
        'Sri Lanka Private Tours', 'KDH Van Rental Sri Lanka', 'Reliable Taxi Colombo', '24/7 Airport Taxi Sri Lanka', 'Sri Lanka Travel Transport'
    ],
    alternates: {
        canonical: 'https://srilankantaxi.lk',
    },
    openGraph: {
        title: '🚖 Airport Taxis Sri Lanka - Trusted Airport Transfers & Multi-Day Tours',
        description: 'Reliable 24/7 airport transfers from Colombo Airport (CMB). Professional drivers, comfortable vehicles, instant confirmation. Best rates guaranteed.',
        url: 'https://srilankantaxi.lk',
        siteName: 'Airport Taxis Pvt (Ltd)',
        images: [
            {
                url: '/hero-bg.jpg',
                width: 1200,
                height: 630,
                alt: 'Airport Taxis Sri Lanka Transfer Service',
            }
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: '🚖 Airport Taxis Sri Lanka - Premium Rides & Tours',
        description: 'Instant booking for 24/7 airport transfers and private tours across Sri Lanka.',
        images: ['/hero-bg.jpg'],
    }
}

export default function Home() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebPage",
                        "name": "Airport Taxis Sri Lanka - Home",
                        "description": "Book reliable 24/7 airport transfers and tours in Sri Lanka.",
                        "dateModified": new Date().toISOString().split('T')[0],
                        "publisher": {
                            "@type": "Organization",
                            "name": "Airport Taxis Pvt (Ltd)",
                            "logo": "https://srilankantaxi.lk/logo.png"
                        }
                    })
                }}
            />
            <HomeClient />
        </>
    )
}
