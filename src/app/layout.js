import './globals.css'
import Navbar from '../components/Navbar'
import FloatingContact from '../components/FloatingContact'
import Footer from '../components/Footer'
import AuthProvider from '../components/AuthProvider'
import { ThemeProvider } from '../components/ThemeProvider'
import LiveChatWidget from '../components/LiveChatWidget'

export const metadata = {
    title: 'Airport Taxis Pvt (Ltd) - Premium 24/7 Airport Transfer & Tour Service',
    description: '🚖 Trusted by thousands! Book reliable airport transfers, city tours & day trips in Sri Lanka. Professional English-speaking drivers, comfortable vehicles, instant confirmation. Available 24/7 from Colombo Airport (CMB) to anywhere in Sri Lanka. Best rates guaranteed!',
    keywords: [
        'Airport Taxi Sri Lanka',
        'Colombo Airport Transfer',
        'CMB Airport Taxi',
        'Sri Lanka Day Trips',
        'Sri Lanka Tour Packages',
        'Private Chauffeur Sri Lanka',
        'Airport Pickup Colombo',
        'Travel Sri Lanka Transport'
    ],

    authors: [{ name: 'Airport Taxis Pvt (Ltd)' }],
    creator: 'Airport Taxis Pvt (Ltd)',
    publisher: 'Airport Taxis Pvt (Ltd)',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL('https://airporttaxis.lk'),
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: '🚖 Airport Taxis Sri Lanka - Trusted Airport Transfers & Tours',
        description: 'Book Now! Reliable 24/7 airport transfers from Colombo Airport (CMB). Professional drivers, comfortable vehicles, instant confirmation. Explore Sri Lanka with trusted taxi service.',
        url: 'https://airporttaxis.lk',
        siteName: 'Airport Taxis Pvt (Ltd)',
        locale: 'en_US',
        type: 'website',
        images: [
            {
                url: '/logo.png',
                width: 512,
                height: 512,
                alt: 'Airport Taxis Sri Lanka - Your Trusted Airport Transfer Partner',
            },
        ],
    },

    twitter: {
        card: 'summary_large_image',
        title: '🚖 Airport Taxis Sri Lanka - Book Your Ride Now',
        description: 'Trusted 24/7 airport transfers & tours. Professional drivers, instant confirmation, best rates guaranteed!',
        images: ['/logo.png'],
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
    name: 'Airport Taxis Pvt (Ltd)',
    description: 'Premium airport transfer service in Sri Lanka',
    url: 'https://airporttaxis.lk',
    telephone: '+94716885880',
    email: 'info@airporttaxis.lk',
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
        ratingValue: '5.0',
        reviewCount: '296',
    },
    sameAs: [
        'https://www.facebook.com/airporttaxistours',
        'https://www.instagram.com/airporttaxistours',
    ],
}

import { CurrencyProvider } from '../context/CurrencyContext'
import BottomNav from '../components/BottomNav'

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
                <link rel="dns-prefetch" href="https://ipapi.co" />
                <link rel="preconnect" href="https://api.exchangerate-api.com" />
                <link rel="dns-prefetch" href="https://api.exchangerate-api.com" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
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
                            <BottomNav />
                            <FloatingContact />
                            <LiveChatWidget />
                            <Footer />
                        </CurrencyProvider>
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}
