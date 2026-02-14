import TourPackagesClient from '@/components/TourPackagesClient'

export const metadata = {
    title: 'Sri Lanka Tour Packages - Authentic Multi-Day Sightseeing Tours',
    description: 'Explore Sri Lanka with our expertly designed multi-day tour packages. Quality accommodation, private AC transport, and professional guides included. Customizable itineraries for families and adventurers.',
    keywords: 'Sri Lanka Tour Packages, Multi-day Sri Lanka Tours, Sri Lanka Sightseeing Packages, Customized Sri Lanka Trips, Best Sri Lanka Tour Operator, Sri Lanka Honeymoon Packages, Wildlife Tours Sri Lanka',
    alternates: {
        canonical: '/tour-packages',
    },
    openGraph: {
        title: 'Authentic Sri Lanka Tour Packages & Adventures',
        description: 'Complete tour packages with transport and hotels. Experience the best of Sri Lanka with our trusted team.',
        url: 'https://airporttaxis.lk/tour-packages',
        images: [
            {
                url: '/sigiriya.jpg',
                width: 1200,
                height: 630,
                alt: 'Sri Lanka Tour Packages',
            }
        ]
    }
}

export default function TourPackagesPage() {
    return <TourPackagesClient />
}
