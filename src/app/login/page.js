'use client'

import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, User, Loader2 } from 'lucide-react'

function LoginContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl') || '/'
    const [isLoading, setIsLoading] = useState(false)
    const [isLoginView, setIsLoginView] = useState(true)
    const [errorMsg, setErrorMsg] = useState('')

    // Form states
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleGoogleSignIn = async () => {
        setIsLoading(true)
        await signIn('google', { callbackUrl })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setErrorMsg('')

        if (isLoginView) {
            // Log In
            const res = await signIn('credentials', {
                email,
                password,
                redirect: false,
                callbackUrl
            })

            if (res?.error) {
                setErrorMsg('Invalid email or password')
                setIsLoading(false)
            } else if (res?.url) {
                router.push(res.url)
            }
        } else {
            // Sign Up
            try {
                const res = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password })
                })
                const data = await res.json()

                if (!res.ok) {
                    setErrorMsg(data.message || 'Registration failed')
                    setIsLoading(false)
                    return
                }

                // If registration success, log them in automatically
                const signInRes = await signIn('credentials', {
                    email,
                    password,
                    redirect: false,
                    callbackUrl
                })

                if (signInRes?.error) {
                    setErrorMsg('Account created but login failed. Please sign in.')
                    setIsLoginView(true)
                } else if (signInRes?.url) {
                    router.push(signInRes.url)
                }
            } catch (err) {
                setErrorMsg('An error occurred during registration')
            }
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 to-emerald-900 p-6">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block">
                        <h1 className="text-3xl font-bold text-white">Airport <span className="text-emerald-600">Taxis</span></h1>
                        <p className="text-white/60 text-sm mt-1">Sri Lanka's Premium Transfer Service</p>
                    </Link>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-200">
                        <button 
                            onClick={() => { setIsLoginView(true); setErrorMsg(''); }}
                            className={`flex-1 py-4 text-sm font-bold transition-colors ${isLoginView ? 'text-emerald-700 border-b-2 border-emerald-600 bg-emerald-50/50' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            Sign In
                        </button>
                        <button 
                            onClick={() => { setIsLoginView(false); setErrorMsg(''); }}
                            className={`flex-1 py-4 text-sm font-bold transition-colors ${!isLoginView ? 'text-emerald-700 border-b-2 border-emerald-600 bg-emerald-50/50' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            Sign Up
                        </button>
                    </div>

                    <div className="p-8">
                        <h2 className="text-2xl font-bold text-emerald-900 text-center mb-2">
                            {isLoginView ? 'Welcome Back' : 'Create an Account'}
                        </h2>
                        <p className="text-gray-500 text-center text-sm mb-6">
                            {isLoginView ? 'Sign in to view your bookings and history' : 'Register to manage your rides easily'}
                        </p>

                        {errorMsg && (
                            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100 text-center">
                                {errorMsg}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                            {!isLoginView && (
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <input
                                            required
                                            type="text"
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                                            placeholder="John Doe"
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        required
                                        type="email"
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                                        placeholder="john@example.com"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        required
                                        type="password"
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-3.5 rounded-xl font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50 shadow-lg shadow-emerald-500/20 mt-2"
                            >
                                {isLoading ? <Loader2 className="animate-spin" size={18} /> : null}
                                {isLoginView ? 'Sign In' : 'Create Account'}
                            </button>
                        </form>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-400">or</span>
                            </div>
                        </div>

                        {/* Google Sign In */}
                        <button
                            onClick={handleGoogleSignIn}
                            disabled={isLoading}
                            type="button"
                            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-700 px-6 py-3.5 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 mb-4"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continue with Google
                        </button>

                        {/* Guest Option */}
                        <Link
                            href="/"
                            className="block w-full text-center bg-[#FACC15] text-emerald-950 px-6 py-3.5 rounded-xl font-bold hover:bg-yellow-400 transition-colors shadow-lg"
                        >
                            Continue as Guest
                        </Link>

                        <p className="text-center text-gray-400 text-xs mt-6">
                            By signing in, you agree to our{' '}
                            <Link href="/terms" className="text-emerald-600 hover:underline">Terms of Service</Link>
                        </p>
                    </div>
                </div>

                {/* Back to Home */}
                <p className="text-center mt-6">
                    <Link href="/" className="text-white/60 hover:text-white text-sm">
                        ← Back to Home
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-emerald-900 text-white">Loading...</div>}>
            <LoginContent />
        </Suspense>
    )
}
