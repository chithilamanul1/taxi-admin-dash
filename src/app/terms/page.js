'use client'

import React from 'react'
import { Shield, CreditCard, Car, RefreshCw, AlertTriangle, Mail, Phone, MapPin, FileText, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-emerald-900 to-emerald-950 pt-32 pb-20">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-widest mb-6">
                        <FileText size={14} />
                        Legal Documentation
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
                        Terms & <span className="text-emerald-400">Conditions</span>
                    </h1>
                    <p className="text-white/70 max-w-2xl mx-auto text-lg">
                        Please read these terms carefully before booking our services.
                    </p>
                </div>

                {/* Content Card */}
                <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
                    {/* Intro */}
                    <div className="bg-emerald-50 p-8 border-b border-emerald-100">
                        <p className="text-emerald-900 text-lg leading-relaxed">
                            Welcome to <strong>AIRPORT TAXIS</strong>. By booking our services, you agree to the following terms and conditions. Please read them carefully.
                        </p>
                    </div>

                    <div className="p-8 md:p-12 space-y-10">
                        {/* Section 1 */}
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                                    <span className="text-emerald-700 font-black">1</span>
                                </div>
                                <h2 className="text-2xl font-bold text-emerald-900">Customer Registration</h2>
                            </div>
                            <div className="pl-13 space-y-3 text-slate-600 leading-relaxed">
                                <p>All customers must register prior to making a payment. The following fields are mandatory:</p>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li>Full Name (as per NIC/Passport)</li>
                                    <li>Residential Address</li>
                                    <li>Contact Number</li>
                                    <li>Email Address</li>
                                    <li>NIC/Passport Number</li>
                                </ul>
                                <p>We may request identity verification before confirming any booking or payment.</p>
                            </div>
                        </section>

                        {/* Section 2 */}
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                                    <CreditCard size={20} className="text-emerald-700" />
                                </div>
                                <h2 className="text-2xl font-bold text-emerald-900">Booking & Payment</h2>
                            </div>
                            <div className="pl-13 space-y-3 text-slate-600 leading-relaxed">
                                <p>Payments are processed securely via the <strong>Sampath Bank Internet Payment Gateway</strong>. The charge will appear as <strong>AIRPORT TAXIS (PVT) LTD</strong> on your card statement.</p>
                                <p>Upon successful payment, a confirmation email will be sent, containing:</p>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li>Customer Name, Address, Contact Details</li>
                                    <li>NIC/Passport Number</li>
                                    <li>Masked card digits (first and last four: e.g. 1234 ** ** 5678)</li>
                                    <li>Transaction Reference Number, Amount, Transaction ID</li>
                                    <li>Transaction Date and Service Description</li>
                                </ul>
                                <p className="text-sm text-slate-500 italic">We securely retain payment confirmations and related communications for a minimum of 8 months.</p>
                            </div>
                        </section>

                        {/* Section 3 */}
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                                    <Car size={20} className="text-emerald-700" />
                                </div>
                                <h2 className="text-2xl font-bold text-emerald-900">Service Delivery (Transport / Pickup)</h2>
                            </div>
                            <div className="pl-13 space-y-3 text-slate-600 leading-relaxed">
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Services are provided only to the verified cardholder or approved passenger; the cardholder must be in the travelling party.</li>
                                    <li>At pickup, staff may verify identity using NIC/Passport.</li>
                                    <li>If the card used for payment cannot be produced when required, the booking may be cancelled and the transaction reversed to the same card.</li>
                                    <li>Trips will be provided only to the address and contact details supplied at booking.</li>
                                    <li>Showroom/office issuance without verification is not allowed.</li>
                                    <li>Customers receive pickup confirmation by email/SMS with driver and vehicle details.</li>
                                </ul>
                            </div>
                        </section>

                        {/* Section 4 - Refund Table */}
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                                    <RefreshCw size={20} className="text-emerald-700" />
                                </div>
                                <h2 className="text-2xl font-bold text-emerald-900">Cancellation & Refunds</h2>
                            </div>
                            <div className="pl-13 space-y-4 text-slate-600 leading-relaxed">
                                <div className="overflow-x-auto">
                                    <table className="w-full border border-slate-200 rounded-xl overflow-hidden">
                                        <thead className="bg-emerald-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-emerald-900 font-bold">Condition</th>
                                                <th className="px-4 py-3 text-left text-emerald-900 font-bold">Refund Eligibility</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            <tr>
                                                <td className="px-4 py-3">Cancellation ≥ 48 hours before pickup</td>
                                                <td className="px-4 py-3 font-bold text-green-600">90% refund</td>
                                            </tr>
                                            <tr className="bg-slate-50">
                                                <td className="px-4 py-3">Cancellation 24–48 hours before pickup</td>
                                                <td className="px-4 py-3 font-bold text-yellow-600">50% refund</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3">Cancellation &lt; 24 hours before pickup or No-show</td>
                                                <td className="px-4 py-3 font-bold text-red-600">No refund</td>
                                            </tr>
                                            <tr className="bg-slate-50">
                                                <td className="px-4 py-3">Transaction errors or duplicate payments (after verification)</td>
                                                <td className="px-4 py-3 font-bold text-green-600">100% refund</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <p>Refunds are issued only to the original card and processed within <strong>5–7 working days</strong>.</p>
                                <p>We reserve the right to cancel bookings suspected of fraud or policy violations.</p>
                            </div>
                        </section>

                        {/* Section 5 */}
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                                    <AlertTriangle size={20} className="text-red-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-emerald-900">Fraud Prevention & Verification</h2>
                            </div>
                            <div className="pl-13 space-y-3 text-slate-600 leading-relaxed">
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>All transactions are monitored for potential fraud.</li>
                                    <li>Staff are prohibited from processing payments on behalf of customers.</li>
                                    <li>Suspicious activity will be reported to Sampath Bank and relevant authorities.</li>
                                    <li>Additional verification (Passport/NIC/booking reference) may be requested.</li>
                                    <li>If cardholder cannot present the payment card where required, the transaction may be reversed.</li>
                                </ul>
                            </div>
                        </section>

                        {/* Section 6 */}
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                                    <Mail size={20} className="text-emerald-700" />
                                </div>
                                <h2 className="text-2xl font-bold text-emerald-900">Communication & Records</h2>
                            </div>
                            <div className="pl-13 space-y-3 text-slate-600 leading-relaxed">
                                <p>Confirmations, invoices, and notifications are sent via email and/or SMS. We retain such communications for at least 8 months. Customers must provide accurate contact details to ensure successful delivery.</p>
                            </div>
                        </section>

                        {/* Sections 7-11 */}
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                                    <span className="text-emerald-700 font-black">7</span>
                                </div>
                                <h2 className="text-2xl font-bold text-emerald-900">Policy Display & Payment Links</h2>
                            </div>
                            <div className="pl-13 space-y-3 text-slate-600 leading-relaxed">
                                <p>Our Refund/Cancellation/Return Policy is displayed clearly on this page and included with any e‑invoice or payment link. By completing payment, you acknowledge and agree to these terms.</p>
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                                    <span className="text-emerald-700 font-black">8</span>
                                </div>
                                <h2 className="text-2xl font-bold text-emerald-900">Overseas & Special Transactions</h2>
                            </div>
                            <div className="pl-13 space-y-3 text-slate-600 leading-relaxed">
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>For overseas cardholders, the cardholder must travel with the party.</li>
                                    <li>Third‑party travelling without the holder is not permitted.</li>
                                    <li>Chargebacks arising from overseas deliveries are borne by the merchant as per card‑scheme rules.</li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                                    <span className="text-emerald-700 font-black">9</span>
                                </div>
                                <h2 className="text-2xl font-bold text-emerald-900">Legal Compliance</h2>
                            </div>
                            <div className="pl-13 space-y-3 text-slate-600 leading-relaxed">
                                <p>We cooperate with Sampath Bank, Visa, MasterCard, and issuing banks in investigating disputes. Legal action may be initiated against fraudulent actors as required.</p>
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                                    <span className="text-emerald-700 font-black">10</span>
                                </div>
                                <h2 className="text-2xl font-bold text-emerald-900">Limitation of Liability</h2>
                            </div>
                            <div className="pl-13 space-y-3 text-slate-600 leading-relaxed">
                                <p>We are not liable for delays due to traffic, weather, or circumstances beyond control; customer negligence; or loss of personal items. Maximum liability for any transaction is limited to the amount paid.</p>
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                                    <Shield size={20} className="text-emerald-700" />
                                </div>
                                <h2 className="text-2xl font-bold text-emerald-900">Privacy Policy</h2>
                            </div>
                            <div className="pl-13 space-y-3 text-slate-600 leading-relaxed">
                                <p>Customer data is collected solely for booking and payment processing and is not shared except as required by law or for transaction verification with Sampath Bank. We do not store sensitive card details on our servers. All card data is processed by Sampath Bank's secure payment gateway.</p>
                            </div>
                        </section>

                        {/* Contact */}
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                                    <span className="text-emerald-700 font-black">12</span>
                                </div>
                                <h2 className="text-2xl font-bold text-emerald-900">Contact</h2>
                            </div>
                            <div className="bg-emerald-50 rounded-2xl p-6 mt-4">
                                <h3 className="font-bold text-emerald-900 text-lg mb-2">AIRPORT TAXIS (PVT) LTD</h3>
                                <p className="text-sm text-emerald-700 mb-4">Reg. No: PV 00342552</p>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3 text-slate-600">
                                        <MapPin size={18} className="text-emerald-600 shrink-0 mt-1" />
                                        <span>118/5 St. Joseph Street, Grandpass, Colombo 14</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <Phone size={18} className="text-emerald-600" />
                                        <a href="tel:+94722885885" className="hover:text-emerald-600">+94 722 885 885</a>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <Mail size={18} className="text-emerald-600" />
                                        <a href="mailto:info@airporttaxi.lk" className="hover:text-emerald-600">info@airporttaxi.lk</a>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Agreement */}
                        <section className="border-t border-slate-200 pt-8">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                    <CheckCircle size={20} className="text-green-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-emerald-900">Agreement</h2>
                            </div>
                            <div className="bg-emerald-900 text-white rounded-2xl p-6">
                                <p className="leading-relaxed">
                                    By proceeding with booking and payment, you confirm that you have read, understood, and agree to these <strong>Terms & Conditions</strong> and the <strong>Refund/Cancellation Policy</strong>.
                                </p>
                                <p className="mt-4 text-emerald-300">
                                    Thank you for choosing Airport Taxis (Pvt) Ltd. We look forward to serving you!
                                </p>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="text-center mt-12">
                    <Link href="/" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-900 rounded-2xl font-bold shadow-lg hover:bg-emerald-50 transition-all">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </main>
    )
}
