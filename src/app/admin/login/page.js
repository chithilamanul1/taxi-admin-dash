'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            console.log('Login response status:', res.status);
            const data = await res.json();
            console.log('Login response data:', data);

            if (res.ok) {
                console.log('Login successful, redirecting to /admin...');
                // Redirect to dashboard
                router.push('/admin');
            } else {
                console.warn('Login failed:', data.message);
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-emerald-900">Admin Portal</h1>
                    <p className="text-slate-500">Sign in to manage bookings</p>
                </div>

                {error && (
                    <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600/20"
                            placeholder="admin@example.com"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600/20"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-emerald-600 py-3 font-bold text-emerald-900 transition-colors hover:bg-yellow-500 disabled:opacity-50"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>

                    <div className="text-center text-xs text-slate-400 mt-4">
                        Secure Authentication System
                    </div>
                </form>
            </div>
        </div>
    );
}
