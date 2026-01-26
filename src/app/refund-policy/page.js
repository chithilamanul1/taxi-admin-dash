'use client'

import React from 'react'
import { RefreshCw, Clock, AlertCircle, CheckCircle, XCircle, Mail, Phone, MapPin, CreditCard } from 'lucide-react'
import Link from 'next/link'

export default function RefundPolicyPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-emerald-900 to-emerald-950 pt-32 pb-20">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-widest mb-6">
                        <RefreshCw size={14} />
                        Legal Documentation
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
                        Refund <span className="text-emerald-400">Policy</span>
                    </h1>
                    <p className="text-white/70 max-w-2xl mx-auto">
                        Our cancellation and refund terms for your peace of mind.
                    </p>
                </div>

                {/* Content */}
                <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
                    <div className="bg-emerald-50 p-8 border-b border-emerald-100">
                        <p className="text-emerald-900 text-lg leading-relaxed">
                            At <strong>Airport Taxis (Pvt) Ltd</strong>, we understand plans can change. This policy outlines our fair and transparent cancellation and refund procedures.
                        </p>
                    </div>

                    <div className="p-8 md:p-12 space-y-10">
                        {/* Refund Table */}
                        <section>
                            <h2 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center gap-3">
                                <Clock size={24} className="text-emerald-600" />
                                Cancellation Timeframes & Refunds
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full border border-slate-200 rounded-xl overflow-hidden">
                                    <thead className="bg-emerald-800 text-white">
                                        <tr>
                                            <th className="px-6 py-4 text-left font-bold">Cancellation Timing</th>
                                            <th className="px-6 py-4 text-left font-bold">Refund Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        <tr className="bg-green-50">
                                            <td className="px-6 py-4 flex items-center gap-3">
                                                <CheckCircle size={20} className="text-green-600" />
                                                <span><strong>48+ hours</strong> before pickup</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-2xl font-black text-green-600">90%</span>
                                                <span className="text-slate-500 ml-2">refund</span>
                                            </td>
                                        </tr>
                                        <tr className="bg-yellow-50">
                                            <td className="px-6 py-4 flex items-center gap-3">
                                                <AlertCircle size={20} className="text-yellow-600" />
                                                <span><strong>24-48 hours</strong> before pickup</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-2xl font-black text-yellow-600">50%</span>
                                                <span className="text-slate-500 ml-2">refund</span>
                                            </td>
                                        </tr>
                                        <tr className="bg-red-50">
                                            <td className="px-6 py-4 flex items-center gap-3">
                                                <XCircle size={20} className="text-red-600" />
                                                <span><strong>Less than 24 hours</strong> or No-show</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-2xl font-black text-red-600">0%</span>
                                                <span className="text-slate-500 ml-2">no refund</span>
                                            </td>
                                        </tr>
                                        <tr className="bg-emerald-50">
                                            <td className="px-6 py-4 flex items-center gap-3">
                                                <RefreshCw size={20} className="text-emerald-600" />
                                                <span><strong>Transaction errors</strong> / duplicate payments</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-2xl font-black text-emerald-600">100%</span>
                                                <span className="text-slate-500 ml-2">refund</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* How to Cancel */}
                        <section>
                            <h2 className="text-2xl font-bold text-emerald-900 mb-4">How to Request a Cancellation</h2>
                            <div className="bg-slate-50 rounded-2xl p-6">
                                <ol className="space-y-4">
                                    <li className="flex gap-4">
                                        <span className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold shrink-0">1</span>
                                        <div>
                                            <p className="font-bold text-slate-900">Contact Us</p>
                                            <p className="text-slate-600">Email us at <a href="mailto:airporttaxis.lk@gmail.com" className="text-emerald-600">airporttaxis.lk@gmail.com</a> or call <a href="tel:+94722885885" className="text-emerald-600">+94 722 885 885</a></p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <span className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold shrink-0">2</span>
                                        <div>
                                            <p className="font-bold text-slate-900">Provide Booking Details</p>
                                            <p className="text-slate-600">Include your booking reference number and registered email</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <span className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold shrink-0">3</span>
                                        <div>
                                            <p className="font-bold text-slate-900">Receive Confirmation</p>
                                            <p className="text-slate-600">We'll send you a cancellation confirmation email within 24 hours</p>
                                        </div>
                                    </li>
                                </ol>
                            </div>
                        </section>

                        {/* Refund Process */}
                        <section>
                            <h2 className="text-2xl font-bold text-emerald-900 mb-4 flex items-center gap-3">
                                <CreditCard size={24} className="text-emerald-600" />
                                Refund Processing
                            </h2>
                            <div className="space-y-4 text-slate-600 leading-relaxed">
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                    <p className="flex items-start gap-3">
                                        <AlertCircle size={20} className="text-amber-600 shrink-0 mt-1" />
                                        <span><strong>Important:</strong> Refunds are issued only to the original card used for payment.</span>
                                    </p>
                                </div>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Refunds are processed within <strong>5-7 working days</strong> after approval</li>
                                    <li>Bank processing times may vary (typically 3-5 additional days)</li>
                                    <li>International cards may take up to 14 days</li>
                                    <li>A confirmation email will be sent when refund is initiated</li>
                                </ul>
                            </div>
                        </section>

                        {/* Non-Refundable */}
                        <section>
                            <h2 className="text-2xl font-bold text-emerald-900 mb-4">Non-Refundable Situations</h2>
                            <div className="space-y-3 text-slate-600">
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>No-show without prior cancellation</li>
                                    <li>Cancellation less than 24 hours before pickup</li>
                                    <li>Services already rendered (trip completed)</li>
                                    <li>Bookings cancelled due to fraud or policy violations</li>
                                    <li>Customer-initiated changes after pickup has begun</li>
                                </ul>
                            </div>
                        </section>

                        {/* Special Circumstances */}
                        <section>
                            <h2 className="text-2xl font-bold text-emerald-900 mb-4">Special Circumstances</h2>
                            <div className="space-y-3 text-slate-600 leading-relaxed">
                                <p>We may offer full refunds in exceptional cases:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Flight cancellations (with proof)</li>
                                    <li>Medical emergencies (with documentation)</li>
                                    <li>Service failure on our part</li>
                                    <li>Natural disasters or government-mandated restrictions</li>
                                </ul>
                                <p className="text-sm italic">Each case is reviewed individually. Contact us with supporting documentation.</p>
                            </div>
                        </section>

                        {/* Contact */}
                        <section className="bg-emerald-50 rounded-2xl p-6">
                            <h3 className="font-bold text-emerald-900 text-lg mb-4">Need Help with a Refund?</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-slate-600">
                                    <Mail size={18} className="text-emerald-600" />
                                    <a href="mailto:airporttaxis.lk@gmail.com" className="hover:text-emerald-600">airporttaxis.lk@gmail.com</a>
                                </div>
                                <div className="flex items-center gap-3 text-slate-600">
                                    <Phone size={18} className="text-emerald-600" />
                                    <a href="tel:+94722885885" className="hover:text-emerald-600">+94 722 885 885</a>
                                </div>
                                <div className="flex items-start gap-3 text-slate-600">
                                    <MapPin size={18} className="text-emerald-600 shrink-0 mt-1" />
                                    <span>118/5 St. Joseph Street, Grandpass, Colombo 14</span>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Navigation */}
                <div className="max-w-4xl mx-auto mt-8 flex flex-wrap justify-center gap-4">
                    <Link href="/terms" className="px-6 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-colors">
                        Terms & Conditions
                    </Link>
                    <Link href="/privacy-policy" className="px-6 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-colors">
                        Privacy Policy
                    </Link>
                    <Link href="/" className="px-6 py-3 bg-white text-emerald-900 rounded-xl font-bold hover:bg-emerald-50 transition-colors">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </main>
    )
}
