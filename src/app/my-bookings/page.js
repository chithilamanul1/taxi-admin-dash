'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Car, ArrowRight, Loader2, User, Package } from 'lucide-react';

export default function MyBookingsPage() {
    const { data: session } = useSession();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('upcoming');

    useEffect(() => {
        const fetchBookings = async () => {
            setLoading(true);
            try {
                let url = '/api/bookings';
                let guestIds = [];

                // Get guest bookings from local storage
                try {
                    guestIds = JSON.parse(localStorage.getItem('guest_bookings') || '[]');
                } catch (e) { console.error(e); }

                // Construct query
                const params = new URLSearchParams();
                if (guestIds.length > 0 && !session) {
                    params.append('ids', guestIds.join(','));
                }

                // If user logged in, API handles it via session. 
                // If guest, we pass IDs. 
                // If logged in user ALSO has guest bookings... we might want to merge? 
                // For now, let's just let logged in user see their account bookings.
                // The API logic: if session exists, it returns user bookings.

                // Wait, if I want to merge, I might need custom logic.
                // Current API: if session, ignores ID param?
                // Let's check API I just wrote...
                // "else if (session) { query.customer = session.user.id }"
                // So logged in user CANNOT fetch guest bookings via ID param currently.
                // I'll stick to: Logged in = Account Bookings. Guest = Guest Bookings.

                if (guestIds.length > 0 && !session) {
                    url += `?${params.toString()}`;
                }

                if (!session && guestIds.length === 0) {
                    setBookings([]);
                    setLoading(false);
                    return;
                }

                const res = await fetch(url);
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data)) setBookings(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [session]);

    const activeBookings = bookings.filter(b => ['pending', 'assigned', 'ongoing', 'confirmed'].includes(b.status));
    const pastBookings = bookings.filter(b => ['completed', 'cancelled'].includes(b.status));

    const displayedBookings = activeTab === 'upcoming' ? activeBookings : pastBookings;

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-5xl font-black text-black uppercase italic tracking-tighter leading-none mb-2">MY BOOKINGS</h1>
                        <p className="text-[#00A99D] font-black uppercase tracking-[0.3em] text-[10px] italic">Manage and track your journeys across Sri Lanka.</p>
                    </div>
                    {session && (
                        <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-none border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            <div className="w-10 h-10 bg-[#006064] rounded-none border-2 border-black flex items-center justify-center text-white font-black italic">
                                {session.user.name?.[0].toUpperCase()}
                            </div>
                            <span className="text-xs font-black text-black uppercase tracking-widest italic">{session.user.name}</span>
                        </div>
                    )}
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-12 border-b-4 border-black">
                    <button
                        onClick={() => setActiveTab('upcoming')}
                        className={`px-8 py-4 font-black text-xs uppercase tracking-[0.2em] italic border-b-8 transition-all ${activeTab === 'upcoming' ? 'border-[#006064] text-black bg-slate-100/50' : 'border-transparent text-slate-400 hover:text-black hover:bg-slate-50'}`}
                    >
                        Upcoming ({activeBookings.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`px-8 py-4 font-black text-xs uppercase tracking-[0.2em] italic border-b-8 transition-all ${activeTab === 'history' ? 'border-[#006064] text-black bg-slate-100/50' : 'border-transparent text-slate-400 hover:text-black hover:bg-slate-50'}`}
                    >
                        History ({pastBookings.length})
                    </button>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="py-24 flex justify-center bg-white border-4 border-black shadow-[15px_15px_0px_0px_rgba(0,0,0,1)]"><Loader2 className="animate-spin text-[#006064]" size={48} strokeWidth={3} /></div>
                ) : displayedBookings.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-8">
                        {displayedBookings.map(booking => (
                            <Link key={booking._id} href={`/booking/${booking._id}`} className="block group">
                                <div className="bg-white rounded-none p-8 border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[15px_15px_0px_0px_#006064] group-hover:translate-y-[-4px] transition-all cursor-pointer h-full flex flex-col justify-between">
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-4">
                                                <span className={`px-4 py-1.5 rounded-none border-2 border-black text-[10px] font-black uppercase tracking-[0.2em] italic shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${booking.status === 'confirmed' ? 'bg-emerald-400 text-black' :
                                                    booking.status === 'pending' ? 'bg-[#FACC15] text-black' :
                                                        booking.status === 'cancelled' ? 'bg-rose-500 text-white' : 'bg-slate-200 text-black'
                                                    }`}>
                                                    {booking.status}
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">#{booking._id.slice(-6).toUpperCase()}</span>
                                            </div>
                                            <p className="font-black text-black bg-[#FACC15] px-4 py-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-sm italic tracking-tighter">
                                                Rs {booking.totalPrice.toLocaleString()}
                                            </p>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-start gap-4">
                                                <div className="flex flex-col items-center justify-between mt-1 h-12 py-1">
                                                    <div className="w-3 h-3 bg-[#00A99D] border-2 border-black" />
                                                    <div className="w-3 h-3 bg-rose-500 border-2 border-black" />
                                                </div>
                                                <div className="space-y-6 flex-1">
                                                    <div>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1 italic">PICKUP</p>
                                                        <p className="text-xs font-black text-black uppercase italic line-clamp-1">{booking.pickupLocation.address}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1 italic">DROPOFF</p>
                                                        <p className="text-xs font-black text-black uppercase italic line-clamp-1">{booking.dropoffLocation.address}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-6 flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest italic text-slate-800"><Calendar size={14} strokeWidth={3} /> {booking.scheduledDate}</span>
                                            <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest italic text-slate-800"><Clock size={14} strokeWidth={3} /> {booking.scheduledTime}</span>
                                        </div>
                                        <div className="w-10 h-10 bg-[#006064] border-2 border-black flex items-center justify-center text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-1 group-hover:translate-y-[-1px] transition-all">
                                            <ArrowRight size={20} strokeWidth={3} />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white rounded-none border-8 border-dashed border-slate-200">
                        <div className="w-24 h-24 bg-slate-100 rounded-none border-4 border-black flex items-center justify-center mx-auto mb-8 text-black opacity-20 shadow-[10px_10px_0px_0px_rgba(0,0,0,0.05)]">
                            <Package size={48} strokeWidth={3} />
                        </div>
                        <h3 className="text-3xl font-black text-black uppercase italic tracking-tighter mb-4">NO BOOKINGS FOUND</h3>
                        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mb-10 max-w-sm mx-auto">You haven't made any bookings in this category yet.</p>
                        <Link href="/" className="inline-block bg-[#006064] text-white px-12 py-5 rounded-none font-black text-xs uppercase tracking-[0.3em] italic border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all">
                            Book a Ride Now
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
