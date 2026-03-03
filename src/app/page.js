import HomeClient from '../components/HomeClient'

export const metadata = {
    title: '🚖 Airport Taxis Sri Lanka - #1 Trusted Airport Transfers & Multi-Day Tours',
    description: 'Instant Booking! Reliable 24/7 airport transfers from Colombo Airport (CMB) to any destination in Sri Lanka. Fixed rates for Kandy, Galle, Sigiriya and more. Professional English-speaking drivers and premium vehicles.',
    keywords: 'Airport Taxi Sri Lanka, Colombo Airport Transfer, CMB Taxi Service, Bandaranaike Airport Taxi, Airport Pickup Sri Lanka, Sri Lanka Private Tours, KDH Van Rental Sri Lanka, Reliable Taxi Colombo, 24/7 Airport Taxi Sri Lanka, Sri Lanka Travel Transport',
    alternates: {
        canonical: 'https://airporttaxis.lk',
    },
    openGraph: {
        title: '🚖 Airport Taxis Sri Lanka - Trusted Airport Transfers & Multi-Day Tours',
        description: 'Reliable 24/7 airport transfers from Colombo Airport (CMB). Professional drivers, comfortable vehicles, instant confirmation. Best rates guaranteed.',
        url: 'https://airporttaxis.lk',
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
                        "publisher": {
                            "@type": "Organization",
                            "name": "Airport Taxis Pvt (Ltd)",
                            "logo": "https://airporttaxis.lk/logo.png"
                        }
                    })
                }}
            />
            <HomeClient />
        </>
    )
}
