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
            <div className="pt-10 pb-20">
                <Prices />
            </div>
            <Footer />
        </main>
    )
}
