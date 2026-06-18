import './globals.css'
import Navbar from '../components/Navbar'
import CategoryBar from '../components/CategoryBar'
import OfferMarquee from '../components/OfferMarquee'
import FloatingContact from '../components/FloatingContact'
import Footer from '../components/Footer'
import AuthProvider from '../components/AuthProvider'
import { ThemeProvider } from '../components/ThemeProvider'
import dynamic from 'next/dynamic'
import ClientSideWidgets from '../components/ClientSideWidgets'
import DestinationBar from '../components/DestinationBar'
import MobileBottomNav from '../components/MobileBottomNav'

export const metadata = {
    title: {
        default: 'Airport Taxis Pvt (Ltd) - Sri Lanka\'s #1 Airport Transfer & Tour Service',
        template: '%s | Airport Taxis Pvt (Ltd)'
    },
    description: '🚕 Sri Lanka\'s most trusted 24/7 Airport Taxi & Tour service. Book Colombo Airport (CMB) transfers, luxury KDH vans, and curated Sri Lanka tour packages. Fixed rates, professional English-speaking drivers, and instant online booking.',
    keywords: [
        'Airport Taxi Sri Lanka', 'Airport Transfer Sri Lanka', 'Colombo Airport Taxi', 'Sri Lanka Taxi Service',
        'Colombo Airport Transfer', 'Airport Cab Sri Lanka', 'Taxi to Airport Sri Lanka', 'Airport Pickup Sri Lanka',
        'Private Taxi Sri Lanka', 'Airport Shuttle Sri Lanka', 'KDH Van Rental Sri Lanka', 'Sri Lanka Tour Packages',
        'Reliable Taxi Colombo', 'Airport Drop Sri Lanka', 'Colombo Airport Cab', 'Sri Lanka Travel Transport',
        'srilankantaxi.lk', 'airporttaxis.lk', 'airporttaxicab.lk', 'touris.lk', 'taxiairport.lk', 'tourtaxi.lk',
        'sri lankan taxi', 'airport taxis', 'airport taxi cab', 'touris', 'taxi airport', 'tour taxi', 'cab'
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
                url: 'https://airporttaxis.lk/og-image.jpg',
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
        images: ['https://airporttaxis.lk/og-image.jpg'],
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
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                opens: '00:00',
                closes: '23:59'
            },
            aggregateRating: {
                '@type': 'AggregateRating',
                'ratingValue': '4.9',
                'reviewCount': '1250'
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
                            "name": "Colombo Airport to Colombo City Transfer",
                            "description": "Fast and reliable transfer from CMB Airport to Colombo hotels."
                        }
                    },
                    {
                        "@type": "Offer",
                        "itemOffered": {
                            "@type": "Service",
                            "name": "Colombo Airport to Kandy Transfer",
                            "description": "Comfortable 3-hour journey to the hill capital Kandy."
                        }
                    },
                    {
                        "@type": "Offer",
                        "itemOffered": {
                            "@type": "Service",
                            "name": "Colombo Airport to Galle Transfer",
                            "description": "Smooth highway transfer to the historic city of Galle."
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
            address: {
                '@type': 'PostalAddress',
                streetAddress: '118/5 St. Joseph Street, Grandpass',
                addressLocality: 'Colombo',
                postalCode: '01400',
                addressCountry: 'LK'
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

import { Inter, Montserrat, Dancing_Script } from 'next/font/google'

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

const dancingScript = Dancing_Script({
    subsets: ['latin'],
    variable: '--font-dancing-script',
    display: 'swap',
})

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning className={`${inter.variable} ${montserrat.variable} ${dancingScript.variable} scroll-smooth scroll-pt-[240px] md:scroll-pt-[180px]`}>
            <head>
                <meta name="theme-color" content="#059669" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
                <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
                
                {/* Google Maps Preconnect */}
                <link rel="preconnect" href="https://maps.googleapis.com" />
                <link rel="preconnect" href="https://maps.gstatic.com" crossOrigin="anonymous" />
                <link rel="dns-prefetch" href="https://maps.googleapis.com" />
                <link rel="dns-prefetch" href="https://maps.gstatic.com" />

                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
                
                {/* Unregister stale service workers to fix Vercel DEPLOYMENT_NOT_FOUND errors */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            if (typeof window !== 'undefined') {
                                // Catch Webpack ChunkLoadErrors and force a reload
                                const handleChunkError = (e) => {
                                    const msg = (e.message || (e.reason && e.reason.message) || '');
                                    if (/Loading chunk [\d]+ failed/.test(msg) || /ChunkLoadError/.test(msg)) {
                                        if (!sessionStorage.getItem('chunk_error_reloaded')) {
                                            sessionStorage.setItem('chunk_error_reloaded', 'true');
                                            window.location.reload();
                                        }
                                    }
                                };
                                window.addEventListener('error', handleChunkError);
                                window.addEventListener('unhandledrejection', handleChunkError);

                                // Unregister stale service workers
                                if ('serviceWorker' in navigator) {
                                    window.addEventListener('load', function() {
                                        navigator.serviceWorker.getRegistrations().then(function(registrations) {
                                            for(let registration of registrations) {
                                                registration.unregister();
                                            }
                                        }).catch(function(err) {
                                            console.log('Service Worker unregistration failed: ', err);
                                        });
                                    });
                                }
                            }
                        `
                    }}
                />
            </head>
            <body className="font-sans antialiased selection:bg-emerald-600 selection:text-white transition-colors duration-300 overflow-x-hidden">
                <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>

                    <AuthProvider>
                        <CurrencyProvider>
                            <div className="sticky top-0 z-[500] w-full flex flex-col">
                                <Navbar />
                                <OfferMarquee />
                                <CategoryBar />
                                <DestinationBar />
                            </div>
                            <main>{children}</main>
                            <FloatingContact />
                            <ClientSideWidgets />
                            <Footer />
                            <MobileBottomNav />
                        </CurrencyProvider>
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}
