import Services from '../../components/views/Services'

export const metadata = {
    title: 'Our Services | Premium Taxi & Transport Solutions Sri Lanka',
    description: 'Explore our range of premium taxi services including airport transfers, city tours, round trips, and customized transport solutions in Sri Lanka. Trusted 24/7 service with professional drivers.',
    alternates: { canonical: 'https://airporttaxis.lk/services' },
    openGraph: {
        title: 'Premium Taxi & Transport Services Sri Lanka | Airport Taxis',
        description: 'From airport pickups to island-wide tours, explore our trusted transport services.',
        url: 'https://airporttaxis.lk/services',
    }
}

export default function ServicesPage() {
    return <Services />
}
