import BookingWidget from '../../components/BookingWidget'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export const metadata = {
    title: 'Taxi Prices & Calculator - Airport Taxis Pvt (Ltd)',
    description: 'Calculate your taxi fare from Bandaranaike Airport to any destination in Sri Lanka. Transparent pricing, no hidden fees.',
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
