import HomeClient from '@/components/HomeClient'
export const metadata = {
    title: 'Best Sri Lankan Taxi Cab Service | Island Wide Service to All Tourism Areas & Airports. Secure Online Cab Booking Across Sri Lanka!',
    description: 'Looking for a reliable Sri Lankan taxi service? We offer premium cab service across all tourism areas with convenient island-wide service. Experience safe, comfortable, and affordable travel across Sri Lanka. Book your ride today for hassle-free island journeys!',
    keywords: [
        'best taxi service in sri lanka', 'sri lanka tourist cab service', 'colombo airport transfer taxi', 'island wide cab service sri lanka', 'hire car with driver sri lanka', 'reliable taxi service near me', 'sri lanka travel taxi packages', 'private cab service colombo', 'affordable outstation cabs sri lanka', 'sri lanka holiday transport provider'
    ],
    alternates: {
        canonical: 'https://airporttaxis.lk/rides'
    },
    openGraph: {
        title: 'Best Sri Lankan Taxi Cab Service | Secure Online Cab Booking',
        description: 'Premium cab service across all tourism areas with convenient island-wide service. Book your ride today!',
        url: 'https://airporttaxis.lk/rides',
        siteName: 'Airport Taxis (Pvt) Ltd',
    }
};

export default function IntercityRidesPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebPage",
                        "name": "Intercity Taxi Rides in Sri Lanka",
                        "description": "Book reliable intercity transfers and point-to-point rides in Sri Lanka.",
                        "dateModified": new Date().toISOString().split('T')[0],
                        "publisher": {
                            "@type": "Organization",
                            "name": "Airport Taxis (Pvt) Ltd",
                            "logo": "https://airporttaxis.lk/logo.png"
                        }
                    })
                }}
            />
            <HomeClient defaultTab="ride" />
        </>
    )
}
