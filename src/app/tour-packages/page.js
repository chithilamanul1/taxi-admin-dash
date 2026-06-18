import TourPackagesClient from '@/components/TourPackagesClient'

export const metadata = {
    title: 'Sri Lanka Round Tour Packages | Island-Wide Private Drivers & Custom Itineraries',
    description: 'Discover Sri Lanka with our custom round tour packages. Explore ancient Sigiriya, scenic Ella tea estates, wild Yala safaris & pristine beaches. Book today!',
    keywords: 'round tour packages, multi day tour packages, all inclusive round tours, full country tour packages, guided round trips, multi day itinerary planner, complete sightseeing packages, cross country tour package, customized round tours, complete travel itinerary tours with hotel stay included, round trip transportation packages, expert local tour guides, entrance fees included packages, private driver tour itinerary, curated holiday packages, milestone travel packages end to end travel services, meals and stays tour package, multi city vacation logistics',
    alternates: {
        canonical: 'https://srilankantaxi.lk/tour-packages',
    },
    openGraph: {
        title: 'Sri Lanka Round Tour Packages | Island-Wide Private Drivers & Custom Itineraries',
        description: 'Discover Sri Lanka with our custom round tour packages. Explore ancient Sigiriya, scenic Ella tea estates, wild Yala safaris & pristine beaches. Book today!',
        url: 'https://srilankantaxi.lk/tour-packages',
        siteName: 'Airport Taxis Pvt (Ltd)',
        images: [
            {
                url: '/sigiriya-new-hero.png',
                width: 1200,
                height: 630,
                alt: 'Sri Lanka Multi-Day Tour Package',
            }
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Sri Lanka Round Tour Packages | Island-Wide Private Drivers & Custom Itineraries',
        description: 'Discover Sri Lanka with our custom round tour packages. Explore ancient Sigiriya, scenic Ella tea estates, wild Yala safaris & pristine beaches. Book today!',
        images: ['/sigiriya-new-hero.png'],
    }
}

export default function TourPackagesPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "ItemList",
                        "name": "Sri Lanka Multi-Day Tour Packages",
                        "description": "Premium multi-day tour itineraries for exploring Sri Lanka.",
                        "itemListElement": [
                            {
                                "@type": "ListItem",
                                "position": 1,
                                "name": "7 Days Classic Sri Lanka Tour"
                            },
                            {
                                "@type": "ListItem",
                                "position": 2,
                                "name": "10 Days Adventure & Wildlife Package"
                            },
                            {
                                "@type": "ListItem",
                                "position": 3,
                                "name": "14 Days Grand All-Island Tour"
                            }
                        ]
                    })
                }}
            />
            <TourPackagesClient />
        </>
    )
}
