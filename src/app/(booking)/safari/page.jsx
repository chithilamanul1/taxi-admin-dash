import BookingWidget from '@/components/BookingWidget'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function SafariPage() {
    return (
        <main className="bg-slate-50 dark:bg-slate-950 min-h-screen">
            <Navbar />
            <div className="pt-32 pb-20 px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-emerald-900 dark:text-white mb-4">
                        Wildlife <span className="text-emerald-600">Safari</span>
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Experience the wild side of Sri Lanka. Yala, Udawalawe, and Wilpattu safari tours.
                    </p>
                </div>
                <BookingWidget defaultTab="tours" />
            </div>
            <Footer />
        </main>
    )
}
