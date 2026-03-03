'use client'

import React from 'react'
import { Shield, Eye, Lock, Database, Mail, Phone, MapPin, FileText } from 'lucide-react'
import Link from 'next/link'

export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-emerald-900 to-emerald-950 pt-32 pb-20">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-widest mb-6">
                        <Shield size={14} />
                        Legal Documentation
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
                        Privacy <span className="text-emerald-400">Policy</span>
                    </h1>
                    <p className="text-white/70 max-w-2xl mx-auto">
                        Last updated: January 2026
                    </p>
                </div>

                {/* Content */}
                <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
                    <div className="bg-emerald-50 p-8 border-b border-emerald-100">
                        <p className="text-emerald-900 text-lg leading-relaxed">
                            <strong>AIRPORT TAXIS (PVT) LTD</strong> ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information.
                        </p>
                    </div>

                    <div className="p-8 md:p-12 space-y-10">
                        {/* Section 1 */}
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                                    <Database size={20} className="text-emerald-700" />
                                </div>
                                <h2 className="text-2xl font-bold text-emerald-900">Information We Collect</h2>
                            </div>
                            <div className="space-y-4 text-slate-600 leading-relaxed">
                                <p><strong>Personal Information:</strong></p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Full name (as per NIC/Passport)</li>
                                    <li>Email address</li>
                                    <li>Phone number</li>
                                    <li>Residential address</li>
                                    <li>NIC/Passport number (for verification)</li>
                                </ul>
                                <p><strong>Booking Information:</strong></p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Pickup and drop-off locations</li>
                                    <li>Travel dates and times</li>
                                    <li>Vehicle preferences</li>
                                    <li>Special requests</li>
                                </ul>
                                <p><strong>Payment Information:</strong></p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Masked card details (first and last 4 digits only)</li>
                                    <li>Transaction references</li>
                                    <li>Payment confirmations</li>
                                </ul>
                                <p className="text-sm italic text-slate-500">Note: Full card details are processed securely by Sampath Bank and never stored on our servers.</p>
                            </div>
                        </section>

                        {/* Section 2 */}
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                                    <Eye size={20} className="text-emerald-700" />
                                </div>
                                <h2 className="text-2xl font-bold text-emerald-900">How We Use Your Information</h2>
                            </div>
                            <div className="space-y-3 text-slate-600 leading-relaxed">
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>To process and fulfill your bookings</li>
                                    <li>To communicate booking confirmations and updates</li>
                                    <li>To verify customer identity for fraud prevention</li>
                                    <li>To process payments securely</li>
                                    <li>To improve our services and customer experience</li>
                                    <li>To respond to customer inquiries and support requests</li>
                                    <li>To comply with legal obligations</li>
                                </ul>
                            </div>
                        </section>

                        {/* Section 3 */}
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                                    <Lock size={20} className="text-emerald-700" />
                                </div>
                                <h2 className="text-2xl font-bold text-emerald-900">Data Security</h2>
                            </div>
                            <div className="space-y-3 text-slate-600 leading-relaxed">
                                <p>We implement industry-standard security measures:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>SSL/TLS encryption for all data transmission</li>
                                    <li>Secure payment processing via Sampath Bank gateway</li>
                                    <li>Limited access to personal data on a need-to-know basis</li>
                                    <li>Regular security audits and monitoring</li>
                                    <li>Secure data storage with encryption</li>
                                </ul>
                            </div>
                        </section>

                        {/* Section 4 */}
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                                    <FileText size={20} className="text-emerald-700" />
                                </div>
                                <h2 className="text-2xl font-bold text-emerald-900">Data Retention</h2>
                            </div>
                            <div className="space-y-3 text-slate-600 leading-relaxed">
                                <p>We retain your information for the following periods:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li><strong>Booking records:</strong> 2 years</li>
                                    <li><strong>Payment confirmations:</strong> Minimum 8 months (as required)</li>
                                    <li><strong>Communication records:</strong> 8 months</li>
                                    <li><strong>Account information:</strong> Until account deletion requested</li>
                                </ul>
                            </div>
                        </section>

                        {/* Section 5 */}
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                                    <Shield size={20} className="text-emerald-700" />
                                </div>
                                <h2 className="text-2xl font-bold text-emerald-900">Your Rights</h2>
                            </div>
                            <div className="space-y-3 text-slate-600 leading-relaxed">
                                <p>You have the right to:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Access your personal data</li>
                                    <li>Request correction of inaccurate data</li>
                                    <li>Request deletion of your data (subject to legal requirements)</li>
                                    <li>Opt-out of marketing communications</li>
                                    <li>Request a copy of your data</li>
                                </ul>
                                <p>To exercise these rights, contact us at <a href="mailto:info@airporttaxi.lk" className="text-emerald-600 hover:underline">info@airporttaxi.lk</a></p>
                            </div>
                        </section>

                        {/* Section 6 */}
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                                    <span className="text-emerald-700 font-black">6</span>
                                </div>
                                <h2 className="text-2xl font-bold text-emerald-900">Third-Party Sharing</h2>
                            </div>
                            <div className="space-y-3 text-slate-600 leading-relaxed">
                                <p>We do not sell your personal data. We may share information with:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li><strong>Sampath Bank:</strong> For payment processing</li>
                                    <li><strong>Our drivers:</strong> Limited info required to complete your trip</li>
                                    <li><strong>Legal authorities:</strong> When required by law</li>
                                </ul>
                            </div>
                        </section>

                        {/* Contact */}
                        <section className="bg-emerald-50 rounded-2xl p-6">
                            <h3 className="font-bold text-emerald-900 text-lg mb-4">Contact Us About Privacy</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-slate-600">
                                    <Mail size={18} className="text-emerald-600" />
                                    <a href="mailto:info@airporttaxi.lk" className="hover:text-emerald-600">info@airporttaxi.lk</a>
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
                    <Link href="/refund-policy" className="px-6 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-colors">
                        Refund Policy
                    </Link>
                    <Link href="/" className="px-6 py-3 bg-white text-emerald-900 rounded-xl font-bold hover:bg-emerald-50 transition-colors">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </main>
    )
}
