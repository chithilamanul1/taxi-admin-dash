import DayTripsClient from '@/components/DayTripsClient'

export const metadata = {
    title: '🏝️ Sri Lanka Day Trips & Private Tours - Explore Galle, Kandy, Sigiriya',
    description: 'Discover the best of Sri Lanka in a single day. Private day trips to Galle Fort, Sigiriya Rock, Kandy Temple, and Bentota Beach. Professional drivers, flexible itineraries, and comfortable transport included.',
    keywords: 'Sri Lanka Day Trips, Galle Day Tour, Sigiriya Day Trip, Kandy Private Tour, Bentota Day Trip, Colombo Day Tours, One Day Trips Sri Lanka, Mirissa Whale Watching, Udawalawe Safari, Private Chauffeur Day Trip',
    alternates: {
        canonical: 'https://srilankantaxi.lk/day-trips',
    },
    openGraph: {
        title: 'Explore Sri Lanka with Private Day Trips & Tours',
        description: 'Expertly curated single-day experiences across Sri Lanka. Visit iconic UNESCO sites with professional transport and English-speaking drivers.',
        url: 'https://srilankantaxi.lk/day-trips',
        siteName: 'Airport Taxis Pvt (Ltd)',
        images: [
            {
                url: '/sigiriya-new-hero.png',
                width: 1200,
                height: 630,
                alt: 'Sigiriya Rock Fortress Day Trip Sri Lanka',
            }
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Explore Sri Lanka: 7 Must-See Day Trips',
        description: 'Daily private tours to Galle, Kandy, and Sigiriya starting from Colombo Airport or Negombo.',
        images: ['/sigiriya-new-hero.png'],
    }
}

export default function DayTripsPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "ItemList",
                        "name": "Sri Lanka Day Trips",
                        "description": "Recommended one-day trip packages in Sri Lanka.",
                        "itemListElement": [
                            {
                                "@type": "ListItem",
                                "position": 1,
                                "name": "Galle Fort Day Tour"
                            },
                            {
                                "@type": "ListItem",
                                "position": 2,
                                "name": "Sigiriya Rock Fortress Day Trip"
                            },
                            {
                                "@type": "ListItem",
                                "position": 3,
                                "name": "Kandy Sacred Temple Tour"
                            }
                        ]
                    })
                }}
            />
            <DayTripsClient />
        </>
    )
}
