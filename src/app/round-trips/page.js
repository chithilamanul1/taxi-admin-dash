import RoundTripBookingWrapper from '@/components/RoundTripBookingWrapper';

export const metadata = {
  title: 'Round Trip Booking | Kapi Travels',
  description: 'Book a premium round trip or city ride with Kapi Travels. Fixed rates for Mini, Sedan, and Vezel vehicles.',
};

export default function RoundTripsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      
      {/* Header Section */}
      <section className="pt-32 pb-20 bg-emerald-950 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="/hero-bg.png" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-[1px] w-12 bg-emerald-400" />
            <span className="text-emerald-400 text-[10px] font-black tracking-[0.4em] uppercase">
              Flexible City Rides
            </span>
            <div className="h-[1px] w-12 bg-emerald-400" />
          </div>
          <h1 className="text-4xl md:text-7xl font-serif font-black text-white mb-6 tracking-tighter uppercase leading-none">
            Round <span className="text-emerald-400 italic">Trips</span>
          </h1>
          <p className="text-emerald-100/60 max-w-xl mx-auto font-medium text-sm md:text-base leading-relaxed">
            Premium hourly and distance-based packages designed for your convenience. Explore the city in style with our elite fleet.
          </p>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="py-20 container mx-auto px-6">
        <div className="relative -mt-32 z-20">
          <RoundTripBookingWrapper />
        </div>
      </section>

      {/* Info Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h3 className="font-black text-emerald-950 uppercase tracking-tighter">On-Time Guarantee</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Punctuality is our priority. We ensure your driver arrives before your scheduled pickup time.</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              </div>
              <h3 className="font-black text-emerald-950 uppercase tracking-tighter">Safety First</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Verified professional drivers and regularly maintained luxury vehicles for your peace of mind.</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              </div>
              <h3 className="font-black text-emerald-950 uppercase tracking-tighter">Transparent Pricing</h3>
              <p className="text-slate-500 text-sm leading-relaxed">What you see is what you pay. No hidden charges or unexpected surges for your booking.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
