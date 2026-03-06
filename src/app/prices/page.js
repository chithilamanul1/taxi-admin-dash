import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Prices from '../../components/views/Prices'

export const metadata = {
    title: '💸 Taxi Fare Calculator & Rates - Airport Taxis Pvt (Ltd) Sri Lanka',
    description: 'Calculate your exact taxi fare from Colombo Airport (CMB) to any city in Sri Lanka. Transparent pricing, no hidden costs, and instant quotes for Mini Cars, Sedans, and KDH Vans. Best price guarantee.',
    keywords: 'Sri Lanka Taxi Fare Calculator, Airport Taxi Rates Sri Lanka, Colombo Airport Taxi Cost, Sri Lanka Transfer Prices, Taxi Price List Sri Lanka, Fixed Price Airport Taxi, Cheapest Airport Transfer Sri Lanka',
    alternates: {
        canonical: 'https://airporttaxis.lk/prices',
    },
    openGraph: {
        title: 'Transparent Taxi Rates & Fare Calculator - Sri Lanka',
        description: 'Get an instant quote for your airport transfer. No hidden fees, all-inclusive rates for all destinations in Sri Lanka.',
        url: 'https://airporttaxis.lk/prices',
        siteName: 'Airport Taxis Pvt (Ltd)',
        images: [
            {
                url: '/logo.png',
                width: 800,
                height: 800,
                alt: 'Airport Taxis Sri Lanka Rates',
            }
        ],
    }
}

export default function PricesPage() {
    return (
        <main className="bg-slate-50 dark:bg-emerald-900 min-h-screen">
            <Navbar />
            <div className="pt-10 pb-20">
                <Prices />
            </div>
            <Footer />
        </main>
    )
}
