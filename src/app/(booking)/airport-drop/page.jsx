import BookingWidget from '@/components/BookingWidget'
import StatsSection from '@/components/StatsSection'
import Features from '@/components/Features'
import TransferOptionsSection from '@/components/TransferOptionsSection'

export const metadata = {
    title: 'Airport Drop Off & Taxi Service Sri Lanka | Day Trips, Round Tours & Airport Cab Booking Contact | Affordable Tour Taxi & Shuttle Price List',
    description: 'Looking for a reliable Sri Lankan taxi? Book our premier Taxi Service for an Airport Drop Off, Airport Cab, or quick Shuttle. We offer transparent Price Lists for Round Tours, Day Trips, and custom Tour taxi options. Contact our booking team today for the ultimate tourist ride!',
    keywords: [
        'Colombo airport taxi service', 'Sri Lanka airport drop off price', 'Best airport cab Sri Lanka', 'Bandaranaike airport transfer rates', 'Private tour taxi Sri Lanka', 'Sri Lanka driver round tours', 'Negombo to airport shuttle', 'Affordable Sri Lankan taxi booking', 'Kandy to Colombo airport taxi', 'Galle to BIA airport cab'
    ],
    openGraph: {
        title: 'Airport Drop Off & Taxi Service Sri Lanka | Cab Booking',
        description: 'Book our premier Taxi Service for an Airport Drop Off, Airport Cab, or quick Shuttle. Transparent Price Lists for Round Tours and Day Trips.',
        url: 'https://airporttaxis.lk/airport-drop',
        siteName: 'Airport Taxis (Pvt) Ltd',
        images: [
            {
                url: '/logo.png',
                width: 1200,
                height: 630,
                alt: 'Airport Drop Off Sri Lanka',
            }
        ],
        locale: 'en_US',
        type: 'website',
    }
};

export default function AirportDropPage() {
    return (
        <main className="bg-slate-50 dark:bg-emerald-900 min-h-screen">
            <div className="pt-6 md:pt-10 pb-20 px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-emerald-900 dark:text-white mb-4">
                        Airport <span className="text-emerald-600">Drop</span>
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Reliable and punctual airport transfers. We ensure you reach the airport on time for your flight.
                    </p>
                </div>
                <BookingWidget defaultTab="drop" />
            </div>
            
            <StatsSection />
            <Features />
            <TransferOptionsSection />
        </main>
    )
}
