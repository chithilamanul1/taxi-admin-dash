import dynamic from 'next/dynamic'
import BookingWidget from '@/components/BookingWidget'

const StatsSection = dynamic(() => import('@/components/StatsSection'), { ssr: false })
const Features = dynamic(() => import('@/components/Features'), { ssr: false })
const TransferOptionsSection = dynamic(() => import('@/components/TransferOptionsSection'), { ssr: false })

export const metadata = {
    title: 'Airport Pick Up Sri Lanka: Reliable Airport Taxi & Cab Services | Book Affordable Airport Pick Up, 24/7 Budget & Luxury Transfers Islandwide',
    description: 'Looking for a reliable airport taxi or airport cab? We offer seamless airport pickup Sri Lanka services alongside convenient airport drop-offs. Book your comfortable, hassle-free ride today for punctual arrivals and departures at the best rates!',
    keywords: [
        'Sri Lanka airport drop off and pickup services', 'Book airport cab Sri Lanka roundtrip', 'Affordable airport taxi Sri Lanka pickup and drop', 'Bandaranaike international airport cab drop off', 'Sri Lanka airport transfer cab and pickup taxi', 'Reliable airport taxi for drop off Sri Lanka', 'Colombo airport drop off cab booking', 'Best airport pickup Sri Lanka and departure taxi', 'Private airport taxi Sri Lanka drop off hotel', 'Pre-book airport cab Sri Lanka departure and arrival'
    ],
    openGraph: {
        title: 'Airport Pick Up Sri Lanka: Reliable Airport Taxi & Cab Services',
        description: 'Seamless airport pickup Sri Lanka services alongside convenient airport drop-offs. Book your comfortable, hassle-free ride today!',
        url: 'https://airporttaxis.lk/airport-pickup',
        siteName: 'Airport Taxis Pvt (Ltd)',
        images: [
            {
                url: '/logo.png',
                width: 1200,
                height: 630,
                alt: 'Airport Pickup Sri Lanka',
            }
        ],
        locale: 'en_US',
        type: 'website',
    }
};

export default function AirportPickupPage() {
    return (
        <main className="bg-slate-50 dark:bg-emerald-900 min-h-screen">
            <div className="pt-6 md:pt-10 pb-20 px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-emerald-900 dark:text-white mb-4">
                        Airport <span className="text-emerald-600">Pickup</span>
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Professional arrival service. Our driver will be waiting for you at the arrival terminal with your display name board.
                    </p>
                </div>
                <BookingWidget defaultTab="pickup" />
            </div>
            
            <StatsSection />
            <Features />
            <TransferOptionsSection />
        </main>
    )
}
