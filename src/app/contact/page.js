import Contact from '../../components/views/Contact'

export const metadata = {
    title: '📞 Contact Us - 24/7 Airport Taxi & Tour Support in Sri Lanka',
    description: 'Get in touch with Airport Taxis (Pvt) Ltd for instant bookings, inquiries, and 24/7 customer support. Reach us via WhatsApp (+94 71 688 5880), phone, or email for your Sri Lanka travel needs.',
    keywords: 'Contact Airport Taxis Sri Lanka, WhatsApp Taxi Booking Sri Lanka, Airport Taxi Phone Number, 24/7 Taxi Support Sri Lanka, Book Taxi Colombo Airport, Sri Lanka Chauffeur Contact',
    alternates: {
        canonical: 'https://airporttaxis.lk/contact',
    },
    openGraph: {
        title: 'Contact Airport Taxis Sri Lanka - Available 24/7',
        description: 'Need a ride? Contact us anytime for reliable airport pickups and custom tours in Sri Lanka.',
        url: 'https://airporttaxis.lk/contact',
        siteName: 'Airport Taxis (Pvt) Ltd',
        images: [
            {
                url: '/logo.png',
                width: 800,
                height: 800,
                alt: 'Contact Airport Taxis Sri Lanka',
            }
        ],
    }
}

export default function ContactPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "ContactPage",
                        "mainEntity": {
                            "@type": "Organization",
                            "name": "Airport Taxis (Pvt) Ltd",
                            "telephone": "+94716885880",
                            "email": "info@airporttaxis.lk",
                            "contactPoint": {
                                "@type": "ContactPoint",
                                "telephone": "+94716885880",
                                "contactType": "customer service",
                                "availableLanguage": ["English", "Sinhala"]
                            }
                        }
                    })
                }}
            />
            <Contact />
        </>
    )
}
