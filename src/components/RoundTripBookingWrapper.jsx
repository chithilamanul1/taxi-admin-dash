'use client';

import dynamic from 'next/dynamic';

const CustomTourBooking = dynamic(() => import('./CustomTourBooking'), { 
  ssr: false,
  loading: () => (
    <div className="min-h-[400px] flex items-center justify-center bg-white rounded-3xl shadow-xl border border-slate-100">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
        <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Loading Booking Engine...</p>
      </div>
    </div>
  )
});

export default function RoundTripBookingWrapper() {
  return <CustomTourBooking />;
}
