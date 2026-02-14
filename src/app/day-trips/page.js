import DayTripsClient from '@/components/DayTripsClient'

export const metadata = {
    title: 'Sri Lanka Day Trips & Private Tours - Explore Galle, Kandy, Sigiriya',
    description: 'Discover the best of Sri Lanka in a single day. Private day trips to Galle Fort, Sigiriya Rock, Kandy Temple, and Bentota Beach. Professional drivers and comfortable transport included.',
    keywords: 'Sri Lanka Day Trips, Galle Day Tour, Sigiriya Day Trip, Kandy Private Tour, Bentota Day Trip, Colombo Day Tours, Sri Lanka One Day Trips, Whale Watching Mirissa Day Trip, Udawalawe Safari Day Trip',
    alternates: {
        canonical: '/day-trips',
    },
    openGraph: {
        title: 'Explore Sri Lanka with Private Day Trips & Tours',
        description: 'Expertly curated single-day experiences across Sri Lanka. Visit iconic landmarks with professional transport.',
        url: 'https://airporttaxis.lk/day-trips',
        images: [
            {
                url: '/sigiriya.jpg',
                width: 1200,
                height: 630,
                alt: 'Sigiriya Rock Fortress Day Trip',
            }
        ]
    }
}

export default function DayTripsPage() {
    return <DayTripsClient />
}
