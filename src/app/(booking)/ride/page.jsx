import BookingWidget from '@/components/BookingWidget'
import Footer from '@/components/Footer'

export const metadata = {
    title: 'Book a Ride - Airport Taxis Sri Lanka',
    description: 'Reliable point-to-point rides across Sri Lanka. Instant quotes, professional drivers, and premium vehicles.',
};

export default function RidePage() {
    return (
        <main className="bg-slate-50 dark:bg-emerald-900 min-h-screen">
            <div className="pt-32 pb-20 px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-emerald-900 dark:text-white mb-4 uppercase italic tracking-tighter">
                        POINT-TO-POINT <span className="text-[#FACC15]">RIDE</span>
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">
                        Need a ride between cities? Book a comfortable point-to-point transfer with fixed rates and professional chauffeurs.
                    </p>
                </div>
                <BookingWidget defaultTab="ride" />
            </div>
            
        </main>
    )
}
