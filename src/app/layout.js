import './globals.css'
import Navbar from '../components/Navbar'
import OfferMarquee from '../components/OfferMarquee'
import FloatingContact from '../components/FloatingContact'
import Footer from '../components/Footer'
import AuthProvider from '../components/AuthProvider'
import { ThemeProvider } from '../components/ThemeProvider'
import LiveChatWidget from '../components/LiveChatWidget'

export const metadata = {
    title: {
        default: 'Airport Taxis Pvt (Ltd) - Sri Lanka\'s #1 Airport Transfer & Tour Service',
        template: '%s | Airport Taxis Pvt (Ltd)'
    },
    description: '🚕 Sri Lanka\'s most trusted 24/7 Airport Taxi & Tour service. Book Colombo Airport (CMB) transfers, luxury KDH vans, and curated Sri Lanka tour packages. Fixed rates, professional English-speaking drivers, and instant online booking. Trusted by 10,000+ travelers for Colombo, Kandy, Galle, and Sigiriya transfers.',
    keywords: [
        'Airport Taxi Sri Lanka', 'Colombo Airport Transfer', 'CMB Airport Taxi', 'Sri Lanka Day Trips', 'Sri Lanka Tour Packages',
        'Private Chauffeur Sri Lanka', 'Airport Pickup Colombo', 'Travel Sri Lanka Transport', 'Taxi service Colombo',
        'Cheap airport taxi Sri Lanka', 'Book taxi Colombo airport', 'Sri Lanka airport car hire with driver',
        'Colombo to Kandy taxi', 'Colombo to Galle taxi', 'Bandaranaike International Airport taxi', 'Sri Lanka transport guide',
        'taxi service', 'taxi sri lanka', 'kangaroo cabs', 'airport taxis', 'taxi near me', 'uber taxi',
        'airport transfer sri lanka', 'sri lanka private tours', 'sri lanka driver for 10 days', 'best taxi service sri lanka'
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
        canonical: 'https://airporttaxis.lk',
    },
    openGraph: {
        title: '🚖 Airport Taxis Sri Lanka - #1 Trusted Airport Transfers & Multi-Day Tours',
        description: 'Instant Booking! Reliable 24/7 airport transfers from Colombo Airport (CMB). Professional drivers, comfortable vehicles (Mini Car, Sedan, KDH Van). Best rates guaranteed for all-island tours.',
        url: 'https://airporttaxis.lk',
        siteName: 'Airport Taxis Pvt (Ltd)',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Airport Taxis Sri Lanka - Your Trusted Airport Transfer Partner',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },

    twitter: {
        card: 'summary_large_image',
        title: '🚖 Airport Taxis Sri Lanka - Premium Airport Rides & Tours',
        description: 'Trusted 24/7 airport transfers & tours. Professional drivers, instant confirmation, best rates guaranteed!',
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
        icon: [
            { url: '/favicon.ico' },
            { url: '/logo.png', type: 'image/png' },
        ],
        apple: '/logo.png',
    },
}

// JSON-LD Structured Data
const jsonLd = [
    {
        '@context': 'https://schema.org',
        '@type': 'TaxiService',
        name: 'Airport Taxis Pvt (Ltd)',
        description: 'Premium airport transfer and private tour service in Sri Lanka across Colombo, Kandy, Galle and more.',
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
        hasOfferCatalog: {
            "@type": "OfferCatalog",
            "name": "Airport Transfer Services",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Colombo Airport to Colombo City Transfer"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Colombo Airport to Kandy Transfer"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Colombo Airport to Galle Transfer"
                    }
                }
            ]
        },
        sameAs: [
            'https://www.facebook.com/airporttaxistours',
            'https://www.instagram.com/airporttaxistours',
            'https://wa.me/94716885880'
        ],
    },
    {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        '@id': 'https://airporttaxis.lk/#localbusiness',
        name: 'Airport Taxis Pvt (Ltd)',
        image: 'https://airporttaxis.lk/og-image.jpg',
        url: 'https://airporttaxis.lk',
        telephone: '+94716885880',
        priceRange: '$$',
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'Bandaranaike International Airport',
            addressLocality: 'Katunayake',
            postalCode: '11450',
            addressCountry: 'LK'
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: 7.1811,
            longitude: 79.8837
        },
        openingHoursSpecification: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: [
                'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
            ],
            opens: '00:00',
            closes: '23:59'
        }
    },
    {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': 'https://airporttaxis.lk/#organization',
        name: 'Airport Taxis Pvt (Ltd)',
        url: 'https://airporttaxis.lk',
        logo: {
            '@type': 'ImageObject',
            'url': 'https://airporttaxis.lk/logo.png',
            'width': 512,
            'height': 512
        },
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+94716885880',
            contactType: 'customer service',
            areaServed: 'LK',
            availableLanguage: ['English', 'Sinhala']
        },
        sameAs: [
            'https://www.facebook.com/airporttaxistours',
            'https://www.instagram.com/airporttaxistours',
            'https://wa.me/94716885880'
        ]
    }
]

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
                <meta name="theme-color" content="#059669" />
                <link rel="preconnect" href="https://airporttaxis.lk" />
                <link rel="dns-prefetch" href="https://airporttaxis.lk" />
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
            <body className="font-sans antialiased selection:bg-emerald-600 selection:text-white transition-colors duration-300">
                <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>

                    <AuthProvider>
                        <CurrencyProvider>
                            <OfferMarquee />
                            <Navbar />
                            <main>{children}</main>
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
