import './globals.css'
import Navbar from '../components/Navbar'
import CategoryBar from '../components/CategoryBar'
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
    description: '🚕 Sri Lanka\'s most trusted 24/7 Airport Taxi & Tour service. Book Colombo Airport (CMB) transfers, luxury KDH vans, and curated Sri Lanka tour packages. Fixed rates, professional English-speaking drivers, and instant online booking. Trusted by 10,000+ travelers for Colombo, Kandy, Galle, Sigiriya, and Mirissa transfers. Premium airport shuttle and private car service for all-island travel.',
    keywords: [
        'Airport Taxi Sri Lanka', 'Airport Taxi Service', 'Taxi Service Sri Lanka', 'Airport Cab Booking', 'Airport Taxi Transfers', 
        'Airport Transfers Sri Lanka', 'Booking Airport Transfers', 'Airport Cab Service', 'Cab Booking Sri Lanka', 
        'Airport Shuttle Sri Lanka', 'Airport Shuttle Service', 'Taxi Transfer Sri Lanka', 'Airport Transfer Service', 
        'Airport Car Service', 'Airport Transport Service', 'Taxi Service to the Airport', 'Shuttle Transfers Sri Lanka', 
        'Best Airport Transfers Sri Lanka', 'Cab Service to Airport', 'Airport Chauffeur Service', 'Taxi Van to Airport', 
        'Sri Lanka Airport Taxi Price', 'Airport Transfer Sri Lanka', 'Airport Taxi Service near me', 'Taxi Airport Booking', 
        'Airport Pick Up Service', 'Airport Taxi Price List', 'Cheap Airport Taxi Sri Lanka', 'Airport Transfer Shuttle', 
        'Cab Service Colombo', 'Airport Transfer Colombo Sri Lanka', 'Taxi Service Sri Lanka', 'Taxi in Sri Lanka', 
        'Airport Shuttle Service near me', 'Taxi for Airport Transfer', 'Katunayake airport taxi prices', 'Airport taxi fare',
        'Colombo Airport Transfer', 'CMB Airport Taxi', 'Private Chauffeur Sri Lanka', 'KDH Van Taxi Sri Lanka',
        'Colombo to Kandy taxi', 'Colombo to Galle taxi', 'Bandaranaike International Airport taxi'
    ],

    authors: [{ name: 'Airport Taxis Pvt (Ltd)' }],
    creator: 'Airport Taxis Pvt (Ltd)',
    publisher: 'Airport Taxis Pvt (Ltd)',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL('https://srilankantaxi.lk'),
    alternates: {
        canonical: 'https://srilankantaxi.lk',
    },
    openGraph: {
        title: '🚖 Airport Taxis Sri Lanka - #1 Trusted Airport Transfers & Multi-Day Tours',
        description: 'Instant Booking! Reliable 24/7 airport transfers from Colombo Airport (CMB). Professional drivers, comfortable vehicles (Mini Car, Sedan, KDH Van). Best rates guaranteed for all-island tours.',
        url: 'https://srilankantaxi.lk',
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
const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
        {
            '@type': 'LocalBusiness',
            '@id': 'https://srilankantaxi.lk/#localbusiness',
            name: 'Airport Taxis Pvt (Ltd)',
            image: 'https://srilankantaxi.lk/og-image.jpg',
            url: 'https://srilankantaxi.lk',
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
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                opens: '00:00',
                closes: '23:59'
            },
            aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: 5.0,
                reviewCount: 296
            }
        },
        {
            '@type': 'TaxiService',
            name: 'Airport Taxis Pvt (Ltd)',
            description: 'Premium airport transfer and private tour service in Sri Lanka across Colombo, Kandy, Galle and more.',
            url: 'https://srilankantaxi.lk',
            provider: { '@id': 'https://srilankantaxi.lk/#localbusiness' },
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
            }
        },
        {
            '@type': 'Organization',
            '@id': 'https://srilankantaxi.lk/#organization',
            name: 'Airport Taxis Pvt (Ltd)',
            url: 'https://srilankantaxi.lk',
            logo: {
                '@type': 'ImageObject',
                'url': 'https://srilankantaxi.lk/logo.png',
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
                <meta name="theme-color" content="#059669" />
                <link rel="preconnect" href="https://srilankantaxi.lk" />
                <link rel="dns-prefetch" href="https://srilankantaxi.lk" />
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
                            <div className="sticky top-0 z-[100] w-full flex flex-col">
                                <CategoryBar />
                                <Navbar />
                                <OfferMarquee />
                            </div>
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
