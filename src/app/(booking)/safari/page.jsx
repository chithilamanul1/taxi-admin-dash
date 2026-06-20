import SafariClient from '@/components/SafariClient'

export const metadata = {
    title: 'Sri Lanka Wildlife Safari Tours | Yala, Minneriya & Udawalawe',
    description: 'Book thrilling wildlife safari tours in Sri Lanka. Experience leopard watching in Yala, the elephant gathering in Minneriya, and explore Udawalawe National Park with expert guides.',
    alternates: { canonical: 'https://airporttaxis.lk/safari' },
    openGraph: {
        title: '🦁 Sri Lanka Wildlife Safari Tours | Airport Taxis',
        description: 'Explore Sri Lanka\'s best national parks with our guided safari tours. Book Yala, Udawalawe, Minneriya, and Wilpattu safaris today.',
        url: 'https://airporttaxis.lk/safari',
    }
}

export default function SafariPage() {
    return (
        <SafariClient />
    )
}
