import OffersClient from '@/components/OffersClient'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = {
    title: 'Airport Taxi Promo Codes & Special Offers - Save on Sri Lanka Transfers',
    description: 'Get exclusive discounts and promotional codes for your next airport taxi in Sri Lanka. Save on transfers from Colombo Airport (CMB) to Galle, Sigiriya, Mirissa, and more.',
    keywords: 'Airport Taxi Promo Code, Sri Lanka Taxi Discount, Cheap Airport Transfer Sri Lanka, Taxi Deals Sri Lanka, Airport Taxis Vouchers, Save on Sri Lanka Taxi, CMB Airport Taxi Offers',
    alternates: {
        canonical: '/offers',
    },
    openGraph: {
        title: 'Special Offers & Discounts - Airport Taxis Sri Lanka',
        description: 'Exclusive promo codes and seasonal deals for the most reliable airport transfer service in Sri Lanka. Book and save today!',
        url: 'https://airporttaxis.lk/offers',
        images: [
            {
                url: '/logo.png',
                width: 512,
                height: 512,
                alt: 'Airport Taxis Offers',
            }
        ]
    }
}

export default function OffersPage() {
    return (
        <>
            <Navbar />
            <main>
                <OffersClient />
            </main>
            <Footer />
        </>
    )
}
