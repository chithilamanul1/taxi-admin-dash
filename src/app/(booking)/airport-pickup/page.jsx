import BookingWidget from '@/components/BookingWidget'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function AirportPickupPage() {
    return (
        <main className="bg-slate-50 dark:bg-slate-950 min-h-screen">
            <Navbar />
            <div className="pt-32 pb-20 px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-emerald-900 dark:text-white mb-4">
                        Airport <span className="text-emerald-600">Pickup</span>
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Professional meet & greet service. Our driver will be waiting for you at the arrival terminal with your name board.
                    </p>
                </div>
                <BookingWidget defaultTab="pickup" />
            </div>
            <Footer />
        </main>
    )
}
