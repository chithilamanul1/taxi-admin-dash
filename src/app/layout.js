import './globals.css'
import Navbar from '../components/Navbar'
import FloatingContact from '../components/FloatingContact'
import Footer from '../components/Footer'
import AuthProvider from '../components/AuthProvider'
import { ThemeProvider } from '../components/ThemeProvider'

export const metadata = {
    title: 'Airport Taxis (Pvt) Ltd - Premium Airport Transfer Service in Sri Lanka',
    description: 'Professional airport taxi and transfer service in Sri Lanka. Book reliable rides from Bandaranaike International Airport (CMB) to any destination. 24/7 service with English-speaking drivers.',
    keywords: 'airport taxi Sri Lanka, CMB airport transfer, Sri Lanka taxi service, Colombo airport transportation, Bandaranaike airport taxi, AirportTaxi, TaxiService, AirportTransfer, TourismSupport, RideWithUs, TravelEasy, BookNow, OnTimeEveryTime, ExploreWithUs, SafeTravel, HassleFreeTravel, BestTaxiService, TrustedByThousands, CustomerFirst, TravelInComfort, LocalTours, CityTours, TravelSafe, TourWithUs, DiscoverMore, ToTheAirport, FromTheAirport, AirportPickup, AirportDropOff, FlightTransfer, RideToAirport, NeverMissAFlight, ReliableTaxi, TravelMadeEasy, TaxiNearMe, 24x7Taxi',
    authors: [{ name: 'Airport Taxis (Pvt) Ltd' }],
    creator: 'Airport Taxis (Pvt) Ltd',
    publisher: 'Airport Taxis (Pvt) Ltd',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL('https://airporttaxi.lk'),
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: 'Airport Taxis (Pvt) Ltd - Premium Airport Transfer Service',
        description: 'Book reliable airport transfers in Sri Lanka. Professional drivers, comfortable vehicles, 24/7 service.',
        url: 'https://airporttaxi.lk',
        siteName: 'Airport Taxis Sri Lanka',
        locale: 'en_US',
        type: 'website',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Airport Taxis Sri Lanka - Premium Transfer Service',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Airport Taxis (Pvt) Ltd - Sri Lanka Airport Transfers',
        description: 'Book reliable airport transfers in Sri Lanka. 24/7 service.',
        images: ['/og-image.jpg'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    icons: {
        icon: '/logo.png',
    },
}

// JSON-LD Structured Data
const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TaxiService',
    name: 'Airport Taxis (Pvt) Ltd',
    description: 'Premium airport transfer service in Sri Lanka',
    url: 'https://airporttaxi.lk',
    telephone: '+94716885880',
    email: 'info@airporttaxi.lk',
    address: {
        '@type': 'PostalAddress',
        addressCountry: 'LK',
        addressLocality: 'Colombo',
    },
    areaServed: {
        '@type': 'Country',
        name: 'Sri Lanka',
    },
    priceRange: '$$',
    openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '00:00',
        closes: '23:59',
    },
    aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '150',
    },
    sameAs: [
        'https://www.facebook.com/airporttaxistours',
        'https://www.instagram.com/airporttaxistours',
    ],
}

import { CurrencyProvider } from '../context/CurrencyContext'

// ... existing imports

import { Inter, Montserrat } from 'next/font/google'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
})

const montserrat = Montserrat({
    subsets: ['latin'],
    variable: '--font-montserrat',
    display: 'swap',
})

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning className={`${inter.variable} ${montserrat.variable}`}>
            <head>
                <link rel="preconnect" href="https://ipapi.co" />
                <link rel="preconnect" href="https://api.exchangerate-api.com" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </head>
            <body className="font-sans text-slate-800 antialiased selection:bg-emerald-600 selection:text-white dark:bg-slate-950 dark:text-slate-100">
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                    <AuthProvider>
                        <CurrencyProvider>
                            <Navbar />
                            <main>{children}</main>
                            <FloatingContact />
                            <Footer />
                        </CurrencyProvider>
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}
