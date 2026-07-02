import BookingWidget from '@/components/BookingWidget'
import StatsSection from '@/components/StatsSection'
import Features from '@/components/Features'
import TransferOptionsSection from '@/components/TransferOptionsSection'

export const metadata = {
    title: 'Best Sri Lankan Taxi Cab Service | Island Wide Service to All Tourism Areas & Airports. Secure Online Cab Booking Across Sri Lanka!',
    description: 'Looking for a reliable Sri Lankan taxi service? We offer premium cab service across all tourism areas with convenient island-wide service. Experience safe, comfortable, and affordable travel across Sri Lanka. Book your ride today for hassle-free island journeys!',
    keywords: [
        'best taxi service in sri lanka', 'sri lanka tourist cab service', 'colombo airport transfer taxi', 'island wide cab service sri lanka', 'hire car with driver sri lanka', 'reliable taxi service near me', 'sri lanka travel taxi packages', 'private cab service colombo', 'affordable outstation cabs sri lanka', 'sri lanka holiday transport provider'
    ],
    openGraph: {
        title: 'Best Sri Lankan Taxi Cab Service | Secure Online Cab Booking',
        description: 'Premium cab service across all tourism areas with convenient island-wide service. Book your ride today!',
        url: 'https://airporttaxis.lk/ride',
        siteName: 'Airport Taxis Pvt (Ltd)',
        images: [
            {
                url: '/logo.png',
                width: 1200,
                height: 630,
                alt: 'Sri Lankan Taxi Service',
            }
        ],
        locale: 'en_US',
        type: 'website',
    }
};

export default function RidePage() {
    return (
        <main className="bg-slate-50 dark:bg-emerald-900 min-h-screen">
            <div className="pt-6 md:pt-10 pb-20 px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-emerald-900 dark:text-white mb-4">
                        Inter City <span className="text-emerald-600">Rides</span>
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Safe, comfortable, and affordable point-to-point travel across Sri Lanka.
                    </p>
                </div>
                <BookingWidget defaultTab="ride" />
            </div>
            
            <StatsSection />
            <Features />
            <TransferOptionsSection />
        </main>
    )
}
