import HomeClient from '@/components/HomeClient'
import { generateMetadata } from '@/lib/seo'

export const metadata = generateMetadata({
    title: '🚖 Intercity Rides Sri Lanka - City to City Taxi Transfers',
    description: 'Book intercity taxi transfers across Sri Lanka. Fixed rates, comfortable rides, and professional drivers for long-distance travel between cities like Colombo, Kandy, Galle, and Ella.',
    url: 'https://srilankantaxi.lk/intercity-rides'
});

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
                            "name": "Airport Taxis Pvt (Ltd)",
                            "logo": "https://srilankantaxi.lk/logo.png"
                        }
                    })
                }}
            />
            <HomeClient defaultTab="ride" />
        </>
    )
}
