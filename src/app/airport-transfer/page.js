import AirportTransferWrapper from '@/components/AirportTransferWrapper';

export const metadata = {
  title: 'Airport Transfer Booking | Airport Taxi Tours',
  description: 'Book your Airport Taxi in Sri Lanka with instant confirmation. 24/7 Colombo Airport (CMB) transfers, private chauffeurs, and luxury vehicles. Fixed rates, no hidden fees.',
  keywords: [
      'Sri Lanka Airport Taxi', 'Airport Transfer Sri Lanka', 'Colombo Airport Taxi', 'Taxi Service Sri Lanka',
      'Airport Cab Booking', 'Airport Shuttle Sri Lanka', 'CMB Airport Taxi', 'Private Taxi Sri Lanka'
  ],
  alternates: {
      canonical: 'https://airporttaxis.lk/airport-transfer',
  },
  openGraph: {
      title: 'Airport Transfer Booking | Airport Taxis Sri Lanka',
      description: 'Reliable 24/7 airport transfers from Colombo Airport (CMB). Professional drivers, comfortable vehicles, instant confirmation. Best rates guaranteed.',
      url: 'https://airporttaxis.lk/airport-transfer',
      siteName: 'Airport Taxis (Pvt) Ltd',
      images: [
          {
              url: '/hero-bg.jpg',
              width: 1200,
              height: 630,
              alt: 'Airport Taxis Sri Lanka Transfer Service',
          }
      ],
      locale: 'en_US',
      type: 'website',
  },
  twitter: {
      card: 'summary_large_image',
      title: 'Airport Transfer Booking | Airport Taxis Sri Lanka',
      description: 'Instant booking for 24/7 airport transfers across Sri Lanka.',
      images: ['/hero-bg.jpg'],
  }
};

export default function AirportTransferPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-black transition-colors">
      <AirportTransferWrapper />
    </main>
  );
}
