'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { Users, Car, MapPin, DollarSign, Activity, Bell, X, Phone, Mail, Calendar, Clock, CreditCard, FileText, Loader2, Percent, CheckSquare, Square, Check, LifeBuoy, Compass, MessageCircle, Copy, Link as LinkIcon, ExternalLink, Plus } from 'lucide-react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { flatRatesList } from '@/data/flatRates'
import ReviewsManagement from '@/components/ReviewsManagement'
import DriversFleetView from '@/components/DriversFleetView'
import LiveDriverMap from '@/components/LiveDriverMap'
import AdminChatManager from '@/components/AdminChatManager'
import PushNotificationManager from '@/components/PushNotificationManager'
import RevenueStats from '@/components/RevenueStats'
import InvoiceManager from '@/components/admin/InvoiceManager'
import DestinationManager from '@/components/admin/DestinationManager'

export default function AdminDashboard() {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === 'loading') return;

        if (!session || session.user.role !== 'admin') {
            router.push('/admin/login');
        }
    }, [session, status, router])

    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [currentView, setCurrentView] = useState('dashboard')
    const [notificationsEnabled, setNotificationsEnabled] = useState(false)
    const prevUnreadCount = useRef(0)
    const [bookings, setBookings] = useState([])
    const [bookingSearch, setBookingSearch] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [vehiclePricing, setVehiclePricing] = useState([])
    const [pricingCategory, setPricingCategory] = useState('airport-transfer')
    const [editingVehicle, setEditingVehicle] = useState(null)
    const [editForm, setEditForm] = useState({})
    const [pricingSettings, setPricingSettings] = useState({ longDistanceThreshold: 175, longDistanceDiscountPercentage: 10, isActive: true })

    // Tours State
    const [tours, setTours] = useState([])
    const [editingTour, setEditingTour] = useState(null)
    const [tourForm, setTourForm] = useState({})
    const [tourCategoryFilter, setTourCategoryFilter] = useState('All')

    const [editingPost, setEditingPost] = useState(null)
    const [postForm, setPostForm] = useState({})
    const [blogPosts, setBlogPosts] = useState([])
    const [editingTeam, setEditingTeam] = useState(null)
    const [teamForm, setTeamForm] = useState({})
    const [teamMembers, setTeamMembers] = useState([])
    const [selectedTicket, setSelectedTicket] = useState(null)
    const [supportTickets, setSupportTickets] = useState([])
    const [coupons, setCoupons] = useState([])
    const [newCoupon, setNewCoupon] = useState({
        code: '',
        discountType: 'percentage',
        value: '',
        expiryDate: '',
        locationsText: '',
        description: '',
        imageUrl: '',
        displayInWidget: true,
        usageLimit: ''
    })
    const [ordering, setOrdering] = useState('newest'); // or whatever
    const [emailForm, setEmailForm] = useState({ recipientType: 'specific', customEmail: '', subject: '', message: '' })
    const [sendingEmail, setSendingEmail] = useState(false)
    const [adminReply, setAdminReply] = useState('')
    const [sendingReply, setSendingReply] = useState(false)
    const [selectedBooking, setSelectedBooking] = useState(null)
    const [selectedStatus, setSelectedStatus] = useState('pending')
    const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('pending')
    const [updatingStatus, setUpdatingStatus] = useState(false)
    const [drivers, setDrivers] = useState([])
    const [selectedDriver, setSelectedDriver] = useState('')
    const [notifications, setNotifications] = useState([])
    const [showNotifications, setShowNotifications] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)

    // Quick Links State
    const [quickLinks, setQuickLinks] = useState([])
    const [newQuickLink, setNewQuickLink] = useState({ title: '', price: '', slug: '', badge: 'Special Offer', allowedPaymentMode: 'both' })
    const [isSavingQuickLink, setIsSavingQuickLink] = useState(false)

    // Manual Booking States
    const [showManualBooking, setShowManualBooking] = useState(false);
    const [manualBookingForm, setManualBookingForm] = useState({
        customerName: '',
        guestPhone: '',
        pickupLocation: { address: '' },
        dropoffLocation: { address: '' },
        scheduledDate: '',
        scheduledTime: '',
        vehicleType: 'sedan',
        distanceKm: '',
        totalPrice: '',
        paymentStatus: 'pending',
        paymentMethod: 'cash',
        type: 'transfer'
    });
    const [isSavingManual, setIsSavingManual] = useState(false);

    // Filter bookings based on search
    const filteredBookings = useMemo(() => {
        if (!bookingSearch.trim()) return bookings
        const search = bookingSearch.toLowerCase()
        return bookings.filter(b => {
            const shortId = b._id?.slice(-6).toLowerCase();
            return (
                b._id?.toLowerCase().includes(search) ||
                shortId?.includes(search) || // Enable search by last 6 chars
                b.customerName?.toLowerCase().includes(search) ||
                b.guestPhone?.includes(search) ||
                b.pickupLocation?.address?.toLowerCase().includes(search) ||
                b.dropoffLocation?.address?.toLowerCase().includes(search)
            )
        })
    }, [bookings, bookingSearch])

    const handleAddCoupon = async () => {
        if (!newCoupon.code || !newCoupon.value) return alert('Please fill in required fields');
        try {
            const payload = {
                ...newCoupon,
                applicableLocations: newCoupon.locationsText ? newCoupon.locationsText.split(',').map(s => s.trim()).filter(Boolean) : []
            };
            const res = await fetch('/api/coupons', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                const data = await res.json();
                setCoupons([data, ...coupons]);
                setNewCoupon({
                    code: '',
                    discountType: 'percentage',
                    value: '',
                    expiryDate: '',
                    locationsText: '',
                    description: '',
                    imageUrl: '',
                    displayInWidget: false,
                    usageLimit: ''
                });
                alert('Coupon created successfully!');
            } else {
                const errorData = await res.json();
                alert('Failed to create coupon: ' + (errorData.error || res.statusText));
            }
        } catch (e) {
            console.error(e);
            alert('An error occurred while creating the coupon.');
        }
    }

    const handleDeleteCoupon = async (id) => {
        if (!confirm('Are you sure you want to delete this coupon?')) return;
        try {
            await fetch(`/api/coupons/${id}`, { method: 'DELETE' });
            setCoupons(coupons.filter(c => c._id !== id));
        } catch (e) { console.error(e); }
    }

    const fetchQuickLinks = async () => {
        try {
            const res = await fetch('/api/admin/quick-links');
            const data = await res.json();
            if (data.success) setQuickLinks(data.data);
        } catch (err) {
            console.error('Failed to fetch quick links', err);
        }
    };

    const handleSaveQuickLink = async () => {
        if (!newQuickLink.title || !newQuickLink.price || !newQuickLink.slug) {
            alert('Please fill in all fields');
            return;
        }
        setIsSavingQuickLink(true);
        try {
            const res = await fetch('/api/admin/quick-links', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newQuickLink)
            });
            const data = await res.json();
            if (data.success) {
                setQuickLinks([data.data, ...quickLinks]);
                setNewQuickLink({ title: '', price: '', slug: '', badge: 'Special Offer', allowedPaymentMode: 'both' });
                alert('Quick Link created!');
            } else {
                alert('Error: ' + data.error);
            }
        } catch (err) {
            alert('Failed to save quick link');
        } finally {
            setIsSavingQuickLink(false);
        }
    };

    const handleDeleteQuickLink = async (id) => {
        if (!confirm('Are you sure you want to delete this link?')) return;
        try {
            const res = await fetch(`/api/admin/quick-links?id=${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                setQuickLinks(quickLinks.filter(l => l._id !== id));
            }
        } catch (err) {
            alert('Failed to delete');
        }
    };

    useEffect(() => {
        const fetchData = () => {
            if (currentView === 'dashboard' || currentView === 'bookings') {
                fetch('/api/bookings')
                    .then(res => {
                        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
                        return res.json()
                    })
                    .then(data => setBookings(data))
                    .catch(err => console.error("Error fetching bookings:", err))
            }

            if (currentView === 'support') {
                setIsLoading(true)
                fetch('/api/tickets')
                    .then(res => res.json())
                    .then(data => {
                        if (data.success && Array.isArray(data.data)) setSupportTickets(data.data)
                        else if (Array.isArray(data)) setSupportTickets(data) // Fallback for old format
                        setIsLoading(false)
                    })
                    .catch(err => {
                        console.error("Error fetching tickets:", err)
                        setIsLoading(false)
                    })
            }

            if (currentView === 'blog') {
                fetch('/api/blog?isAdmin=true')
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) setBlogPosts(data.data);
                    })
                    .catch(err => console.error("Error fetching posts:", err));
            }

            if (currentView === 'pricing') {
                setIsLoading(true)
                // Fetch vehicle pricing
                fetch(`/api/pricing?category=${pricingCategory}`, { cache: 'no-store' })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success && Array.isArray(data.data)) {
                            setVehiclePricing(data.data)
                        } else {
                            setVehiclePricing([])
                        }
                    })
                    .catch(err => console.error(err))

                // Fetch global settings
                fetch('/api/admin/pricing-settings', { cache: 'no-store' })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success && data.data) {
                            setPricingSettings(data.data)
                        }
                        setIsLoading(false)
                    })
                    .catch(err => {
                        console.error(err)
                        setIsLoading(false)
                    })
            }

            if (currentView === 'tours') {
                setIsLoading(true)
                fetch('/api/tours')
                    .then(res => res.json())
                    .then(data => {
                        if (data.success && Array.isArray(data.data)) {
                            setTours(data.data)
                        }
                        setIsLoading(false)
                    })
                    .catch(err => {
                        console.error('Error fetching tours:', err)
                        setIsLoading(false)
                    })
            }

            if (currentView === 'coupons') {
                setIsLoading(true)
                fetch('/api/coupons')
                    .then(res => res.json())
                    .then(data => {
                        if (Array.isArray(data)) setCoupons(data)
                        setIsLoading(false)
                    })
                    .catch(err => {
                        console.error("Error fetching coupons:", err)
                        setIsLoading(false)
                    })
            }

            // Always fetch drivers for assignment
            fetch('/api/drivers')
                .then(res => res.json())
                .then(data => { if (Array.isArray(data)) setDrivers(data) })
                .catch(console.error)

            // Fetch Notifications
            fetch('/api/admin/notifications')
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setNotifications(data.data)
                        // Sound alert logic
                        if (notificationsEnabled && data.unreadCount > prevUnreadCount.current) {
                            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
                            audio.play().catch(e => console.log("Audio play blocked", e));

                            // Also try browser notification if permitted
                            if ("Notification" in window && Notification.permission === "granted") {
                                new Notification("New Admin Activity!", {
                                    body: `You have ${data.unreadCount} unread notifications.`,
                                    icon: '/logo.png'
                                });
                            }
                        }
                        setUnreadCount(data.unreadCount)
                        prevUnreadCount.current = data.unreadCount;
                    }
                })
                .catch(console.error)
        }

        // Initial fetch
        fetchData()
        fetchQuickLinks()

        // Auto-refresh every 45 seconds to keep it fresh but not annoying
        // Only refresh if NO MODALS/EDITING IS ACTIVE
        const interval = setInterval(() => {
            const isEditing = !!editingVehicle || !!editingTour || !!editingPost || !!editingTeam || !!selectedTicket || !!selectedBooking;
            if (!isEditing) {
                fetchData();
            }
        }, 45000)

        return () => clearInterval(interval)
    }, [currentView, pricingCategory, editingVehicle, editingTour, editingPost, editingTeam, selectedTicket, selectedBooking])

    const markNotificationRead = async (id) => {
        try {
            await fetch('/api/admin/notifications', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            })
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n))
            setUnreadCount(prev => Math.max(0, prev - 1))
        } catch (e) { console.error(e) }
    }

    const markAllNotificationsRead = async () => {
        try {
            await fetch('/api/admin/notifications', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ markAllRead: true })
            })
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
            setUnreadCount(0)
        } catch (e) { console.error(e) }
    }

    // Calculate Real Stats
    const stats = useMemo(() => {
        const totalRevenue = bookings
            .filter(b => b.status === 'completed') // Only count completed bookings for revenue
            .reduce((sum, b) => sum + (b.totalPrice || 0), 0)

        const activeRides = bookings.filter(b => b.status === 'ongoing' || b.status === 'assigned' || b.status === 'driver-assigned').length
        const pendingBookings = bookings.filter(b => b.status === 'pending').length
        const onlineDrivers = drivers.filter(d => d.isOnline).length

        return [
            { title: 'Total Revenue', value: `LKR ${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-500' },
            { title: 'Active Rides', value: activeRides.toString(), icon: Car, color: 'text-blue-500' },
            { title: 'Online Drivers', value: onlineDrivers.toString(), icon: Users, color: 'text-emerald-600' },
            { title: 'Pending Bookings', value: pendingBookings.toString(), icon: Bell, color: 'text-red-500' },
        ]
    }, [bookings, drivers])

    const formatPrice = (booking) => {
        if (!booking) return 'N/A';
        const currency = booking.currency || 'LKR';
        if (currency === 'LKR') {
            const amount = booking.totalPrice || 0;
            return `Rs ${amount.toLocaleString()}`;
        } else {
            const amount = booking.displayPrice || 0;
            const prefix = currency === 'USD' ? '$' : currency + ' ';
            return `${prefix}${amount.toLocaleString()}`;
        }
    };

    const updateBookingStatus = async (id, status) => {
        try {
            const res = await fetch(`/api/bookings/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            })
            if (res.ok) {
                setBookings(prev => prev.map(b => b._id === id ? { ...b, status } : b))
            } else {
                alert('Failed to update status')
            }
        } catch (err) {
            console.error(err)
            alert('Error updating status')
        }
    }

    return (
        <div className="flex h-screen bg-gradient-to-br from-slate-100 to-slate-200">
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar - Premium Gradient Design */}
            <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static inset-y-0 left-0 z-50 bg-gradient-to-b from-emerald-900 via-emerald-950 to-slate-900 text-white transition-all duration-300 ${sidebarOpen && 'md:w-64'} ${!sidebarOpen && 'md:w-20'} w-64 flex flex-col shadow-2xl`}>
                <button
                    onClick={() => setSidebarOpen(false)}
                    className="md:hidden absolute top-4 right-4 text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-all"
                >
                    <X size={20} />
                </button>
                {/* Logo Area with Glass Effect */}
                <div className="p-5 flex items-center gap-3 border-b border-white/10 bg-white/5 backdrop-blur-sm">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                        <Car size={20} className="text-white" />
                    </div>
                    <div className={`${!sidebarOpen && 'md:hidden'}`}>
                        <h1 className="font-bold text-lg leading-tight">Admin Panel</h1>
                        <p className="text-[10px] text-emerald-300/70 uppercase tracking-widest">Control Center</p>
                    </div>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                    <button onClick={() => { setCurrentView('dashboard'); setSidebarOpen(false); }} className={`flex items-center gap-3 p-3 w-full rounded-xl transition-all duration-200 ${currentView === 'dashboard' ? 'bg-white text-emerald-900 shadow-lg shadow-white/20 font-bold' : 'hover:bg-white/10 text-white/80 hover:text-white'}`}>
                        <Activity size={20} />
                        <span className={`${!sidebarOpen && 'md:hidden'}`}>Dashboard</span>
                    </button>
                    <button onClick={() => { setCurrentView('pricing'); setSidebarOpen(false); }} className={`flex items-center gap-3 p-3 w-full rounded-xl transition-all duration-200 ${currentView === 'pricing' ? 'bg-white text-emerald-900 shadow-lg shadow-white/20 font-bold' : 'hover:bg-white/10 text-white/80 hover:text-white'}`}>
                        <DollarSign size={20} />
                        <span className={`${!sidebarOpen && 'md:hidden'}`}>Pricing</span>
                    </button>
                    <button onClick={() => { setCurrentView('revenue'); setSidebarOpen(false); }} className={`flex items-center gap-3 p-3 w-full rounded-xl transition-all duration-200 ${currentView === 'revenue' ? 'bg-white text-emerald-900 shadow-lg shadow-white/20 font-bold' : 'hover:bg-white/10 text-white/80 hover:text-white'}`}>
                        <DollarSign size={20} />
                        <span className={`${!sidebarOpen && 'md:hidden'}`}>Revenue</span>
                    </button>
                    <button onClick={() => { setCurrentView('rates'); setSidebarOpen(false); }} className={`flex items-center gap-3 p-3 w-full rounded-xl transition-all duration-200 ${currentView === 'rates' ? 'bg-white text-emerald-900 shadow-lg shadow-white/20 font-bold' : 'hover:bg-white/10 text-white/80 hover:text-white'}`}>
                        <MapPin size={20} />
                        <span className={`${!sidebarOpen && 'md:hidden'}`}>Destination Rates</span>
                    </button>
                    <button onClick={() => { setCurrentView('chat'); setSidebarOpen(false); }} className={`relative flex items-center gap-3 p-3 w-full rounded-xl transition-all duration-200 ${currentView === 'chat' ? 'bg-white text-emerald-900 shadow-lg shadow-white/20 font-bold' : 'hover:bg-white/10 text-white/80 hover:text-white'}`}>
                        <MessageCircle size={20} />
                        <span className={`${!sidebarOpen && 'md:hidden'}`}>Live Chat</span>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                    </button>
                    <button onClick={() => { setCurrentView('tours'); setSidebarOpen(false); }} className={`flex items-center gap-3 p-3 w-full rounded-xl transition-all duration-200 ${currentView === 'tours' ? 'bg-white text-emerald-900 shadow-lg shadow-white/20 font-bold' : 'hover:bg-white/10 text-white/80 hover:text-white'}`}>
                        <Compass size={20} />
                        <span className={`${!sidebarOpen && 'md:hidden'}`}>Tour Packages</span>
                    </button>
                    <button onClick={() => {
                        setCurrentView('bookings');
                        setSidebarOpen(false);
                        setUnreadCount(0); // Clear badge when viewing bookings
                    }} className={`flex items-center gap-3 p-3 w-full rounded-xl transition-all duration-200 relative ${currentView === 'bookings' ? 'bg-white text-emerald-900 shadow-lg shadow-white/20 font-bold' : 'hover:bg-white/10 text-white/80 hover:text-white'}`}>
                        <Users size={20} />
                        <span className={`${!sidebarOpen && 'md:hidden'}`}>Bookings</span>
                        {unreadCount > 0 && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                                {unreadCount}
                            </span>
                        )}
                    </button>
                    <button onClick={() => { setCurrentView('drivers'); setSidebarOpen(false); }} className={`flex items-center gap-3 p-3 w-full rounded-xl transition-all duration-200 ${currentView === 'drivers' ? 'bg-white text-emerald-900 shadow-lg shadow-white/20 font-bold' : 'hover:bg-white/10 text-white/80 hover:text-white'}`}>
                        <Car size={20} />
                        <span className={`${!sidebarOpen && 'md:hidden'}`}>Drivers</span>
                    </button>
                    <button onClick={() => { setCurrentView('live-map'); setSidebarOpen(false); }} className={`flex items-center gap-3 p-3 w-full rounded-xl transition-all duration-200 ${currentView === 'live-map' ? 'bg-white text-emerald-900 shadow-lg shadow-white/20 font-bold' : 'hover:bg-white/10 text-white/80 hover:text-white'}`}>
                        <MapPin size={20} />
                        <span className={`${!sidebarOpen && 'md:hidden'}`}>Live Map</span>
                    </button>
                    <button onClick={() => { setCurrentView('blog'); setSidebarOpen(false); }} className={`flex items-center gap-3 p-3 w-full rounded-xl transition-all duration-200 ${currentView === 'blog' ? 'bg-white text-emerald-900 shadow-lg shadow-white/20 font-bold' : 'hover:bg-white/10 text-white/80 hover:text-white'}`}>
                        <FileText size={20} />
                        <span className={`${!sidebarOpen && 'md:hidden'}`}>Blog</span>
                    </button>
                    <button onClick={() => { setCurrentView('team'); setSidebarOpen(false); }} className={`flex items-center gap-3 p-3 w-full rounded-xl transition-all duration-200 ${currentView === 'team' ? 'bg-white text-emerald-900 shadow-lg shadow-white/20 font-bold' : 'hover:bg-white/10 text-white/80 hover:text-white'}`}>
                        <Users size={20} />
                        <span className={`${!sidebarOpen && 'md:hidden'}`}>Team</span>
                    </button>
                    <button onClick={() => { setCurrentView('communications'); setSidebarOpen(false); }} className={`flex items-center gap-3 p-3 w-full rounded-xl transition-all duration-200 ${currentView === 'communications' ? 'bg-white text-emerald-900 shadow-lg shadow-white/20 font-bold' : 'hover:bg-white/10 text-white/80 hover:text-white'}`}>
                        <Mail size={20} />
                        <span className={`${!sidebarOpen && 'md:hidden'}`}>Email</span>
                    </button>
                    <button onClick={() => { setCurrentView('support'); setSidebarOpen(false); }} className={`flex items-center gap-3 p-3 w-full rounded-xl transition-all duration-200 ${currentView === 'support' ? 'bg-white text-emerald-900 shadow-lg shadow-white/20 font-bold' : 'hover:bg-white/10 text-white/80 hover:text-white'}`}>
                        <LifeBuoy size={20} />
                        <span className={`${!sidebarOpen && 'md:hidden'}`}>Support</span>
                    </button>
                    <button onClick={() => { setCurrentView('coupons'); setSidebarOpen(false); }} className={`flex items-center gap-3 p-3 w-full rounded-xl transition-all duration-200 ${currentView === 'coupons' ? 'bg-white text-emerald-900 shadow-lg shadow-white/20 font-bold' : 'hover:bg-white/10 text-white/80 hover:text-white'}`}>
                        <Percent size={20} />
                        <span className={`${!sidebarOpen && 'md:hidden'}`}>Coupons</span>
                    </button>
                    <button onClick={() => { setCurrentView('reviews'); setSidebarOpen(false); }} className={`flex items-center gap-3 p-3 w-full rounded-xl transition-all duration-200 ${currentView === 'reviews' ? 'bg-white text-emerald-900 shadow-lg shadow-white/20 font-bold' : 'hover:bg-white/10 text-white/80 hover:text-white'}`}>
                        <Activity size={20} />
                        <span className={`${!sidebarOpen && 'md:hidden'}`}>Reviews</span>
                    </button>
                    <button onClick={() => { setCurrentView('invoices'); setSidebarOpen(false); }} className={`flex items-center gap-3 p-3 w-full rounded-xl transition-all duration-200 ${currentView === 'invoices' ? 'bg-white text-emerald-900 shadow-lg shadow-white/20 font-bold' : 'hover:bg-white/10 text-white/80 hover:text-white'}`}>
                        <FileText size={20} />
                        <span className={`${!sidebarOpen && 'md:hidden'}`}>Invoices</span>
                    </button>
                </nav>

                <div className="p-3 border-t border-white/10">
                    <button onClick={() => signOut({ callbackUrl: '/admin/login' })} className="flex items-center gap-3 p-3 w-full hover:bg-red-500/20 rounded-xl transition-all text-red-300 hover:text-red-100">
                        <X size={20} />
                        <span className={`${!sidebarOpen && 'md:hidden'}`}>Log Out</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                {/* Premium Header */}
                <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 px-6 py-4 flex justify-between items-center sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-600">
                            <Activity size={20} />
                        </button>
                        <div className="flex-1 min-w-0">
                            <h2 className="font-bold text-slate-800 capitalize truncate">{currentView}</h2>
                            <p className="text-[10px] text-slate-400 truncate">Manage your business</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <PushNotificationManager />
                        <button
                            onClick={() => {
                                if ("Notification" in window) {
                                    Notification.requestPermission().then(permission => {
                                        if (permission === "granted") {
                                            setNotificationsEnabled(!notificationsEnabled);
                                        } else {
                                            alert("Please allow notifications in your browser settings.");
                                        }
                                    });
                                } else {
                                    setNotificationsEnabled(!notificationsEnabled);
                                }
                            }}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${notificationsEnabled ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}
                        >
                            <div className={`w-1.5 h-1.5 rounded-full ${notificationsEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></div>
                            Alerts: {notificationsEnabled ? 'ON' : 'OFF'}
                        </button>
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-600 relative"
                            >
                                <Bell size={20} />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* Notifications Dropdown */}
                            {showNotifications && (
                                <div className="absolute top-12 right-0 w-80 bg-white rounded-xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-fade-in-up">
                                    <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                        <h3 className="font-bold text-sm text-slate-700">Notifications</h3>
                                        <button onClick={markAllNotificationsRead} className="text-xs text-emerald-600 hover:underline">Mark all read</button>
                                    </div>
                                    <div className="max-h-80 overflow-y-auto">
                                        {notifications.length === 0 ? (
                                            <div className="p-8 text-center text-gray-400 text-sm">No notifications</div>
                                        ) : (
                                            notifications.map(notification => (
                                                <div
                                                    key={notification._id}
                                                    onClick={() => !notification.isRead && markNotificationRead(notification._id)}
                                                    className={`p-3 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer ${!notification.isRead ? 'bg-emerald-50/50' : ''}`}
                                                >
                                                    <div className="flex gap-3">
                                                        <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${!notification.isRead ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                                                        <div>
                                                            <p className={`text-sm ${!notification.isRead ? 'font-semibold text-slate-800' : 'text-slate-600'}`}>{notification.title}</p>
                                                            <p className="text-xs text-slate-500 mt-1">{notification.message}</p>
                                                            <p className="text-[10px] text-slate-400 mt-2">{new Date(notification.createdAt).toLocaleString()}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="w-10 h-10 overflow-hidden bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/30">
                            {session?.user?.image ? (
                                <img src={session.user.image} alt="Admin" className="w-full h-full object-cover" />
                            ) : (
                                <span>{session?.user?.name?.charAt(0) || 'A'}</span>
                            )}
                        </div>
                    </div>
                </header>

                <div className="p-6">
                    {currentView === 'revenue' && (
                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-3xl font-bold text-slate-800">Finance & Analytics</h2>
                                    <p className="text-slate-500 mt-1">Detailed breakdown of income, fuel costs, and net profit.</p>
                                </div>
                            </div>
                            <RevenueStats bookings={bookings} />
                        </div>
                    )}
                    {currentView === 'dashboard' && (
                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-3xl font-bold text-slate-800">Dashboard Overview</h2>
                                    <p className="text-slate-500 mt-1">Welcome back! Here's what's happening today.</p>
                                </div>
                                <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/30 flex items-center gap-2">
                                    <Activity size={16} />
                                    Refresh
                                </button>
                            </div>

                            {/* Premium Stats Cards */}
                            <RevenueStats bookings={bookings} />

                            {/* Stats are now exclusively handled by RevenueStats to ensure verified data */}

                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                                <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-slate-800">Recent Bookings</h3>
                                    <button onClick={() => setCurrentView('bookings')} className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                                        View All →
                                    </button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gradient-to-r from-slate-50 to-slate-100 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                                <th className="px-6 py-4">ID</th>
                                                <th className="px-6 py-4">Customer</th>
                                                <th className="px-6 py-4">Route</th>
                                                <th className="px-6 py-4">Date</th>
                                                <th className="px-6 py-4">Price</th>
                                                <th className="px-6 py-4">Payment</th>
                                                <th className="px-6 py-4">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {bookings.length === 0 ? (
                                                <tr>
                                                    <td colSpan="7" className="py-8 text-center text-gray-400">No bookings yet.</td>
                                                </tr>
                                            ) : (
                                                bookings.slice(0, 5).map((booking) => (
                                                    <tr key={booking._id} className="border-b last:border-0 hover:bg-slate-50 transition-colors">
                                                        <td className="py-4 font-medium text-emerald-900">#{booking._id.slice(-6)}</td>
                                                        <td className="py-4">
                                                            <div className="font-medium">{booking.customerName || 'Guest'}</div>
                                                            <div className="text-xs text-gray-400">{booking.guestPhone}</div>
                                                        </td>
                                                        <td className="py-4 text-slate-500">
                                                            <div className="max-w-[120px] truncate text-xs" title={booking.pickupLocation?.address}>{booking.pickupLocation?.address?.split(',')[0]}</div>
                                                            <div className="text-xs text-gray-300">→</div>
                                                            <div className="max-w-[120px] truncate text-xs" title={booking.dropoffLocation?.address}>{booking.dropoffLocation?.address?.split(',')[0]}</div>
                                                        </td>
                                                        <td className="py-4 text-xs">
                                                            <div>{booking.scheduledDate || new Date(booking.createdAt).toLocaleDateString()}</div>
                                                            <div className="text-gray-400">{booking.scheduledTime || ''}</div>
                                                        </td>
                                                        <td className="py-4 font-bold text-sm">{formatPrice(booking)}</td>
                                                        <td className="py-4">
                                                            <span className={`px-2 py-1 rounded text-xs font-bold capitalize
                                                                ${booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                                                                    booking.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' :
                                                                        'bg-yellow-100 text-yellow-800'
                                                                }`}>
                                                                {booking.paymentStatus || 'pending'}
                                                            </span>
                                                            <div className="text-xs text-gray-400 mt-1 capitalize">{booking.paymentMethod}</div>
                                                        </td>
                                                        <td className="py-4">
                                                            <span className={`px-2 py-1 rounded text-xs font-bold capitalize
                                                                ${booking.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                                                                    booking.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                                                                        booking.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100'
                                                                }`}>
                                                                {booking.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}



                    {currentView === 'chat' && (
                        <div className="animate-fade-in-up">
                            <AdminChatManager />
                        </div>
                    )}

                    {currentView === 'invoices' && (
                        <div className="animate-fade-in-up">
                            <InvoiceManager />
                        </div>
                    )}

                    {currentView === 'rates' && (
                        <div className="animate-fade-in-up">
                            <DestinationManager />
                        </div>
                    )}

                    {currentView === 'pricing' && (
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                    <h2 className="text-2xl font-bold text-emerald-900">Vehicle Pricing & Tiers</h2>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => {
                                                setEditForm({})
                                                setEditingVehicle('NEW')
                                            }}
                                            className="bg-emerald-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-emerald-900/90 text-sm flex items-center gap-2 shadow-lg shadow-emerald-900/20 transition-all hover:scale-105"
                                        >
                                            <Car size={16} /> Add New Vehicle
                                        </button>
                                        <button
                                            onClick={async () => {
                                                if (!confirm('This will RESET ALL pricing for ALL vehicles to the system DEFAULTS. Are you sure?')) return;
                                                setIsLoading(true);
                                                const res = await fetch('/api/admin/sync-pricing', { method: 'POST' });
                                                const data = await res.json();
                                                if (data.success) {
                                                    alert(data.message);
                                                    fetchData(); // Refresh current view
                                                } else {
                                                    alert(data.error || 'Sync failed');
                                                }
                                                setIsLoading(false);
                                            }}
                                            className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200"
                                        >
                                            Reset to Default
                                        </button>
                                    </div>
                                </div>

                                {/* Global Discount Configuration */}
                                <div className="bg-emerald-50 rounded-xl p-6 mb-6 border border-emerald-900/10">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold text-emerald-900 flex items-center gap-2">
                                            <Percent size={18} /> Global Long-Distance Discount
                                        </h3>
                                        <button
                                            onClick={async () => {
                                                const res = await fetch('/api/admin/pricing-settings', {
                                                    method: 'PUT',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify(pricingSettings)
                                                });
                                                const data = await res.json();
                                                if (data.success) alert('Settings saved successfully!');
                                                else alert('Failed to save settings.');
                                            }}
                                            className="text-xs bg-emerald-900 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-900/90 font-bold shadow-md shadow-emerald-900/10 transition-all hover:scale-105"
                                        >
                                            Save Configuration
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold text-emerald-900 uppercase tracking-wider mb-1">
                                                Distance Threshold (km)
                                            </label>
                                            <input
                                                type="number"
                                                value={pricingSettings.longDistanceThreshold}
                                                onChange={e => setPricingSettings({ ...pricingSettings, longDistanceThreshold: Number(e.target.value) })}
                                                className="w-full bg-white border border-emerald-900/10 rounded-lg px-3 py-2 text-sm font-bold text-emerald-900 outline-none focus:ring-2 focus:ring-emerald-500/20"
                                            />
                                            <p className="text-[10px] text-emerald-900/60 mt-1">Minimum distance to automatically trigger discount.</p>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-emerald-900 uppercase tracking-wider mb-1">
                                                Discount Percentage (%)
                                            </label>
                                            <input
                                                type="number"
                                                value={pricingSettings.longDistanceDiscountPercentage}
                                                onChange={e => setPricingSettings({ ...pricingSettings, longDistanceDiscountPercentage: Number(e.target.value) })}
                                                className="w-full bg-white border border-emerald-900/10 rounded-lg px-3 py-2 text-sm font-bold text-emerald-900 outline-none focus:ring-2 focus:ring-emerald-500/20"
                                            />
                                            <p className="text-[10px] text-emerald-900/60 mt-1">Percentage deducted from the total fare.</p>
                                        </div>
                                        <div className="flex items-center pt-4">
                                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                                <input
                                                    type="checkbox"
                                                    checked={pricingSettings.isActive}
                                                    onChange={e => setPricingSettings({ ...pricingSettings, isActive: e.target.checked })}
                                                    className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 border-gray-300 cursor-pointer"
                                                />
                                                <span className="text-sm font-medium text-emerald-900">Enable Automated Discount</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Category Tabs */}
                                <div className="flex bg-slate-100 p-1 rounded-xl mb-6 w-fit">
                                    {[
                                        { id: 'airport-transfer', label: 'Airport Transfer' },
                                        { id: 'ride-now', label: 'Ride Now / P2P' },
                                        { id: 'tours', label: 'Tour Packages' }
                                    ].map(cat => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setPricingCategory(cat.id)}
                                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${pricingCategory === cat.id ? 'bg-emerald-900 text-white shadow-sm' : 'text-gray-500 hover:text-emerald-900'}`}
                                        >
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>

                                {editingVehicle === 'NEW' && (
                                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-in-up">
                                            <h3 className="text-xl font-bold text-emerald-900 mb-4">Add New Vehicle</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Name</label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. Luxury Sedan"
                                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-600/20 focus:border-transparent outline-none transition-all"
                                                        value={editForm.name || ''}
                                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Code (Type)</label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. luxury-sedan"
                                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-600/20 focus:border-transparent outline-none transition-all"
                                                        value={editForm.vehicleType || ''}
                                                        onChange={(e) => setEditForm({ ...editForm, vehicleType: e.target.value })}
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                                                        <input
                                                            type="text"
                                                            placeholder="e.g. 3"
                                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-600/20 focus:border-transparent outline-none transition-all"
                                                            value={editForm.capacity || ''}
                                                            onChange={(e) => setEditForm({ ...editForm, capacity: Number(e.target.value) })}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Luggage</label>
                                                        <input
                                                            type="text"
                                                            placeholder="e.g. 2"
                                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-600/20 focus:border-transparent outline-none transition-all"
                                                            value={editForm.luggage || ''}
                                                            onChange={(e) => setEditForm({ ...editForm, luggage: Number(e.target.value) })}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="pt-4 flex justify-end gap-3">
                                                    <button
                                                        onClick={() => setEditingVehicle(null)}
                                                        className="px-4 py-2 text-gray-600 hover:bg-slate-100 rounded-lg"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={async () => {
                                                            if (!editForm.name || !editForm.vehicleType) return alert('Name and Type are required');
                                                            const res = await fetch('/api/pricing', {
                                                                method: 'POST',
                                                                headers: { 'Content-Type': 'application/json' },
                                                                body: JSON.stringify({
                                                                    ...editForm,
                                                                    category: pricingCategory,
                                                                    tiers: [{ min: 0, max: 999, type: 'per_km', price: 0, rate: 100 }], // Default tier
                                                                    features: ['Air Conditioned'],
                                                                    basePrice: 0, // Required by model
                                                                    perKmRate: 0   // Required by model
                                                                })
                                                            });
                                                            const data = await res.json();
                                                            if (data.success) {
                                                                setVehiclePricing([...vehiclePricing, data.data]);
                                                                setEditingVehicle(null);
                                                            } else {
                                                                alert(data.error || 'Failed to create');
                                                            }
                                                        }}
                                                        className="px-6 py-2 bg-emerald-900 text-white rounded-lg font-bold hover:bg-emerald-900/90"
                                                    >
                                                        Create {pricingCategory.replace('-', ' ')} Rate
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {isLoading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-900"></div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {vehiclePricing.map((vehicle) => (
                                            <div
                                                key={vehicle._id || vehicle.vehicleType}
                                                className="border-2 rounded-xl p-6 hover:border-emerald-900/20 transition-all"
                                            >
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-20 h-14 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center">
                                                            <img
                                                                src={vehicle.image || '/vehicles/placeholder.png'}
                                                                alt={vehicle.name}
                                                                className="w-full h-full object-contain"
                                                                onError={(e) => { e.target.src = '/vehicles/placeholder.png' }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-emerald-900 text-lg">{vehicle.name}</h3>
                                                            {pricingCategory === 'tours' ? (
                                                                <p className="text-xs text-gray-400">Tour Package Rate</p>
                                                            ) : (
                                                                <p className="text-xs text-gray-400">1-{vehicle.capacity} pax • {vehicle.luggage} bags • {vehicle.vehicleType}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            if (editingVehicle === vehicle.vehicleType) {
                                                                setEditingVehicle(null)
                                                            } else {
                                                                setEditingVehicle(vehicle.vehicleType)
                                                                setEditForm({
                                                                    _id: vehicle._id,
                                                                    name: vehicle.name,
                                                                    capacity: vehicle.capacity,
                                                                    luggage: vehicle.luggage,
                                                                    waitingCharges: vehicle.waitingCharges || [],
                                                                    tiers: vehicle.tiers || [],
                                                                    features: vehicle.features || [],
                                                                    basePrice: vehicle.basePrice,
                                                                    baseKm: vehicle.baseKm,
                                                                    perKmRate: vehicle.perKmRate
                                                                })
                                                            }
                                                        }}
                                                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${editingVehicle === vehicle.vehicleType ? 'bg-red-100 text-red-600' : 'bg-emerald-600 text-emerald-900 hover:bg-emerald-600/80'}`}
                                                    >
                                                        {editingVehicle === vehicle.vehicleType ? 'Cancel' : 'Edit Rates'}
                                                    </button>
                                                    <button
                                                        onClick={async () => {
                                                            if (confirm('Are you sure you want to delete this vehicle?')) {
                                                                const res = await fetch(`/api/pricing?id=${vehicle._id}`, { method: 'DELETE' });
                                                                if (res.ok) {
                                                                    setVehiclePricing(prev => prev.filter(v => v._id !== vehicle._id));
                                                                    alert('Deleted successfully');
                                                                } else {
                                                                    alert('Failed to delete');
                                                                }
                                                            }
                                                        }}
                                                        className="px-2 py-2 text-red-500 hover:bg-red-50 rounded-lg"
                                                        title="Delete Vehicle"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </div>

                                                {/* Tier Table */}
                                                {editingVehicle === vehicle.vehicleType ? (
                                                    <div className="space-y-4">
                                                        {/* Image Upload */}
                                                        <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                                                            <span className="text-sm text-gray-500">Vehicle Image:</span>
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={async (e) => {
                                                                    const file = e.target.files[0]
                                                                    if (file) {
                                                                        const formData = new FormData()
                                                                        formData.append('file', file)
                                                                        formData.append('folder', 'vehicles')
                                                                        const res = await fetch('/api/upload', { method: 'POST', body: formData })
                                                                        const data = await res.json()
                                                                        if (data.url) {
                                                                            await fetch(`/api/pricing`, {
                                                                                method: 'PUT',
                                                                                headers: { 'Content-Type': 'application/json' },
                                                                                body: JSON.stringify({ _id: vehicle._id, image: data.url })
                                                                            })
                                                                            setVehiclePricing(prev => prev.map(v => v._id === vehicle._id ? { ...v, image: data.url } : v))
                                                                        }
                                                                    }
                                                                }}
                                                                className="text-sm"
                                                            />
                                                        </div>

                                                        <div className="border rounded-xl overflow-hidden mb-6">
                                                            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                                                                <h4 className="font-bold text-emerald-900">Configured Pricing Tiers</h4>
                                                                <button
                                                                    onClick={() => {
                                                                        const newTiers = [...(editForm.tiers || [])];
                                                                        newTiers.push({ min: 0, max: 0, type: 'per_km', price: 0, rate: 0 });
                                                                        setEditForm({ ...editForm, tiers: newTiers });
                                                                    }}
                                                                    className="text-xs bg-emerald-900 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-900/90 font-bold shadow-md shadow-emerald-900/10 transition-all hover:scale-105"
                                                                >
                                                                    + Add New Tier
                                                                </button>
                                                            </div>
                                                            {/* Editable Tiers - Improved Layout */}
                                                            <div className="overflow-x-auto border border-slate-200 rounded-lg">
                                                                <table className="w-full text-sm">
                                                                    <thead className="bg-slate-50">
                                                                        <tr>
                                                                            <th className="px-4 py-3 text-left font-semibold text-emerald-900 w-24">Min KM</th>
                                                                            <th className="px-4 py-3 text-left font-semibold text-emerald-900 w-24">Max KM</th>
                                                                            <th className="px-4 py-3 text-left font-semibold text-emerald-900 w-32">Type</th>
                                                                            <th className="px-4 py-3 text-left font-semibold text-emerald-900 w-32">Flat (Rs)</th>
                                                                            <th className="px-4 py-3 text-left font-semibold text-emerald-900 w-32">Rate (Rs/km)</th>
                                                                            <th className="px-4 py-3 w-10"></th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className="divide-y divide-slate-100">
                                                                        {(editForm.tiers || []).map((tier, idx) => (
                                                                            <tr key={idx} className="hover:bg-slate-50">
                                                                                <td className="px-2 py-2">
                                                                                    <input type="number" value={tier.min} onChange={(e) => {
                                                                                        const newTiers = [...editForm.tiers]
                                                                                        newTiers[idx] = { ...newTiers[idx], min: Number(e.target.value) }
                                                                                        setEditForm({ ...editForm, tiers: newTiers })
                                                                                    }} className="w-full px-2 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-600 outline-none text-center" />
                                                                                </td>
                                                                                <td className="px-2 py-2">
                                                                                    <input type="number" value={tier.max} onChange={(e) => {
                                                                                        const newTiers = [...editForm.tiers]
                                                                                        newTiers[idx] = { ...newTiers[idx], max: Number(e.target.value) }
                                                                                        setEditForm({ ...editForm, tiers: newTiers })
                                                                                    }} className="w-full px-2 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-600 outline-none text-center" />
                                                                                </td>
                                                                                <td className="px-2 py-2">
                                                                                    <select value={tier.type} onChange={(e) => {
                                                                                        const newTiers = [...editForm.tiers]
                                                                                        newTiers[idx] = { ...newTiers[idx], type: e.target.value }
                                                                                        setEditForm({ ...editForm, tiers: newTiers })
                                                                                    }} className="w-full px-2 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-600 outline-none bg-white">
                                                                                        <option value="flat">Flat</option>
                                                                                        <option value="per_km">Per KM</option>
                                                                                    </select>
                                                                                </td>
                                                                                <td className="px-2 py-2">
                                                                                    <input type="number" value={tier.price || 0} onChange={(e) => {
                                                                                        const newTiers = [...editForm.tiers]
                                                                                        newTiers[idx] = { ...newTiers[idx], price: Number(e.target.value) }
                                                                                        setEditForm({ ...editForm, tiers: newTiers })
                                                                                    }} className="w-full px-2 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-600 outline-none disabled:opacity-50 disabled:bg-slate-100 text-right" disabled={tier.type !== 'flat'} />
                                                                                </td>
                                                                                <td className="px-2 py-2">
                                                                                    <input type="number" value={tier.rate || 0} onChange={(e) => {
                                                                                        const newTiers = [...editForm.tiers]
                                                                                        newTiers[idx] = { ...newTiers[idx], rate: Number(e.target.value) }
                                                                                        setEditForm({ ...editForm, tiers: newTiers })
                                                                                    }} className="w-full px-2 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-600 outline-none disabled:opacity-50 disabled:bg-slate-100 text-right" disabled={tier.type !== 'per_km'} />
                                                                                </td>
                                                                                <td className="px-2 py-2 text-center">
                                                                                    <button onClick={() => {
                                                                                        const newTiers = editForm.tiers.filter((_, i) => i !== idx)
                                                                                        setEditForm({ ...editForm, tiers: newTiers })
                                                                                    }} className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"><X size={16} /></button>
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>

                                                        {/* Waiting Charges Management */}
                                                        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-900/10 space-y-4">
                                                            <div className="flex items-center justify-between">
                                                                <h4 className="text-sm font-bold text-emerald-900 uppercase tracking-widest flex items-center gap-2">
                                                                    <Clock size={16} /> Tiered Waiting Charges
                                                                </h4>
                                                                <button
                                                                    onClick={() => {
                                                                        const current = editForm.waitingCharges || []
                                                                        setEditForm({ ...editForm, waitingCharges: [...current, 1000] })
                                                                    }}
                                                                    className="text-[10px] bg-white border border-emerald-900/10 px-3 py-1 rounded-lg font-bold text-emerald-900 hover:bg-emerald-100 transition-colors"
                                                                >
                                                                    + Add Hour
                                                                </button>
                                                            </div>
                                                            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                                                                {(editForm.waitingCharges || []).map((charge, idx) => (
                                                                    <div key={idx} className="bg-white p-2 rounded-lg border border-emerald-900/10 relative group">
                                                                        <label className="block text-[8px] font-bold text-emerald-900/40 uppercase mb-1">{idx + 1} Hour{idx > 0 && 's'}</label>
                                                                        <div className="flex items-center gap-1">
                                                                            <span className="text-[10px] font-bold text-emerald-900">Rs</span>
                                                                            <input
                                                                                type="number"
                                                                                value={charge}
                                                                                onChange={(e) => {
                                                                                    const newCharges = [...editForm.waitingCharges]
                                                                                    newCharges[idx] = Number(e.target.value)
                                                                                    setEditForm({ ...editForm, waitingCharges: newCharges })
                                                                                }}
                                                                                className="w-full bg-transparent outline-none font-bold text-xs text-emerald-900"
                                                                            />
                                                                        </div>
                                                                        <button
                                                                            onClick={() => {
                                                                                const newCharges = editForm.waitingCharges.filter((_, i) => i !== idx)
                                                                                setEditForm({ ...editForm, waitingCharges: newCharges })
                                                                            }}
                                                                            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                                        >
                                                                            <X size={10} />
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            {(!editForm.waitingCharges || editForm.waitingCharges.length === 0) && (
                                                                <p className="text-[10px] text-emerald-900/40 italic">No custom waiting charges defined. Will use default hourly rate.</p>
                                                            )}
                                                        </div>

                                                        {/* Features Management */}
                                                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-900/10 space-y-4">
                                                            <div className="flex items-center justify-between">
                                                                <h4 className="text-sm font-bold text-blue-900 uppercase tracking-widest flex items-center gap-2">
                                                                    <FileText size={16} /> Key Features / Details
                                                                </h4>
                                                                <button
                                                                    onClick={() => {
                                                                        const current = editForm.features || []
                                                                        setEditForm({ ...editForm, features: [...current, 'New Feature'] })
                                                                    }}
                                                                    className="text-[10px] bg-white border border-blue-900/10 px-3 py-1 rounded-lg font-bold text-blue-900 hover:bg-blue-100 transition-colors"
                                                                >
                                                                    + Add Feature
                                                                </button>
                                                            </div>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                                {(editForm.features || []).map((feature, idx) => (
                                                                    <div key={idx} className="flex gap-2">
                                                                        <input
                                                                            type="text"
                                                                            value={feature}
                                                                            onChange={(e) => {
                                                                                const newFeatures = [...editForm.features]
                                                                                newFeatures[idx] = e.target.value
                                                                                setEditForm({ ...editForm, features: newFeatures })
                                                                            }}
                                                                            className="w-full bg-white border border-blue-900/10 px-3 py-1.5 rounded-lg outline-none text-xs text-blue-900"
                                                                        />
                                                                        <button
                                                                            onClick={() => {
                                                                                const newFeatures = editForm.features.filter((_, i) => i !== idx)
                                                                                setEditForm({ ...editForm, features: newFeatures })
                                                                            }}
                                                                            className="p-1 text-red-500 hover:bg-red-50 rounded"
                                                                        >
                                                                            <X size={14} />
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <div className="flex gap-2 pt-2">
                                                            <button
                                                                onClick={() => {
                                                                    const lastTier = editForm.tiers[editForm.tiers.length - 1]
                                                                    const newMin = lastTier ? lastTier.max + 1 : 1
                                                                    setEditForm({
                                                                        ...editForm,
                                                                        tiers: [...editForm.tiers, { min: newMin, max: newMin + 50, type: 'per_km', price: 0, rate: 100 }]
                                                                    })
                                                                }}
                                                                className="text-sm bg-slate-100 px-3 py-1 rounded hover:bg-slate-200"
                                                            >
                                                                + Add Tier
                                                            </button>
                                                            <button
                                                                onClick={async () => {
                                                                    const res = await fetch(`/api/pricing`, {
                                                                        method: 'PUT',
                                                                        headers: { 'Content-Type': 'application/json' },
                                                                        body: JSON.stringify(editForm)
                                                                    })
                                                                    if (res.ok) {
                                                                        setVehiclePricing(prev => prev.map(v => v._id === editForm._id ? { ...v, ...editForm } : v))
                                                                        setEditingVehicle(null)
                                                                        alert('Saved successfully!')
                                                                    } else {
                                                                        const err = await res.json();
                                                                        alert('Error: ' + (err.error || 'Failed to save'));
                                                                    }
                                                                }}
                                                                className="text-sm bg-emerald-900 text-white px-6 py-2 rounded-lg hover:bg-emerald-900/90 font-bold shadow-lg shadow-emerald-900/20 transition-all hover:scale-105"
                                                            >
                                                                Save {pricingCategory.replace('-', ' ')} Rates
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="overflow-x-auto mt-4 border-t pt-4">
                                                        <table className="w-full text-sm">
                                                            <thead>
                                                                <tr className="bg-slate-50 text-gray-500">
                                                                    <th className="px-4 py-2 text-left">Distance Range</th>
                                                                    <th className="px-4 py-2 text-left">Type</th>
                                                                    <th className="px-4 py-2 text-right">Rate</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {(vehicle.tiers || []).map((tier, idx) => (
                                                                    <tr key={idx} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                                                                        <td className="px-4 py-2 font-medium bg-white">{tier.min} - {tier.max >= 9999 ? '∞' : tier.max} km</td>
                                                                        <td className="px-4 py-2 bg-white">
                                                                            <span className={`px-2 py-0.5 rounded text-xs ${tier.type === 'flat' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                                                                {tier.type === 'flat' ? 'Flat Rate' : 'Per KM'}
                                                                            </span>
                                                                        </td>
                                                                        <td className="px-4 py-2 text-right font-bold text-emerald-900 bg-white">
                                                                            {tier.type === 'flat' ? `LKR ${tier.price?.toLocaleString()}` : `LKR ${tier.rate}/km`}
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Express Checkout Quick Links */}
                                <div className="mt-12 bg-slate-50 rounded-2xl p-8 border-2 border-dashed border-slate-200">
                                    <div className="flex items-center justify-between mb-8">
                                        <div>
                                            <h3 className="text-xl font-bold text-emerald-900 flex items-center gap-2">
                                                <LinkIcon size={20} className="text-emerald-600" /> Shareable Flat Rate Links
                                            </h3>
                                            <p className="text-slate-500 text-sm mt-1">Direct payment links for marketing and manual sharing.</p>
                                        </div>
                                    </div>

                                    {/* Quick Link Generator Form */}
                                    <div className="mb-12 bg-white p-6 rounded-2xl border border-emerald-900/10 shadow-sm">
                                        <h4 className="text-sm font-bold text-emerald-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <Plus size={16} /> Quick Link Generator
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                                            <div className="md:col-span-1">
                                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Destination/Title</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. Airport to Galle"
                                                    value={newQuickLink.title}
                                                    onChange={(e) => setNewQuickLink({ ...newQuickLink, title: e.target.value })}
                                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-600/20"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Currency</label>
                                                <select
                                                    value={newQuickLink.currency || 'USD'}
                                                    onChange={(e) => setNewQuickLink({ ...newQuickLink, currency: e.target.value })}
                                                    className="w-full px-4 py-[9px] bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-600/20 font-bold"
                                                >
                                                    <option value="USD">USD ($)</option>
                                                    <option value="GBP">GBP (£)</option>
                                                    <option value="EUR">EUR (€)</option>
                                                    <option value="LKR">LKR (Rs)</option>
                                                    <option value="INR">INR (₹)</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Price</label>
                                                <input
                                                    type="number"
                                                    placeholder="59"
                                                    value={newQuickLink.price}
                                                    onChange={(e) => setNewQuickLink({ ...newQuickLink, price: e.target.value })}
                                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-600/20 font-bold"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Link Slug (ID)</label>
                                                <input
                                                    type="text"
                                                    placeholder="airport-to-galle"
                                                    value={newQuickLink.slug}
                                                    onChange={(e) => setNewQuickLink({ ...newQuickLink, slug: e.target.value })}
                                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-600/20"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Payment Mode</label>
                                                <select
                                                    value={newQuickLink.allowedPaymentMode}
                                                    onChange={(e) => setNewQuickLink({ ...newQuickLink, allowedPaymentMode: e.target.value })}
                                                    className="w-full px-4 py-[9px] bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-600/20 font-bold text-emerald-900"
                                                >
                                                    <option value="both">Both (Choice)</option>
                                                    <option value="full">100% Only</option>
                                                    <option value="partial">50% Only</option>
                                                </select>
                                            </div>
                                            <button
                                                onClick={handleSaveQuickLink}
                                                disabled={isSavingQuickLink}
                                                className="bg-emerald-900 text-white h-[42px] px-6 rounded-xl font-bold text-sm hover:bg-emerald-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 md:col-span-5"
                                            >
                                                {isSavingQuickLink ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                                                Create Dynamic Link
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {/* Dynamic Links from DB */}
                                        {quickLinks.map((rate) => (
                                            <div key={rate._id} className="bg-emerald-900 text-white p-6 rounded-2xl shadow-lg border border-emerald-800 flex flex-col justify-between group hover:-translate-y-1 transition-all relative overflow-hidden">
                                                <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
                                                <div>
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white font-black">
                                                            {rate.title.split(' ').pop().charAt(0)}
                                                        </div>
                                                        <span className="text-[10px] font-bold text-emerald-400 border border-emerald-400/30 px-3 py-1 rounded-full uppercase tracking-widest">{rate.badge}</span>
                                                    </div>
                                                    <h4 className="font-bold text-white mb-1">{rate.title}</h4>
                                                    <p className="text-2xl font-black text-white mb-4">
                                                        {rate.currency === 'LKR' ? 'Rs.' : rate.currency === 'EUR' ? '€' : rate.currency === 'GBP' ? '£' : rate.currency === 'INR' ? '₹' : '$'}
                                                        {rate.price?.toLocaleString()}
                                                    </p>
                                                </div>

                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            const url = `${window.location.origin}/checkout/${rate.slug}`;
                                                            navigator.clipboard.writeText(url);
                                                            alert('Link copied to clipboard!');
                                                        }}
                                                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white text-emerald-900 rounded-xl font-bold text-xs hover:bg-emerald-50 transition-all"
                                                    >
                                                        <Copy size={14} /> Copy Link
                                                    </button>
                                                    <Link
                                                        href={`/checkout/${rate.slug}`}
                                                        target="_blank"
                                                        className="w-10 h-10 flex items-center justify-center bg-white/10 text-white rounded-xl hover:bg-white hover:text-emerald-900 transition-all"
                                                        title="Preview"
                                                    >
                                                        <ExternalLink size={16} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDeleteQuickLink(rate._id)}
                                                        className="w-10 h-10 flex items-center justify-center bg-white/10 text-white rounded-xl hover:bg-red-500 transition-all"
                                                        title="Delete"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                                                    <div className="flex flex-col">
                                                        <span className="text-[9px] text-white/40 uppercase font-bold tracking-tighter">SLUG: {rate.slug}</span>
                                                        <span className="text-[9px] text-emerald-400 font-bold uppercase">{rate.currency || 'USD'}</span>
                                                    </div>
                                                    <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest bg-emerald-400/10 px-2 py-0.5 rounded">
                                                        {rate?.allowedPaymentMode === 'full' ? '100% Only' : rate?.allowedPaymentMode === 'partial' ? '50% Only' : 'Customer Choice'}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Static Flat Rates */}
                                        {flatRatesList.map((rate) => (
                                            <div key={rate.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between group hover:shadow-md transition-all">
                                                <div>
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 font-black">
                                                            {rate.title.split(' ').pop().charAt(0)}
                                                        </div>
                                                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">{rate.badge}</span>
                                                    </div>
                                                    <h4 className="font-bold text-slate-800 mb-1">{rate.title}</h4>
                                                    <p className="text-2xl font-black text-emerald-900 mb-4">${rate.price}</p>
                                                </div>

                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            const url = `${window.location.origin}/checkout/${rate.id}`;
                                                            navigator.clipboard.writeText(url);
                                                            alert('Link copied to clipboard!');
                                                        }}
                                                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-900 text-white rounded-xl font-bold text-xs hover:bg-emerald-800 transition-all"
                                                    >
                                                        <Copy size={14} /> Copy Link
                                                    </button>
                                                    <Link
                                                        href={`/checkout/${rate.id}`}
                                                        target="_blank"
                                                        className="w-10 h-10 flex items-center justify-center bg-slate-100 text-slate-400 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all"
                                                        title="Preview Link"
                                                    >
                                                        <ExternalLink size={16} />
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentView === 'tours' && (
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                    <h2 className="text-2xl font-bold text-emerald-900">Manage Tour Packages</h2>
                                    <div className="flex items-center gap-2">
                                        <select
                                            value={tourCategoryFilter}
                                            onChange={(e) => setTourCategoryFilter(e.target.value)}
                                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                                        >
                                            <option value="All">All Categories</option>
                                            <option value="Day Tours">Day Tours</option>
                                            <option value="City Tours">City Tours</option>
                                            <option value="Safari">Safari</option>
                                            <option value="Tour Packages">Tour Packages</option>
                                        </select>
                                        <button
                                            onClick={() => {
                                                setTourForm({
                                                    title: '',
                                                    category: 'Day Tours',
                                                    price: '',
                                                    priceType: 'per person',
                                                    duration: '',
                                                    image: '',
                                                    description: '',
                                                    destinations: [],
                                                    highlights: [],
                                                    includes: []
                                                })
                                                setEditingTour('NEW')
                                            }}
                                            className="bg-emerald-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-emerald-900/90 text-sm flex items-center gap-2 shadow-lg shadow-emerald-900/20 transition-all hover:scale-105"
                                        >
                                            <Compass size={16} /> Add New Tour
                                        </button>
                                    </div>
                                </div>

                                {isLoading ? (
                                    <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-900"></div></div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {tours
                                            .filter(t => tourCategoryFilter === 'All' || t.category === tourCategoryFilter)
                                            .map(tour => (
                                                <div key={tour._id} className="group relative bg-white border rounded-xl overflow-hidden hover:shadow-xl transition-all">
                                                    <div className="h-48 overflow-hidden relative">
                                                        <img
                                                            src={tour.image || '/tours/placeholder.jpg'}
                                                            alt={tour.title}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                            onError={(e) => e.target.src = 'https://placehold.co/600x400?text=No+Image'}
                                                        />
                                                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-emerald-900 shadow">
                                                            {tour.category}
                                                        </div>
                                                    </div>
                                                    <div className="p-4">
                                                        <h3 className="font-bold text-emerald-900 text-lg mb-1">{tour.title}</h3>
                                                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                                                            <span className="flex items-center gap-1"><Clock size={12} /> {typeof tour.duration === 'object' ? `${tour.duration.days}D / ${tour.duration.nights}N` : tour.duration}</span>
                                                            <span className="flex items-center gap-1"><DollarSign size={12} /> {tour.price ? `From ${(typeof tour.price === 'object' ? tour.price.currency : '$')}${typeof tour.price === 'object' ? tour.price.amount : tour.price}` : 'Contact for price'}</span>
                                                        </div>
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => {
                                                                    setTourForm(tour)
                                                                    setEditingTour(tour._id)
                                                                }}
                                                                className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold hover:bg-emerald-100"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={async () => {
                                                                    if (confirm('Delete this tour?')) {
                                                                        await fetch(`/api/tours?id=${tour._id}`, { method: 'DELETE' })
                                                                        setTours(tours.filter(t => t._id !== tour._id))
                                                                    }
                                                                }}
                                                                className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </div>

                            {/* Edit/Create Tour Modal */}
                            {editingTour && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 animate-fade-in-up">
                                        <div className="flex justify-between items-center mb-6 border-b pb-4">
                                            <h3 className="text-xl font-bold text-emerald-900">{editingTour === 'NEW' ? 'Create New Tour' : 'Edit Tour'}</h3>
                                            <button onClick={() => setEditingTour(null)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                                    <input
                                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-600/20 outline-none"
                                                        value={tourForm.title || ''}
                                                        onChange={e => setTourForm({ ...tourForm, title: e.target.value })}
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                                        <select
                                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-600/20 outline-none bg-white"
                                                            value={tourForm.category || 'Day Tours'}
                                                            onChange={e => setTourForm({ ...tourForm, category: e.target.value })}
                                                        >
                                                            {['Day Tours', 'City Tours', 'Safari', 'Tour Packages'].map(c => <option key={c} value={c}>{c}</option>)}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Nights)</label>
                                                        <input
                                                            type="number"
                                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-600/20 outline-none"
                                                            placeholder="0"
                                                            value={tourForm.nights || ''}
                                                            onChange={e => setTourForm({ ...tourForm, nights: e.target.value })}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Days)</label>
                                                        <input
                                                            type="number"
                                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-600/20 outline-none"
                                                            placeholder="1"
                                                            value={tourForm.days || ''}
                                                            onChange={e => setTourForm({ ...tourForm, days: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Price (USD)</label>
                                                        <input
                                                            type="number"
                                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-600/20 outline-none"
                                                            value={tourForm.priceAmount || tourForm.price?.amount || ''}
                                                            onChange={e => setTourForm({ ...tourForm, priceAmount: e.target.value })}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Price Type</label>
                                                        <input
                                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-600/20 outline-none"
                                                            placeholder="per person / group"
                                                            value={tourForm.priceType || ''}
                                                            onChange={e => setTourForm({ ...tourForm, priceType: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                                    <textarea
                                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-600/20 outline-none h-32"
                                                        value={tourForm.description || ''}
                                                        onChange={e => setTourForm({ ...tourForm, description: e.target.value })}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
                                                    <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center hover:bg-slate-50 transition-colors">
                                                        {tourForm.image ? (
                                                            <div className="relative">
                                                                <img src={tourForm.image} alt="Preview" className="w-full h-40 object-cover rounded mb-2" />
                                                                <button onClick={() => setTourForm({ ...tourForm, image: '' })} className="text-red-500 text-xs hover:underline">Remove</button>
                                                            </div>
                                                        ) : (
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={async (e) => {
                                                                    const file = e.target.files[0]
                                                                    if (file) {
                                                                        const formData = new FormData()
                                                                        formData.append('file', file)
                                                                        formData.append('folder', 'tours')
                                                                        const res = await fetch('/api/upload', { method: 'POST', body: formData })
                                                                        const data = await res.json()
                                                                        if (data.url) setTourForm({ ...tourForm, image: data.url })
                                                                    }
                                                                }}
                                                                className="text-xs w-full"
                                                            />
                                                        )}
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Destinations (comma separated)</label>
                                                    <textarea
                                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-600/20 outline-none h-20"
                                                        value={Array.isArray(tourForm.destinations) ? tourForm.destinations.join(', ') : tourForm.destinations || ''}
                                                        onChange={e => setTourForm({ ...tourForm, destinations: e.target.value.split(',').map(s => s.trim()) })}
                                                        placeholder="Kandy, Nuwara Eliya, Ella"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Highlights (comma separated)</label>
                                                    <textarea
                                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-600/20 outline-none h-20"
                                                        value={Array.isArray(tourForm.highlights) ? tourForm.highlights.join(', ') : tourForm.highlights || ''}
                                                        onChange={e => setTourForm({ ...tourForm, highlights: e.target.value.split(',').map(s => s.trim()) })}
                                                        placeholder="Temple of Tooth, Tea Factory, Nine Arch Bridge"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-3 pt-6 border-t mt-6">
                                            <button
                                                onClick={() => setEditingTour(null)}
                                                className="px-6 py-2 text-gray-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    try {
                                                        const method = editingTour === 'NEW' ? 'POST' : 'PUT';

                                                        // Ensure we have a slug
                                                        const tourSlug = tourForm.slug || tourForm.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

                                                        // Format data according to the Tour schema
                                                        const payload = {
                                                            ...tourForm,
                                                            slug: tourSlug,
                                                            duration: {
                                                                days: Number(tourForm.days || 1),
                                                                nights: Number(tourForm.nights || 0)
                                                            },
                                                            price: {
                                                                amount: Number(tourForm.priceAmount || tourForm.price || 0),
                                                                currency: tourForm.currency || 'USD',
                                                                type: tourForm.priceType || 'from'
                                                            }
                                                        };

                                                        const res = await fetch('/api/tours', {
                                                            method,
                                                            headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify(payload)
                                                        });

                                                        const data = await res.json();

                                                        if (res.ok && data.success) {
                                                            if (editingTour === 'NEW') setTours([data.data, ...tours]);
                                                            else setTours(tours.map(t => t._id === data.data._id ? data.data : t));
                                                            setEditingTour(null);
                                                            alert('Tour saved successfully!');
                                                        } else {
                                                            alert('Failed to save: ' + (data.error || 'Unknown error'));
                                                        }
                                                    } catch (err) {
                                                        console.error("Tour save error:", err);
                                                        alert('An error occurred while saving the tour.');
                                                    }
                                                }}
                                                className="px-6 py-2 bg-emerald-900 text-white rounded-lg font-bold hover:bg-emerald-900/90 shadow-lg"
                                            >
                                                Save Tour
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {currentView === 'blog' && (
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-emerald-900">Blog Posts</h2>
                                    <button
                                        onClick={() => {
                                            setPostForm({})
                                            setEditingPost('NEW')
                                        }}
                                        className="bg-emerald-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-emerald-900/90 text-sm flex items-center gap-2 shadow-lg shadow-emerald-900/20 transition-all hover:scale-105"
                                    >
                                        <FileText size={16} /> Add New Post
                                    </button>
                                </div>

                                {/* Post List */}
                                {isLoading ? (
                                    <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-900"></div></div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="bg-slate-50 text-gray-500">
                                                    <th className="px-4 py-3 text-left">Title</th>
                                                    <th className="px-4 py-3 text-left">Slug</th>
                                                    <th className="px-4 py-3 text-left">Status</th>
                                                    <th className="px-4 py-3 text-left">Date</th>
                                                    <th className="px-4 py-3 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {blogPosts.map(post => (
                                                    <tr key={post._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                                        <td className="px-4 py-3 font-medium text-emerald-900">{post.title}</td>
                                                        <td className="px-4 py-3 text-gray-500">{post.slug}</td>
                                                        <td className="px-4 py-3">
                                                            <span className={`px-2 py-1 rounded text-xs font-bold ${post.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                                                {post.isPublished ? 'Published' : 'Draft'}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</td>
                                                        <td className="px-4 py-3 text-right">
                                                            <button
                                                                onClick={() => {
                                                                    setPostForm(post)
                                                                    setEditingPost(post._id)
                                                                }}
                                                                className="text-emerald-900 hover:text-emerald-600 font-medium"
                                                            >
                                                                Edit
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {blogPosts.length === 0 && (
                                                    <tr><td colSpan="5" className="text-center py-8 text-gray-400">No posts found.</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            {/* Add/Edit Post Modal */}
                            {editingPost && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-6 h-[90vh] overflow-y-auto animate-fade-in-up">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-xl font-bold text-emerald-900">{editingPost === 'NEW' ? 'Create New Post' : 'Edit Post'}</h3>
                                            <button onClick={() => setEditingPost(null)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="grid md:grid-cols-3 gap-6">
                                                <div className="md:col-span-2 space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                                        <input
                                                            type="text"
                                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-600/20 outline-none"
                                                            value={postForm.title || ''}
                                                            onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                                                            placeholder="Post Title"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Slug (auto-generated if empty)</label>
                                                        <input
                                                            type="text"
                                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-600/20 outline-none"
                                                            value={postForm.slug || ''}
                                                            onChange={(e) => setPostForm({ ...postForm, slug: e.target.value })}
                                                            placeholder="post-url-slug"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Content (HTML allowed)</label>
                                                        <textarea
                                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-600/20 outline-none h-64 font-mono text-sm"
                                                            value={postForm.content || ''}
                                                            onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                                                            placeholder="<p>Write your content here...</p>"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                                        <select
                                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-600/20 outline-none bg-white"
                                                            value={postForm.isPublished ? 'true' : 'false'}
                                                            onChange={(e) => setPostForm({ ...postForm, isPublished: e.target.value === 'true' })}
                                                        >
                                                            <option value="false">Draft</option>
                                                            <option value="true">Published</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
                                                        <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center hover:bg-slate-50 transition-colors">
                                                            {postForm.coverImage ? (
                                                                <div className="relative">
                                                                    <img src={postForm.coverImage} alt="Cover" className="w-full h-32 object-cover rounded mb-2" />
                                                                    <button
                                                                        onClick={() => setPostForm({ ...postForm, coverImage: '' })}
                                                                        className="text-red-500 text-xs hover:underline"
                                                                    >
                                                                        Remove
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={async (e) => {
                                                                        const file = e.target.files[0]
                                                                        if (file) {
                                                                            const formData = new FormData()
                                                                            formData.append('file', file)
                                                                            formData.append('folder', 'blog')
                                                                            const res = await fetch('/api/upload', { method: 'POST', body: formData })
                                                                            const data = await res.json()
                                                                            if (data.url) {
                                                                                setPostForm({ ...postForm, coverImage: data.url })
                                                                            }
                                                                        }
                                                                    }}
                                                                    className="text-xs w-full"
                                                                />
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
                                                        <input
                                                            type="text"
                                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-600/20 outline-none text-sm"
                                                            value={postForm.seo?.metaTitle || ''}
                                                            onChange={(e) => setPostForm({ ...postForm, seo: { ...postForm.seo, metaTitle: e.target.value } })}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                                                        <textarea
                                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-600/20 outline-none text-sm h-24"
                                                            value={postForm.seo?.metaDescription || ''}
                                                            onChange={(e) => setPostForm({ ...postForm, seo: { ...postForm.seo, metaDescription: e.target.value } })}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex justify-end gap-3 pt-6 border-t">
                                                <button
                                                    onClick={() => setEditingPost(null)}
                                                    className="px-6 py-2 text-gray-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        const url = editingPost === 'NEW' ? '/api/blog' : `/api/blog/${postForm.slug}`
                                                        const method = editingPost === 'NEW' ? 'POST' : 'PUT'

                                                        const res = await fetch(url, {
                                                            method: method,
                                                            headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify(postForm)
                                                        })

                                                        const data = await res.json()
                                                        if (data.success) {
                                                            alert('Post saved successfully!')
                                                            setEditingPost(null)
                                                            // Logic to refresh list
                                                            fetch('/api/blog?isAdmin=true&limit=100').then(r => r.json()).then(d => d.success && setBlogPosts(d.data))
                                                        } else {
                                                            alert('Error: ' + data.error)
                                                        }
                                                    }}
                                                    className="px-6 py-2 bg-emerald-900 text-white rounded-lg font-bold hover:bg-emerald-900/90 shadow-lg shadow-emerald-900/20 transition-all hover:scale-105"
                                                >
                                                    {editingPost === 'NEW' ? 'Create Post' : 'Update Post'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {currentView === 'team' && (
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-emerald-900">Team Management</h2>
                                    <button
                                        onClick={() => {
                                            setTeamForm({ permissions: [] })
                                            setEditingTeam('NEW')
                                        }}
                                        className="bg-emerald-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-emerald-900/90 text-sm flex items-center gap-2 shadow-lg shadow-emerald-900/20 transition-all hover:scale-105"
                                    >
                                        <Users size={16} /> Add New Admin
                                    </button>
                                </div>

                                {isLoading ? (
                                    <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-900"></div></div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="bg-slate-50 text-gray-500">
                                                    <th className="px-4 py-3 text-left">Name</th>
                                                    <th className="px-4 py-3 text-left">Email</th>
                                                    <th className="px-4 py-3 text-left">Role</th>
                                                    <th className="px-4 py-3 text-left">Permissions</th>
                                                    <th className="px-4 py-3 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {teamMembers.map(member => (
                                                    <tr key={member._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                                        <td className="px-4 py-3 font-medium text-emerald-900">{member.name}</td>
                                                        <td className="px-4 py-3 text-gray-500">{member.email}</td>
                                                        <td className="px-4 py-3 capitalize">{member.role}</td>
                                                        <td className="px-4 py-3">
                                                            <div className="flex flex-wrap gap-1">
                                                                {member.permissions?.map(p => (
                                                                    <span key={p} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs">{p}</span>
                                                                ))}
                                                                {(!member.permissions || member.permissions.length === 0) && <span className="text-gray-400 text-xs">All Access (Super)</span>}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-right">
                                                            <button className="text-gray-400 hover:text-emerald-900" title="Edit Permissions not implemented yet">•••</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            {/* Add Admin Modal */}
                            {editingTeam && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-in-up">
                                        <h3 className="text-xl font-bold text-emerald-900 mb-4">Add New Admin</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                                <input
                                                    type="text"
                                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-600/20"
                                                    value={teamForm.name || ''}
                                                    onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                                <input
                                                    type="email"
                                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-600/20"
                                                    value={teamForm.email || ''}
                                                    onChange={(e) => setTeamForm({ ...teamForm, email: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                                <input
                                                    type="password"
                                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-600/20"
                                                    value={teamForm.password || ''}
                                                    onChange={(e) => setTeamForm({ ...teamForm, password: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Permissions</label>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {['manage_bookings', 'manage_vehicles', 'manage_content', 'manage_team'].map(perm => {
                                                        const isChecked = teamForm.permissions?.includes(perm);
                                                        return (
                                                            <div
                                                                key={perm}
                                                                onClick={() => {
                                                                    const current = teamForm.permissions || []
                                                                    if (isChecked) {
                                                                        setTeamForm({ ...teamForm, permissions: current.filter(p => p !== perm) })
                                                                    } else {
                                                                        setTeamForm({ ...teamForm, permissions: [...current, perm] })
                                                                    }
                                                                }}
                                                                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${isChecked ? 'bg-emerald-50 border-emerald-500' : 'bg-white border-slate-200 hover:border-emerald-200'}`}
                                                            >
                                                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isChecked ? 'bg-emerald-600 border-emerald-600' : 'bg-white border-slate-300'}`}>
                                                                    {isChecked && <Check size={12} className="text-white" />}
                                                                </div>
                                                                <span className="capitalize text-sm font-medium text-slate-700">{perm.replace('_', ' ')}</span>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>

                                            <div className="flex justify-end gap-3 pt-4">
                                                <button
                                                    onClick={() => setEditingTeam(null)}
                                                    className="px-4 py-2 text-gray-600 hover:bg-slate-100 rounded-lg"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        if (!teamForm.email || !teamForm.password) return alert('Email & Password required')
                                                        const res = await fetch('/api/admin/team', {
                                                            method: 'POST',
                                                            headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify(teamForm)
                                                        })
                                                        const data = await res.json()
                                                        if (data.success) {
                                                            setTeamMembers([...teamMembers, data.data])
                                                            setEditingTeam(null)
                                                            alert('Admin added!')
                                                        } else {
                                                            alert(data.error)
                                                        }
                                                    }}
                                                    className="px-6 py-2 bg-emerald-900 text-white rounded-lg font-bold hover:bg-emerald-900/90"
                                                >
                                                    Create User
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {currentView === 'bookings' && (
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                <div className="flex items-center gap-4">
                                    <h2 className="text-2xl font-bold text-emerald-900">All Bookings</h2>
                                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">{filteredBookings.length} total</span>
                                </div>
                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                    <div className="relative w-full sm:w-80">
                                        <input
                                            type="text"
                                            placeholder="Search by ID, Name, Phone..."
                                            value={bookingSearch}
                                            onChange={(e) => setBookingSearch(e.target.value)}
                                            className="w-full sm:w-80 pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600/20 shadow-sm"
                                        />
                                        <div className="absolute left-3 top-2.5 text-gray-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowManualBooking(true)}
                                        className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-emerald-700 text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all whitespace-nowrap"
                                    >
                                        <Plus size={16} /> Manual Booking
                                    </button>
                                </div>
                            </div>

                            {/* Manual Booking Modal */}
                            {showManualBooking && (
                                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 animate-fade-in-up overflow-y-auto max-h-[90vh]">
                                        <div className="flex items-center justify-between mb-6 border-b pb-4">
                                            <h3 className="text-xl font-bold text-emerald-900">Add Manual / Offline Trip</h3>
                                            <button onClick={() => setShowManualBooking(false)} className="text-gray-400 hover:text-gray-600">
                                                <X size={24} />
                                            </button>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Booking Type</label>
                                                <div className="flex gap-4">
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            checked={manualBookingForm.type === 'transfer'}
                                                            onChange={() => setManualBookingForm({ ...manualBookingForm, type: 'transfer' })}
                                                            className="text-emerald-600 focus:ring-emerald-500"
                                                        />
                                                        <span className="text-sm font-medium">Taxi Transfer</span>
                                                    </label>
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            checked={manualBookingForm.type === 'day-trip'}
                                                            onChange={() => setManualBookingForm({ ...manualBookingForm, type: 'day-trip' })}
                                                            className="text-emerald-600 focus:ring-emerald-500"
                                                        />
                                                        <span className="text-sm font-medium">Day Trip</span>
                                                    </label>
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            checked={manualBookingForm.type === 'tour'}
                                                            onChange={() => setManualBookingForm({ ...manualBookingForm, type: 'tour' })}
                                                            className="text-emerald-600 focus:ring-emerald-500"
                                                        />
                                                        <span className="text-sm font-medium">Tour Package</span>
                                                    </label>
                                                </div>
                                            </div>

                                            {(manualBookingForm.type === 'tour' || manualBookingForm.type === 'day-trip') && (
                                                <div className="md:col-span-2">
                                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Package / Day Trip Title</label>
                                                    <input
                                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-600/20 outline-none text-sm"
                                                        value={manualBookingForm.tourDetails?.tourTitle || ''}
                                                        onChange={e => setManualBookingForm({
                                                            ...manualBookingForm,
                                                            tourDetails: { ...manualBookingForm.tourDetails, tourTitle: e.target.value }
                                                        })}
                                                        placeholder="e.g. 7 Days Sri Lanka Grand Tour or Kandy Day Trip"
                                                    />
                                                </div>
                                            )}

                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Customer Name</label>
                                                <input
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-600/20 outline-none text-sm"
                                                    value={manualBookingForm.customerName}
                                                    onChange={e => setManualBookingForm({ ...manualBookingForm, customerName: e.target.value })}
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number</label>
                                                <input
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-600/20 outline-none text-sm"
                                                    value={manualBookingForm.guestPhone}
                                                    onChange={e => setManualBookingForm({ ...manualBookingForm, guestPhone: e.target.value })}
                                                    placeholder="+94 77 XXX XXXX"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Pickup Location</label>
                                                <input
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-600/20 outline-none text-sm"
                                                    value={manualBookingForm.pickupLocation.address}
                                                    onChange={e => setManualBookingForm({ ...manualBookingForm, pickupLocation: { ...manualBookingForm.pickupLocation, address: e.target.value } })}
                                                    placeholder="Airport Terminal 1"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Dropoff Location</label>
                                                <input
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-600/20 outline-none text-sm"
                                                    value={manualBookingForm.dropoffLocation.address}
                                                    onChange={e => setManualBookingForm({ ...manualBookingForm, dropoffLocation: { ...manualBookingForm.dropoffLocation, address: e.target.value } })}
                                                    placeholder="Hotel Name / City"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Date</label>
                                                <input
                                                    type="date"
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-600/20 outline-none text-sm"
                                                    value={manualBookingForm.scheduledDate}
                                                    onChange={e => setManualBookingForm({ ...manualBookingForm, scheduledDate: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Time</label>
                                                <input
                                                    type="time"
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-600/20 outline-none text-sm"
                                                    value={manualBookingForm.scheduledTime}
                                                    onChange={e => setManualBookingForm({ ...manualBookingForm, scheduledTime: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Vehicle Type</label>
                                                <select
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-600/20 outline-none text-sm bg-white"
                                                    value={manualBookingForm.vehicleType}
                                                    onChange={e => setManualBookingForm({ ...manualBookingForm, vehicleType: e.target.value })}
                                                >
                                                    <option value="sedan">Sedan (Car)</option>
                                                    <option value="van">Van</option>
                                                    <option value="mini-van">Mini Van</option>
                                                    <option value="suv">SUV</option>
                                                    <option value="luxury">Luxury</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Distance (KM)</label>
                                                <input
                                                    type="number"
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-600/20 outline-none text-sm"
                                                    value={manualBookingForm.distanceKm}
                                                    onChange={e => setManualBookingForm({ ...manualBookingForm, distanceKm: e.target.value })}
                                                    placeholder="100"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Price (LKR)</label>
                                                <input
                                                    type="number"
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-600/20 outline-none text-sm"
                                                    value={manualBookingForm.totalPrice}
                                                    onChange={e => setManualBookingForm({ ...manualBookingForm, totalPrice: e.target.value })}
                                                    placeholder="15000"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Payment Method</label>
                                                <select
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-600/20 outline-none text-sm bg-white"
                                                    value={manualBookingForm.paymentMethod}
                                                    onChange={e => setManualBookingForm({ ...manualBookingForm, paymentMethod: e.target.value })}
                                                >
                                                    <option value="cash">Cash</option>
                                                    <option value="card">Card (Manual Swipe)</option>
                                                    <option value="online">Online Link</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="mt-8 flex justify-end gap-3 pt-6 border-t">
                                            <button
                                                onClick={() => setShowManualBooking(false)}
                                                className="px-6 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-bold"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                disabled={isSavingManual}
                                                onClick={async () => {
                                                    setIsSavingManual(true)
                                                    try {
                                                        const res = await fetch('/api/bookings', {
                                                            method: 'POST',
                                                            headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify({ ...manualBookingForm, isManual: true })
                                                        })
                                                        if (res.ok) {
                                                            alert('Manual booking added successfully!')
                                                            setShowManualBooking(false)
                                                            // Refresh list
                                                            fetch('/api/bookings').then(r => r.json()).then(d => setBookings(d))
                                                        }
                                                    } catch (e) {
                                                        console.error(e)
                                                        alert('Failed to save manual booking')
                                                    } finally {
                                                        setIsSavingManual(false)
                                                    }
                                                }}
                                                className="px-8 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-500/30 flex items-center gap-2"
                                            >
                                                {isSavingManual ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                                                Save Booking
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {filteredBookings.length === 0 ? (
                                <div className="text-center py-12 text-gray-400 bg-slate-50 rounded-lg border border-dashed">
                                    <p>No matching bookings found</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-slate-50 text-gray-500 text-left">
                                                <th className="px-4 py-3 rounded-l-lg">Booking ID</th>
                                                <th className="px-4 py-3">Customer</th>
                                                <th className="px-4 py-3">Route</th>
                                                <th className="px-4 py-3">Date & Time</th>
                                                <th className="px-4 py-3">Vehicle</th>
                                                <th className="px-4 py-3 text-right">Amount</th>
                                                <th className="px-4 py-3">Payment</th>
                                                <th className="px-4 py-3 rounded-r-lg">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredBookings.map((booking) => (
                                                <tr
                                                    key={booking._id}
                                                    onClick={() => {
                                                        setSelectedBooking(booking)
                                                        setSelectedStatus(booking.status || 'pending')
                                                        setSelectedPaymentStatus(booking.paymentStatus || 'pending')
                                                        setSelectedDriver(booking.driver?._id || booking.driver || '')
                                                    }}
                                                    className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
                                                >
                                                    <td className="px-4 py-4 font-mono text-xs text-gray-400">
                                                        {booking._id?.slice(-8) || 'N/A'}
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="font-medium text-emerald-900">{booking.customerName || booking.guestPhone || 'Guest'}</div>
                                                        <div className="text-xs text-gray-400">{booking.guestPhone}</div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        {booking.type === 'tour' && booking.tourDetails ? (
                                                            <div>
                                                                <div className="font-bold text-emerald-900">{booking.tourDetails.tourTitle}</div>
                                                                <div className="text-xs text-gray-500">ID: {booking.tourDetails.tourId || 'N/A'}</div>
                                                                {booking.tourDetails.duration && (
                                                                    <div className="text-xs text-gray-400">{booking.tourDetails.duration}</div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <div className="text-xs">
                                                                    <span className="text-green-600">●</span> {booking.pickupLocation?.address?.split(',')[0] || 'N/A'}
                                                                </div>
                                                                <div className="text-xs">
                                                                    <span className="text-red-500">●</span> {booking.dropoffLocation?.address?.split(',')[0] || 'N/A'}
                                                                </div>
                                                            </>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="font-medium">{booking.scheduledDate || 'Not set'}</div>
                                                        <div className="text-xs text-gray-400">{booking.scheduledTime || ''}</div>
                                                    </td>
                                                    <td className="px-4 py-4 capitalize">
                                                        {booking.vehicleType?.replace(/-/g, ' ') || 'N/A'}
                                                    </td>
                                                    <td className="px-4 py-4 text-right font-bold text-emerald-900">
                                                        {formatPrice(booking)}
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <span className={`px-2 py-1 rounded text-xs font-bold capitalize ${booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                                                            booking.paymentStatus === 'pending' ? 'bg-orange-100 text-orange-700' :
                                                                'bg-gray-100 text-gray-600'
                                                            }`}>
                                                            {booking.paymentStatus || 'pending'}
                                                        </span>
                                                        <div className="text-xs text-gray-400 mt-1">{booking.paymentMethod || 'cash'}</div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <span className={`px-2 py-1 rounded text-xs font-bold capitalize ${booking.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                            booking.status === 'ongoing' ? 'bg-blue-100 text-blue-700' :
                                                                booking.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                                                                    booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                                        'bg-gray-100 text-gray-600'
                                                            }`}>
                                                            {booking.status || 'pending'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Booking Detail Modal */}
                            {selectedBooking && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                                        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
                                            <div>
                                                <h3 className="text-xl font-bold text-emerald-900">Booking Details</h3>
                                                <p className="text-sm text-gray-500">ID: {selectedBooking._id}</p>
                                            </div>
                                            <button
                                                onClick={() => setSelectedBooking(null)}
                                                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                                            >
                                                <X size={24} className="text-gray-500" />
                                            </button>
                                        </div>

                                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {/* Customer Info */}
                                            <div className="bg-slate-50 p-6 rounded-xl space-y-4">
                                                <h4 className="font-bold text-emerald-900 flex items-center gap-2">
                                                    <Users size={18} /> Customer Information
                                                </h4>
                                                <div className="space-y-3">
                                                    <div>
                                                        <span className="text-xs text-gray-500 uppercase tracking-wider block">Name</span>
                                                        <span className="font-medium">{selectedBooking.customerName || selectedBooking.guestPhone || 'N/A'}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs text-gray-500 uppercase tracking-wider block">Phone</span>
                                                        <a href={`tel:${selectedBooking.guestPhone}`} className="font-medium text-emerald-600 hover:underline flex items-center gap-1">
                                                            <Phone size={14} /> {selectedBooking.guestPhone || 'N/A'}
                                                        </a>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs text-gray-500 uppercase tracking-wider block">Email</span>
                                                        <a href={`mailto:${selectedBooking.customerEmail}`} className="font-medium text-blue-600 hover:underline flex items-center gap-1">
                                                            <Mail size={14} /> {selectedBooking.customerEmail || 'N/A'}
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Journey Info */}
                                            <div className="bg-slate-50 p-6 rounded-xl space-y-4">
                                                <h4 className="font-bold text-emerald-900 flex items-center gap-2">
                                                    <Car size={18} /> Journey Details
                                                </h4>
                                                <div className="space-y-3">
                                                    <div>
                                                        <span className="text-xs text-gray-500 uppercase tracking-wider block">{selectedBooking.type === 'tour' ? 'Tour Details' : 'Route'}</span>
                                                        {selectedBooking.type === 'tour' && selectedBooking.tourDetails ? (
                                                            <div className="mt-1 space-y-1">
                                                                <div className="font-bold text-emerald-900">{selectedBooking.tourDetails.tourTitle}</div>
                                                                <div className="text-sm text-gray-600 font-mono">ID: {selectedBooking.tourDetails.tourId}</div>
                                                                <div className="text-sm text-gray-600 mb-2">Duration: {selectedBooking.tourDetails.duration}</div>
                                                                {selectedBooking.pickupLocation?.address && selectedBooking.pickupLocation.address !== 'Tour Pickup (TBD)' && (
                                                                    <div className="text-xs text-gray-500 mt-2">
                                                                        <span className="font-bold">Pickup:</span> {selectedBooking.pickupLocation.address}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div className="mt-1 space-y-2">
                                                                <div className="flex items-start gap-2">
                                                                    <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></div>
                                                                    <span className="text-sm leading-tight">{selectedBooking.pickupLocation?.address || 'N/A'}</span>
                                                                </div>
                                                                <div className="flex items-start gap-2">
                                                                    <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></div>
                                                                    <span className="text-sm leading-tight">{selectedBooking.dropoffLocation?.address || 'N/A'}</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4 pt-2">
                                                        <div>
                                                            <span className="text-xs text-gray-500 uppercase tracking-wider block">Distance</span>
                                                            <span className="font-medium">{selectedBooking.distanceKm} km</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-xs text-gray-500 uppercase tracking-wider block">Vehicle</span>
                                                            <span className="font-medium capitalize">{selectedBooking.vehicleType?.replace(/-/g, ' ')}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Schedule Info */}
                                            <div className="bg-slate-50 p-6 rounded-xl space-y-4">
                                                <h4 className="font-bold text-emerald-900 flex items-center gap-2">
                                                    <Calendar size={18} /> Schedule
                                                </h4>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <span className="text-xs text-gray-500 uppercase tracking-wider block">Date</span>
                                                        <span className="font-medium">{selectedBooking.scheduledDate}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs text-gray-500 uppercase tracking-wider block">Time</span>
                                                        <span className="font-medium">{selectedBooking.scheduledTime}</span>
                                                    </div>
                                                    <div className="col-span-2">
                                                        <span className="text-xs text-gray-500 uppercase tracking-wider block">Flight Number</span>
                                                        <span className="font-medium">{selectedBooking.flightNumber || 'Not provided'}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Payment Info */}
                                            <div className="bg-slate-50 p-6 rounded-xl space-y-4">
                                                <h4 className="font-bold text-emerald-900 flex items-center gap-2">
                                                    <CreditCard size={18} /> Payment & Status
                                                </h4>
                                                <div className="space-y-3">
                                                    <div className="space-y-1">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-xs text-gray-500 uppercase tracking-wider">Total Amount ({selectedBooking.currency || 'LKR'})</span>
                                                            <span className="text-xl font-bold text-emerald-600">{formatPrice(selectedBooking)}</span>
                                                        </div>
                                                        {selectedBooking.paymentType === 'partial' && (
                                                            <>
                                                                <div className="flex justify-between items-center text-xs">
                                                                    <span className="text-gray-500">Paid (Online)</span>
                                                                    <span className="font-bold text-emerald-600">
                                                                        Rs {(selectedBooking.displayPaidAmount || selectedBooking.paidAmount || 0).toLocaleString()}
                                                                    </span>
                                                                </div>
                                                                <div className="flex justify-between items-center text-xs">
                                                                    <span className="text-gray-500">Balance (to Driver)</span>
                                                                    <span className="font-bold text-orange-600">
                                                                        Rs {(selectedBooking.displayBalanceAmount || selectedBooking.balanceAmount || 0).toLocaleString()}
                                                                    </span>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4 pt-2">
                                                        <div>
                                                            <span className="text-xs text-gray-500 uppercase tracking-wider block">Method</span>
                                                            <span className="font-medium capitalize">{selectedBooking.paymentMethod}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-xs text-gray-500 uppercase tracking-wider block">Payment Status</span>
                                                            <select
                                                                className={`mt-1 w-full bg-white border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:border-emerald-600 font-bold uppercase ${selectedPaymentStatus === 'paid' ? 'text-green-700' : 'text-orange-700'}`}
                                                                value={selectedPaymentStatus}
                                                                onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                                                            >
                                                                <option value="pending">Pending</option>
                                                                <option value="paid">Paid</option>
                                                                <option value="cancelled">Cancelled</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs text-gray-500 uppercase tracking-wider block">Booking Status</span>
                                                        <select
                                                            className="mt-1 w-full bg-white border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:border-emerald-600"
                                                            value={selectedStatus}
                                                            onChange={(e) => setSelectedStatus(e.target.value)}
                                                        >
                                                            <option value="pending">Pending</option>
                                                            <option value="confirmed">Confirmed</option>
                                                            <option value="assigned">Assigned</option>
                                                            <option value="ongoing">Ongoing</option>
                                                            <option value="completed">Completed</option>
                                                            <option value="cancelled">Cancelled</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs text-gray-500 uppercase tracking-wider block">Assign Driver</span>
                                                        <select
                                                            className="mt-1 w-full bg-white border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:border-emerald-600"
                                                            value={selectedDriver}
                                                            onChange={(e) => {
                                                                setSelectedDriver(e.target.value)
                                                                if (e.target.value && selectedStatus === 'pending') {
                                                                    setSelectedStatus('assigned')
                                                                }
                                                            }}
                                                        >
                                                            <option value="">-- Select Driver --</option>
                                                            {drivers.map(driver => (
                                                                <option key={driver._id} value={driver._id}>
                                                                    {driver.name} ({driver.vehicleNumber} - {driver.vehicleType})
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-6 border-t bg-gray-50 flex flex-wrap justify-end gap-3 md:gap-4 rounded-b-2xl">
                                            <button
                                                onClick={() => setSelectedBooking(null)}
                                                className="px-6 py-2.5 text-gray-600 hover:bg-gray-200 rounded-lg font-bold transition-colors min-w-[100px]"
                                            >
                                                Close
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    setUpdatingStatus(true)
                                                    try {
                                                        // Assuming we need a PUT endpoint to update status
                                                        const res = await fetch(`/api/bookings/${selectedBooking._id}`, {
                                                            method: 'PUT',
                                                            headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify({
                                                                status: selectedStatus,
                                                                paymentStatus: selectedPaymentStatus,
                                                                assignedDriver: selectedDriver || null
                                                            })
                                                        })

                                                        const data = await res.json()

                                                        if (data.success) {
                                                            // Update local state
                                                            const updatedList = bookings.map(b =>
                                                                b._id === selectedBooking._id ? { ...b, status: selectedStatus } : b
                                                            )
                                                            setBookings(updatedList)
                                                            setSelectedBooking({ ...selectedBooking, status: selectedStatus })
                                                            alert('Booking status updated successfully')
                                                        } else {
                                                            alert('Failed to update: ' + (data.error || 'Unknown error'))
                                                        }
                                                    } catch (err) {
                                                        console.error(err)
                                                        alert('An error occurred while updating status')
                                                    } finally {
                                                        setUpdatingStatus(false)
                                                    }
                                                }}
                                                disabled={updatingStatus}
                                                className="px-8 py-2.5 bg-emerald-900 text-white rounded-lg font-bold hover:bg-emerald-800 transition-all disabled:opacity-50 min-w-[140px] shadow-lg flex items-center justify-center gap-2"
                                            >
                                                {updatingStatus ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                                                {updatingStatus ? 'Saving...' : 'Save Changes'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {currentView === 'communications' && (
                        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-8">
                            <h2 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center gap-2">
                                <Mail className="text-emerald-600" /> Email Center
                            </h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                                    <select
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-600/20 bg-white"
                                        value={emailForm.recipientType}
                                        onChange={(e) => setEmailForm({ ...emailForm, recipientType: e.target.value })}
                                    >
                                        <option value="specific">Specific Email</option>
                                        <option value="all_users">All Customers</option>
                                        <option value="all_drivers">All Drivers</option>
                                    </select>
                                </div>

                                {emailForm.recipientType === 'specific' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-600/20"
                                            placeholder="customer@example.com"
                                            value={emailForm.customEmail || ''}
                                            onChange={(e) => setEmailForm({ ...emailForm, customEmail: e.target.value })}
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-600/20"
                                        placeholder="Important Update..."
                                        value={emailForm.subject}
                                        onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                                    <textarea
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-600/20 h-48"
                                        placeholder="Write your message here..."
                                        value={emailForm.message}
                                        onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
                                    />
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button
                                        onClick={async () => {
                                            setSendingEmail(true)
                                            try {
                                                const res = await fetch('/api/admin/email', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify(emailForm)
                                                })
                                                const data = await res.json()
                                                if (data.success) {
                                                    alert(`Sent ${data.sent} emails successfully!`)
                                                    setEmailForm({ recipientType: 'specific', subject: '', message: '' })
                                                } else {
                                                    alert('Error: ' + data.error)
                                                }
                                            } catch (err) {
                                                console.error(err)
                                                alert('Failed to send emails')
                                            } finally {
                                                setSendingEmail(false)
                                            }
                                        }}
                                        disabled={sendingEmail}
                                        className="bg-emerald-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-emerald-900/90 flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {sendingEmail ? <Loader2 className="animate-spin" /> : <Mail size={18} />}
                                        {sendingEmail ? 'Sending...' : 'Send Email'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentView === 'support' && (
                        <div className="space-y-6">
                            {!selectedTicket ? (
                                <div className="bg-white rounded-xl shadow-sm p-6">
                                    <h2 className="text-2xl font-bold text-emerald-900 mb-6">Support Tickets</h2>
                                    {isLoading ? (
                                        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-900"></div></div>
                                    ) : (
                                        <div className="space-y-2">
                                            {supportTickets.map(ticket => (
                                                <div
                                                    key={ticket._id}
                                                    onClick={() => setSelectedTicket(ticket)}
                                                    className="flex items-center justify-between p-4 border border-slate-100 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-3 h-3 rounded-full ${ticket.status === 'open' ? 'bg-green-500' : ticket.status === 'answered' ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
                                                        <div>
                                                            <h3 className="font-bold text-emerald-900">{ticket.subject}</h3>
                                                            <p className="text-sm text-gray-500">{ticket.user?.name} ({ticket.user?.email})</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${ticket.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>{ticket.priority}</span>
                                                        <p className="text-xs text-gray-400 mt-1">{new Date(ticket.lastUpdated).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            {supportTickets.length === 0 && <p className="text-center text-gray-400 py-8">No tickets found.</p>}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="max-w-4xl mx-auto">
                                    <button
                                        onClick={() => setSelectedTicket(null)}
                                        className="mb-4 text-gray-500 hover:text-emerald-900 font-medium flex items-center gap-2"
                                    >
                                        ← Back to List
                                    </button>

                                    <div className="bg-white rounded-t-2xl shadow-sm p-6 border-b border-slate-100 flex justify-between items-start">
                                        <div>
                                            <h2 className="text-xl font-bold text-emerald-900 mb-1">{selectedTicket.subject}</h2>
                                            <p className="text-sm text-gray-500">Customer: {selectedTicket.user?.name} ({selectedTicket.user?.email})</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <select
                                                className="text-xs border rounded px-2 py-1 bg-white"
                                                value={selectedTicket.status}
                                                onChange={async (e) => {
                                                    const newStatus = e.target.value
                                                    const res = await fetch(`/api/support/${selectedTicket._id}`, {
                                                        method: 'PUT',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify({ status: newStatus })
                                                    })
                                                    if (res.ok) setSelectedTicket({ ...selectedTicket, status: newStatus })
                                                }}
                                            >
                                                <option value="open">Open</option>
                                                <option value="answered">Answered</option>
                                                <option value="closed">Closed</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 p-6 space-y-6 min-h-[400px] max-h-[600px] overflow-y-auto">
                                        {selectedTicket.messages.map((msg, idx) => (
                                            <div key={idx} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[80%] rounded-2xl p-4 ${msg.sender === 'admin'
                                                    ? 'bg-emerald-900 text-white rounded-tr-none'
                                                    : 'bg-white text-gray-800 shadow-sm rounded-tl-none'
                                                    }`}>
                                                    <p className="whitespace-pre-wrap text-sm">{msg.message}</p>
                                                    <p className={`text-[10px] mt-2 opacity-70 ${msg.sender === 'admin' ? 'text-right' : 'text-left'}`}>
                                                        {new Date(msg.timestamp).toLocaleString()} • {msg.sender}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="bg-white rounded-b-2xl shadow-sm p-4">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Type your reply..."
                                                className="flex-1 px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600/20"
                                                value={adminReply}
                                                onChange={e => setAdminReply(e.target.value)}
                                                onKeyDown={async (e) => {
                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                        e.preventDefault();
                                                        if (!adminReply.trim()) return;
                                                        setSendingReply(true);
                                                        try {
                                                            const res = await fetch(`/api/support/${selectedTicket._id}`, {
                                                                method: 'PUT',
                                                                headers: { 'Content-Type': 'application/json' },
                                                                body: JSON.stringify({ message: adminReply })
                                                            });
                                                            const data = await res.json();
                                                            if (data.success) {
                                                                setSelectedTicket(data.data);
                                                                setAdminReply('');
                                                            }
                                                        } catch (err) {
                                                            alert('Failed');
                                                        } finally {
                                                            setSendingReply(false);
                                                        }
                                                    }
                                                }}
                                            />
                                            <button
                                                onClick={async () => {
                                                    if (!adminReply.trim()) return
                                                    setSendingReply(true)
                                                    try {
                                                        const res = await fetch(`/api/support/${selectedTicket._id}`, {
                                                            method: 'PUT',
                                                            headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify({ message: adminReply })
                                                        })
                                                        const data = await res.json()
                                                        if (data.success) {
                                                            setSelectedTicket(data.data)
                                                            setAdminReply('')
                                                        }
                                                    } catch (err) { alert('Failed') }
                                                    finally { setSendingReply(false) }
                                                }}
                                                disabled={sendingReply || !adminReply.trim()}
                                                className="bg-emerald-600 text-emerald-900 p-3 rounded-xl hover:bg-yellow-400 transition-colors disabled:opacity-50"
                                            >
                                                {sendingReply ? '...' : <div className="font-bold px-2">Send</div>}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {currentView === 'coupons' && (
                        <div className="space-y-6">
                            {/* Header */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-3xl font-bold text-slate-800">Coupon Management</h2>
                                    <p className="text-slate-500 mt-1">Create and manage promotional discount codes</p>
                                </div>
                            </div>

                            {/* Create New Coupon Card */}
                            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl shadow-emerald-500/30">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <Percent size={20} />
                                    Create New Coupon
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-emerald-100 mb-1 uppercase tracking-wider">Code</label>
                                        <input
                                            placeholder="e.g. GALLE10"
                                            value={newCoupon.code}
                                            onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                                            className="w-full p-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 outline-none focus:bg-white/30 placeholder-white/50 text-white font-bold"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-emerald-100 mb-1 uppercase tracking-wider">Type</label>
                                        <select
                                            value={newCoupon.discountType}
                                            onChange={e => setNewCoupon({ ...newCoupon, discountType: e.target.value })}
                                            className="w-full p-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 outline-none focus:bg-white/30 text-white font-bold"
                                        >
                                            <option value="percentage" className="text-slate-800">Percentage (%)</option>
                                            <option value="flat" className="text-slate-800">Flat (Rs)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-emerald-100 mb-1 uppercase tracking-wider">Value</label>
                                        <input
                                            type="number"
                                            placeholder="10"
                                            value={newCoupon.value}
                                            onChange={e => setNewCoupon({ ...newCoupon, value: e.target.value })}
                                            className="w-full p-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 outline-none focus:bg-white/30 placeholder-white/50 text-white font-bold"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-emerald-100 mb-1 uppercase tracking-wider">Expiry</label>
                                        <input
                                            type="date"
                                            value={newCoupon.expiryDate}
                                            onChange={e => setNewCoupon({ ...newCoupon, expiryDate: e.target.value })}
                                            className="w-full p-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 outline-none focus:bg-white/30 text-white font-bold"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-emerald-100 mb-1 uppercase tracking-wider">Location</label>
                                        <input
                                            placeholder="e.g. Galle"
                                            value={newCoupon.locationsText || ''}
                                            onChange={e => setNewCoupon({ ...newCoupon, locationsText: e.target.value })}
                                            className="w-full p-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 outline-none focus:bg-white/30 placeholder-white/50 text-white font-bold"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-4">
                                    <div className="lg:col-span-2">
                                        <label className="block text-xs font-bold text-emerald-100 mb-1 uppercase tracking-wider">Description</label>
                                        <input
                                            placeholder="e.g. Get 10% off on your next trip to Galle"
                                            value={newCoupon.description}
                                            onChange={e => setNewCoupon({ ...newCoupon, description: e.target.value })}
                                            className="w-full p-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 outline-none focus:bg-white/30 placeholder-white/50 text-white font-bold"
                                        />
                                    </div>
                                    <div className="lg:col-span-1">
                                        <label className="block text-xs font-bold text-emerald-100 mb-1 uppercase tracking-wider">Image URL</label>
                                        <input
                                            placeholder="https://..."
                                            value={newCoupon.imageUrl}
                                            onChange={e => setNewCoupon({ ...newCoupon, imageUrl: e.target.value })}
                                            className="w-full p-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 outline-none focus:bg-white/30 placeholder-white/50 text-white font-bold"
                                        />
                                    </div>
                                    <div className="lg:col-span-1">
                                        <label className="block text-xs font-bold text-emerald-100 mb-1 uppercase tracking-wider">Usage Limit</label>
                                        <input
                                            type="number"
                                            placeholder="Unlimited"
                                            value={newCoupon.usageLimit}
                                            onChange={e => setNewCoupon({ ...newCoupon, usageLimit: e.target.value })}
                                            className="w-full p-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 outline-none focus:bg-white/30 placeholder-white/50 text-white font-bold"
                                        />
                                    </div>
                                    <div className="lg:col-span-1 flex items-center gap-3 pt-4">
                                        <button
                                            onClick={() => setNewCoupon({ ...newCoupon, displayInWidget: !newCoupon.displayInWidget })}
                                            className={`w-12 h-6 rounded-full transition-colors relative ${newCoupon.displayInWidget ? 'bg-emerald-400' : 'bg-white/20'}`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${newCoupon.displayInWidget ? 'left-7' : 'left-1'}`}></div>
                                        </button>
                                        <span className="text-xs font-bold text-emerald-100 uppercase tracking-wider">Display in Widget</span>
                                    </div>
                                    <div className="flex items-end">
                                        <button
                                            onClick={handleAddCoupon}
                                            className="w-full p-3 bg-white text-emerald-600 font-bold rounded-xl hover:bg-emerald-50 transition-all hover:scale-105 shadow-lg"
                                        >
                                            + Create Coupon
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Coupons Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {coupons.map(c => (
                                    <div key={c._id} className="relative group bg-white rounded-2xl border-2 border-dashed border-slate-200 hover:border-emerald-300 overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
                                        {/* Coupon Design */}
                                        <div className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                                    <Percent className="text-white" size={20} />
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteCoupon(c._id)}
                                                    className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>

                                            {/* Discount Display */}
                                            <div className="mb-2">
                                                <div className="text-4xl font-black text-slate-800">
                                                    {c.value}{c.discountType === 'percentage' ? '%' : ''}
                                                    <span className="text-lg font-bold text-slate-400 ml-1">
                                                        {c.discountType === 'percentage' ? 'OFF' : 'LKR OFF'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Description */}
                                            {c.description && (
                                                <p className="text-xs text-slate-500 mb-4 line-clamp-2">{c.description}</p>
                                            )}

                                            {/* Image Preview if exists */}
                                            {c.imageUrl && (
                                                <div className="mb-4 rounded-lg overflow-hidden h-20 bg-slate-50 border border-slate-100">
                                                    <img src={c.imageUrl} alt={c.code} className="w-full h-full object-cover" />
                                                </div>
                                            )}

                                            {/* Widget Display Link */}
                                            {c.displayInWidget && (
                                                <div className="mb-3 flex items-center gap-1.5">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Visible in Widget</span>
                                                </div>
                                            )}

                                            {/* Code */}
                                            <div className="bg-slate-100 rounded-xl p-3 flex items-center justify-between mb-4">
                                                <code className="font-mono font-bold text-emerald-600 text-lg tracking-wider">{c.code}</code>
                                                <button
                                                    onClick={() => navigator.clipboard.writeText(c.code)}
                                                    className="text-xs text-slate-400 hover:text-emerald-600"
                                                >
                                                    Copy
                                                </button>
                                            </div>

                                            {/* Details */}
                                            <div className="space-y-2 text-sm">
                                                {c.applicableLocations && c.applicableLocations.length > 0 && (
                                                    <div className="flex items-center gap-2 text-slate-600">
                                                        <MapPin size={14} className="text-emerald-500" />
                                                        <span>{c.applicableLocations.join(', ')}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2 text-slate-500">
                                                    <Calendar size={14} />
                                                    <span>{c.expiryDate ? `Expires ${new Date(c.expiryDate).toLocaleDateString()}` : 'No expiry'}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-500">
                                                    <Percent size={14} className="text-emerald-500" />
                                                    <span>Used: <span className="font-bold text-slate-800">{c.usedCount || 0}</span> {c.usageLimit ? `/ ${c.usageLimit}` : '(Unlimited)'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Decorative circles */}
                                        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-100 rounded-full"></div>
                                        <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-100 rounded-full"></div>
                                    </div>
                                ))}
                            </div>

                            {coupons.length === 0 && (
                                <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
                                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <Percent className="text-slate-400" size={28} />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-2">No Coupons Yet</h3>
                                    <p className="text-slate-500">Create your first coupon above to start offering discounts</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Reviews Management */}
                    {currentView === 'reviews' && (
                        <ReviewsManagement />
                    )}

                    {/* Drivers Fleet View */}
                    {currentView === 'drivers' && <DriversFleetView />}

                    {/* Live Driver Map */}
                    {currentView === 'live-map' && <LiveDriverMap />}
                </div>
            </div >
        </div >
    )
}
