import RoundTripBookingWrapper from '@/components/RoundTripBookingWrapper';

export const metadata = {
  title: 'Round Trip Booking | Airport Taxi Tours',
  description: 'Book a premium round trip or city ride. Fixed rates for Mini, Sedan, Vezel, and Van vehicles.',
  keywords: [
      'Sri Lanka Round Trips', 'Private Tours Sri Lanka', 'City Rides Colombo', 'Taxi Service Sri Lanka',
      'Round Trip Cab Booking', 'Premium Cab Sri Lanka', 'Colombo Taxi Service', 'Private Taxi Sri Lanka'
  ],
  alternates: {
      canonical: 'https://srilankantaxi.lk/round-trips',
  },
  openGraph: {
      title: 'Round Trip Booking | Airport Taxis Sri Lanka',
      description: 'Book a premium round trip or city ride. Professional drivers, comfortable vehicles, instant confirmation. Best rates guaranteed.',
      url: 'https://srilankantaxi.lk/round-trips',
      siteName: 'Airport Taxis Pvt (Ltd)',
      images: [
          {
              url: '/hero-bg.png',
              width: 1200,
              height: 630,
              alt: 'Round Trips and Premium City Rides',
          }
      ],
      locale: 'en_US',
      type: 'website',
  },
  twitter: {
      card: 'summary_large_image',
      title: 'Round Trip Booking | Airport Taxis Sri Lanka',
      description: 'Instant booking for premium round trips and city rides across Sri Lanka.',
      images: ['/hero-bg.png'],
  }
};

export default function RoundTripsPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-zinc-950 transition-colors relative">
      <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.06] dark:opacity-[0.02] pointer-events-none z-0"></div>
      
      {/* Premium Compact Header */}
      <section className="pt-24 pb-32 bg-emerald-950 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="/hero-bg.png" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50 dark:to-zinc-950"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center mb-8">
            <span className="text-emerald-400 text-[10px] font-black tracking-[0.4em] uppercase mb-4 animate-fade-in">
              Premium City Services
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter uppercase leading-none max-w-3xl">
              Round <span className="text-emerald-400 italic font-serif">Trips</span> & City Rides
            </h1>
            <div className="w-12 h-1 bg-emerald-400 rounded-full" />
          </div>
        </div>
      </section>

      {/* Booking Form Section - Sleek Positioning */}
      <section className="container mx-auto px-4 sm:px-6">
        <div className="relative -mt-24 z-20 pb-20">
          <RoundTripBookingWrapper />
        </div>
      </section>

      {/* Modern Info Grid */}
      <section className="py-24 bg-white dark:bg-zinc-900/50 border-t border-slate-100 dark:border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', title: 'On-Time Priority', desc: 'Our drivers arrive early to ensure zero delays for your journey.' },
              { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', title: 'Elite Safety', desc: 'Verified professionals and luxury vehicles maintained to global standards.' },
              { icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z', title: 'Fixed Transparency', desc: 'Clear, upfront pricing with no hidden fees or unexpected surges.' }
            ].map((item, i) => (
              <div key={i} className="p-8 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 hover:border-emerald-500/20 transition-all group">
                <div className="w-12 h-12 bg-white dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 shadow-sm group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={item.icon}></path></svg>
                </div>
                <h3 className="font-black text-emerald-950 dark:text-white uppercase tracking-tight mb-2 text-sm">{item.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
