import BookingWidget from '../../components/BookingWidget'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export const metadata = {
    title: 'Taxi Fare Calculator & Rates - Airport Taxis Pvt (Ltd) Sri Lanka',
    description: 'Calculate your exact taxi fare from Colombo Airport (CMB) to any city in Sri Lanka. Transparent pricing, no hidden costs, and instant quotes for all vehicle types.',
    keywords: 'Sri Lanka Taxi Fare Calculator, Airport Taxi Rates Sri Lanka, Colombo Airport Taxi Cost, Sri Lanka Transfer Prices, Taxi Price List Sri Lanka, Fixed Price Airport Taxi',
}

export default function PricesPage() {
    return (
        <main className="bg-slate-50 dark:bg-slate-950 min-h-screen">
            <Navbar />
            <div className="pt-32 pb-20 px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-emerald-900 dark:text-white mb-4">
                        Transparent <span className="text-emerald-600">Pricing</span>
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Get an instant quote for your journey. No hidden fees, just reliable service.
                    </p>
                </div>
                <BookingWidget defaultTab="ride" />
            </div>
            <Footer />
        </main>
    )
}
