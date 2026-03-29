export const metadata = {
    title: 'Sri Lankan Taxi Coupon - 20% OFF Airport Transfers & Tours',
    description: 'Get the latest Sri Lankan Taxi Coupons and discount codes. Save up to 20% on safe, reliable airport transfers and island-wide tours. Official Sri Lanka Taxi promo codes.',
    keywords: 'Sri Lankan Taxi Coupon, Sri Lanka Taxi Discount, Airport Transfer Promo, Tourist Taxi Coupons Sri Lanka, Airport Taxis Sri Lanka Offers',
    alternates: {
        canonical: 'https://srilankantaxi.lk/offers',
    },
    openGraph: {
        title: 'Official Sri Lankan Taxi Coupons - Save on Your Next Ride',
        description: 'Discover our story and why we are the top-rated airport transfer service in Sri Lanka. Use our exclusive coupons for discounts.',
        url: 'https://srilankantaxi.lk/offers',
        siteName: 'Airport Taxis Pvt (Ltd)',
        images: [
            {
                url: '/logo.png',
                width: 800,
                height: 800,
                alt: 'Airport Taxis Sri Lanka Coupons',
            }
        ],
    }
}

export default function OffersLayout({ children }) {
    return <>{children}</>;
}
