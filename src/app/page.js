import HomeClient from '../components/HomeClient'

export const metadata = {
    title: 'Airport Taxis Pvt (Ltd) - Premium 24/7 Airport Transfer & Tour Service in Sri Lanka',
    description: '🚖 Book reliable 24/7 airport transfers, city tours & day trips in Sri Lanka. Professional English-speaking drivers, premium vehicles, and best rates from Colombo Airport (CMB). Trusted by thousands!',
    keywords: 'Airport Taxi Sri Lanka, Colombo Airport Transfer, CMB Taxi Service, Bandaranaike Airport Taxi, Airport Pickup Sri Lanka, Airport Drop Off Sri Lanka, Sri Lanka Taxi Booking, Reliable Taxi Sri Lanka, 24/7 Airport Taxi, Sri Lanka Tourism Transport',
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: '🚖 Airport Taxis Sri Lanka - Trusted Airport Transfers & Tours',
        description: 'Reliable 24/7 airport transfers from Colombo Airport (CMB). Professional drivers, comfortable vehicles, instant confirmation.',
        url: 'https://airporttaxis.lk',
        images: [
            {
                url: '/hero-bg.jpg',
                width: 1200,
                height: 630,
                alt: 'Airport Taxis Sri Lanka',
            }
        ]
    }
}

export default function Home() {
    return <HomeClient />
}
