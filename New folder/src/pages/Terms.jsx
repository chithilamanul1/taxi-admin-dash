import React from 'react'

const Terms = () => {
    return (
        <div className="pb-20">
            {/* Header */}
            <div className="bg-navy py-16 md:py-24 text-center px-4">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Terms <span className="text-gold">& Conditions</span></h1>
                <p className="text-white/60 max-w-2xl mx-auto">Please read our terms and conditions carefully before booking.</p>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="prose prose-lg prose-slate max-w-none">
                    <p className="lead">
                        Welcome to AIRPORT TAXI booking our services, you agree to the following terms and conditions.
                    </p>

                    <h3 className="text-navy font-bold mt-8 mb-4">1. Customer Registration</h3>
                    <p>
                        All customers must register prior to making a payment. The following fields are mandatory: Full Name (as per NIC/Passport), Residential Address, Contact Number, Email Address, and NIC/Passport Number. We may request identity verification before confirming any booking or payment.
                    </p>

                    <h3 className="text-navy font-bold mt-8 mb-4">2. Booking & Payment</h3>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Payments are processed securely via the Sampath Bank Internet Payment Gateway. The charge will appear as AIRPORT TAXIS (PVT) LTD on your card statement.</li>
                        <li>Upon successful payment, a confirmation email will be sent, containing: Customer Name, Address, Contact Details, NIC/Passport Number, masked card digits (first and last four: e.g. 1234 ** ** 5678 ), Transaction Reference Number, Amount, Transaction ID, Transaction Date, and Service Description.</li>
                        <li>We securely retain payment confirmations and related communications for a minimum of 8 months.</li>
                    </ul>

                    <h3 className="text-navy font-bold mt-8 mb-4">3. Service Delivery (Transport / Pickup)</h3>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Services are provided only to the verified cardholder or approved passenger; the cardholder must be in the travelling party.</li>
                        <li>At pickup, staff may verify identity using NIC/Passport. If the card used for payment cannot be produced when required, the booking may be cancelled and the transaction reversed to the same card.</li>
                        <li>Trips will be provided only to the address and contact details supplied at booking. Showroom/office issuance without verification is not allowed.</li>
                        <li>Customers receive pickup confirmation by email/SMS with driver and vehicle details.</li>
                    </ul>

                    <h3 className="text-navy font-bold mt-8 mb-4">4. Cancellation & Refunds</h3>
                    <div className="overflow-x-auto my-6">
                        <table className="min-w-full text-left text-sm whitespace-nowrap">
                            <thead className="uppercase tracking-wider border-b-2 border-gray-200 bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4">Condition</th>
                                    <th className="px-6 py-4">Refund Eligibility</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <tr className="bg-white">
                                    <td className="px-6 py-4">Cancellation ≥ 48 hours before pickup</td>
                                    <td className="px-6 py-4 font-bold text-green-600">90% refund</td>
                                </tr>
                                <tr className="bg-gray-50">
                                    <td className="px-6 py-4">Cancellation 24–48 hours before pickup</td>
                                    <td className="px-6 py-4 font-bold text-yellow-600">50% refund</td>
                                </tr>
                                <tr className="bg-white">
                                    <td className="px-6 py-4">Cancellation &lt; 24 hours before pickup or No-show</td>
                                    <td className="px-6 py-4 font-bold text-red-600">No refund</td>
                                </tr>
                                <tr className="bg-gray-50">
                                    <td className="px-6 py-4">Transaction errors or duplicate payments (after verification)</td>
                                    <td className="px-6 py-4 font-bold text-green-600">100% refund</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p>
                        Refunds are issued only to the original card and processed within 5–7 working days. We reserve the right to cancel bookings suspected of fraud or policy violations.
                    </p>

                    <h3 className="text-navy font-bold mt-8 mb-4">5. Fraud Prevention & Verification</h3>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>All transactions are monitored for potential fraud. Staff are prohibited from processing payments on behalf of customers.</li>
                        <li>Suspicious activity will be reported to Sampath Bank and relevant authorities. Additional verification (Passport/NIC/booking reference) may be requested.</li>
                        <li>If cardholder cannot present the payment card where required, the transaction may be reversed.</li>
                    </ul>

                    <h3 className="text-navy font-bold mt-8 mb-4">6. Communication & Records</h3>
                    <p>
                        Confirmations, invoices, and notifications are sent via email and/or SMS. We retain such communications for at least 8 months. Customers must provide accurate contact details to ensure successful delivery.
                    </p>

                    <h3 className="text-navy font-bold mt-8 mb-4">7. Policy Display & Payment Links</h3>
                    <p>
                        Our Refund/Cancellation/Return Policy is displayed clearly on this page and included with any e‑invoice or payment link. By completing payment, you acknowledge and agree to these terms.
                    </p>

                    <h3 className="text-navy font-bold mt-8 mb-4">8. Overseas & Special Transactions</h3>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>For overseas cardholders, the cardholder must travel with the party. Third‑party travelling without the holder is not permitted.</li>
                        <li>Chargebacks arising from overseas deliveries are borne by the merchant as per card‑scheme rules.</li>
                    </ul>

                    <h3 className="text-navy font-bold mt-8 mb-4">9. Legal Compliance</h3>
                    <p>
                        We cooperate with Sampath Bank, Visa, MasterCard, and issuing banks in investigating disputes. Legal action maybe initiated against fraudulent actors as required.
                    </p>

                    <h3 className="text-navy font-bold mt-8 mb-4">10. Limitation of Liability</h3>
                    <p>
                        We are not liable for delays due to traffic, weather, or circumstances beyond control; customer negligence; or loss of personal items. Maximum liability for any transaction is limited to the amount paid.
                    </p>

                    <h3 className="text-navy font-bold mt-8 mb-4">11. Privacy Policy</h3>
                    <p>
                        Customer data is collected solely for booking and payment processing and is not shared except as required by law or for transaction verification with Sampath Bank. We do not store sensitive card details on our servers. All card data is processed by Sampath Bank’s secure payment gateway.
                    </p>

                    <h3 className="text-navy font-bold mt-8 mb-4">12. Contact</h3>
                    <div className="bg-slate-50 p-6 rounded-xl border border-gray-100">
                        <p className="font-bold text-navy">AIRPORT TAXIS (PVT) LTD</p>
                        <p className="text-sm text-gray-600">Reg. No: PV 00342552</p>
                        <p className="text-sm text-gray-600 mt-2">118/5 ST JOSEPH STREET , GRANDPASS , COLOMBO 14</p>
                        <p className="text-sm text-gray-600 mt-1">Phone: +94 722 885 885 · Email: airporttaxis.lk@gmail.com</p>
                    </div>

                    <h3 className="text-navy font-bold mt-8 mb-4">13. Agreement</h3>
                    <p>
                        By proceeding with booking and payment, you confirm that you have read, understood, and agree to these Terms & Conditions and the Refund/Cancellation Policy.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Terms
