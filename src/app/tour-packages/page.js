import TourPackagesClient from '@/components/TourPackagesClient'

export const metadata = {
    title: '🐘 Sri Lanka Tour Packages - Authentic Multi-Day Sightseeing Tours',
    description: 'Explore Sri Lanka with our expertly designed multi-day tour packages. Quality accommodation, private AC transport, and professional guides included. Customizable itineraries for families, couples, and adventurers.',
    keywords: 'Sri Lanka Tour Packages, Multi-day Sri Lanka Tours, Sri Lanka Sightseeing Packages, Customized Sri Lanka Trips, Best Sri Lanka Tour Operator, Sri Lanka Honeymoon Packages, Wildlife Tours Sri Lanka, Cultural Tours Sri Lanka, Adventure Tours Sri Lanka',
    alternates: {
        canonical: 'https://airporttaxis.lk/tour-packages',
    },
    openGraph: {
        title: 'Authentic Sri Lanka Tour Packages & Adventures',
        description: 'Complete tour packages with transport, hotels, and expert guides. Experience the best of Sri Lanka with our trusted local team.',
        url: 'https://airporttaxis.lk/tour-packages',
        siteName: 'Airport Taxis Pvt (Ltd)',
        images: [
            {
                url: '/sigiriya.jpg',
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
        title: 'Book Your Dream Sri Lanka Tour',
        description: 'Customizable 5-14 day tour packages exploring Kandy, Nuwara Eliya, Ella, and the South Coast.',
        images: ['/sigiriya.jpg'],
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
