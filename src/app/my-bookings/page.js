'use client';
import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Car, ArrowRight, Loader2, User, Package } from 'lucide-react';

export default function MyBookingsPage() {
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === 'unauthenticated') {
            signIn('google', { callbackUrl: '/my-bookings' });
        }
    }, [status]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('upcoming');

    useEffect(() => {
        const fetchBookings = async () => {
            setLoading(true);
            try {
                let url = '/api/bookings';
                const params = new URLSearchParams();
                params.append('personal', 'true');
                let guestIds = [];

                // Get guest bookings from local storage
                try {
                    guestIds = JSON.parse(localStorage.getItem('guest_bookings') || '[]');
                } catch (e) { console.error(e); }

                // Construct query
                if (guestIds.length > 0 && !session) {
                    params.append('ids', guestIds.join(','));
                }
                
                url += `?${params.toString()}`;

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
        <div className="min-h-screen bg-slate-50/50 pt-32 pb-20 px-4 dark:bg-zinc-950">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-black text-black dark:text-white uppercase tracking-tighter leading-none mb-3">
                            My <span className="text-emerald-600">Bookings</span>
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 font-medium tracking-tight text-sm">Manage and track your journeys across the paradise island.</p>
                    </div>
                    {session && (
                        <div className="flex items-center gap-4 bg-white dark:bg-zinc-900 px-6 py-3 rounded-[2rem] border border-slate-100 dark:border-zinc-800 shadow-xl shadow-black/5">
                            <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-black">
                                {session.user.name?.[0].toUpperCase()}
                            </div>
                            <span className="text-xs font-black text-black dark:text-white uppercase tracking-widest">{session.user.name}</span>
                        </div>
                    )}
                </div>

                {/* Tabs - Luxury Pill Style */}
                <div className="flex bg-slate-100 dark:bg-zinc-900 rounded-2xl w-full sm:w-fit mb-12 p-1.5 shadow-inner">
                    <div className="grid grid-cols-2 w-full sm:w-auto gap-1">
                        <button
                            onClick={() => setActiveTab('upcoming')}
                            className={`px-8 py-3 rounded-xl font-black text-[10px] md:text-xs uppercase tracking-widest transition-all duration-500 ${activeTab === 'upcoming' ? 'bg-white dark:bg-zinc-800 text-emerald-600 shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Upcoming ({activeBookings.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`px-8 py-3 rounded-xl font-black text-[10px] md:text-xs uppercase tracking-widest transition-all duration-500 ${activeTab === 'history' ? 'bg-white dark:bg-zinc-800 text-emerald-600 shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            History ({pastBookings.length})
                        </button>
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="py-24 flex justify-center bg-white border-4 border-black shadow-[15px_15px_0px_0px_rgba(0,0,0,1)]"><Loader2 className="animate-spin text-[#006064]" size={48} strokeWidth={3} /></div>
                ) : displayedBookings.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-8">
                        {displayedBookings.map(booking => (
                            <Link key={booking._id} href={`/booking/${booking._id}`} className="block group">
                                <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-6 md:p-8 border border-slate-100 dark:border-zinc-800 hover:border-emerald-600/30 transition-all cursor-pointer h-full flex flex-col justify-between shadow-xl shadow-black/[0.02] hover:shadow-emerald-600/10 hover:-translate-y-1">
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] ${
                                                    booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                                                    booking.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                                                    booking.status === 'cancelled' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'
                                                }`}>
                                                    {booking.status}
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest opacity-60">#{booking._id.slice(-6).toUpperCase()}</span>
                                            </div>
                                            <p className="font-black text-black dark:text-white bg-slate-50 dark:bg-zinc-800 px-4 py-2 rounded-xl border border-slate-100 dark:border-zinc-700 text-sm tracking-tighter">
                                                Rs {booking.totalPrice.toLocaleString()}
                                            </p>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-start gap-4">
                                                <div className="flex flex-col items-center justify-between mt-1 h-12 py-1">
                                                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full ring-4 ring-emerald-50" />
                                                    <div className="w-0.5 h-full bg-slate-100 dark:bg-zinc-800" />
                                                    <div className="w-2.5 h-2.5 bg-rose-500 rounded-full ring-4 ring-rose-50" />
                                                </div>
                                                <div className="space-y-6 flex-1">
                                                    <div>
                                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">PICKUP</p>
                                                        <p className="text-[11px] md:text-xs font-bold text-black dark:text-white uppercase line-clamp-1">{booking.pickupLocation.address}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">DROPOFF</p>
                                                        <p className="text-[11px] md:text-xs font-bold text-black dark:text-white uppercase line-clamp-1">{booking.dropoffLocation.address}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-slate-50 dark:border-zinc-800 flex items-center justify-between">
                                        <div className="flex items-center gap-5">
                                            <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500"><Calendar size={14} className="text-emerald-600" /> {booking.scheduledDate}</span>
                                            <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500"><Clock size={14} className="text-emerald-600" /> {booking.scheduledTime}</span>
                                        </div>
                                        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-600/20 group-hover:scale-110 transition-all">
                                            <ArrowRight size={18} strokeWidth={3} />
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
