'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Car, Loader2, Phone, Lock, ChevronRight } from 'lucide-react';

export default function DriverLogin() {
    const router = useRouter();
    const [phone, setPhone] = useState('');
    const [pin, setPin] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/drivers/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, pin })
            });
            const data = await res.json();

            if (res.ok && data.success) {
                localStorage.setItem('driver_id', data.driver.id);
                router.push('/driver');
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            console.error(err);
            setError('Connection error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-emerald-900 p-8 text-center">
                    <div className="w-20 h-20 bg-emerald-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Car size={40} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Driver Portal</h1>
                    <p className="text-emerald-300 text-sm mt-1">Airport Taxi Tours Sri Lanka</p>
                </div>

                <div className="p-8">
                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-6 flex items-center justify-center font-bold">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="tel"
                                    placeholder="0771234567"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none transition-all font-bold text-gray-800"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Driver PIN</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="password"
                                    placeholder="••••"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none transition-all font-bold text-gray-800"
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value)}
                                    required
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-2 text-right">Default PIN is last 4 digits of phone</p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !phone || !pin}
                            className="w-full bg-emerald-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 size={24} className="animate-spin" /> : <>Login <ChevronRight /></>}
                        </button>
                    </form>
                </div>
                <div className="bg-slate-50 p-4 text-center text-xs text-gray-400">
                    &copy; 2026 Airport Taxi Tours. Driver App v1.0
                </div>
            </div>
        </div>
    );
}
