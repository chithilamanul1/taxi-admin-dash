'use client';

import { useState } from 'react';
import { CreditCard, User, Mail, Phone, MapPin, Calendar, Clock, Link as LinkIcon, Check, Copy, Loader2, Send, FileText, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function InvoiceManager() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [copied, setCopied] = useState(false);
    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        pickupAddress: '',
        dropoffAddress: '',
        amount: '',
        currency: 'LKR',
        paymentType: 'full',
        scheduledDate: '',
        scheduledTime: '',
        notes: ''
    });

    const handleCreate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);
        try {
            const res = await fetch('/api/admin/bookings/manual', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.success) {
                setResult(data);
            } else {
                alert(data.message || 'Failed to create booking');
            }
        } catch (err) {
            console.error(err);
            alert('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (result?.paymentLink) {
            navigator.clipboard.writeText(result.paymentLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        const primaryColor = '#059669'; // Emerald 600

        // Header
        doc.setFillColor(5, 150, 105);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('AIRPORT TAXIS PVT (LTD)', 20, 25);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('Sri Lanka\'s Premium 24/7 Transport Service', 20, 32);

        // Invoice Details
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('INVOICE', 20, 55);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 55);
        doc.text(`Invoice #: AT-${Math.floor(1000 + Math.random() * 9000)}`, 150, 60);

        // Customer Info
        doc.setFont('helvetica', 'bold');
        doc.text('BILL TO:', 20, 75);
        doc.setFont('helvetica', 'normal');
        doc.text(formData.customerName, 20, 82);
        if (formData.customerEmail) doc.text(formData.customerEmail, 20, 87);
        if (formData.customerPhone) doc.text(formData.customerPhone, 20, 92);

        // Trip Info
        doc.setFont('helvetica', 'bold');
        doc.text('TRIP DETAILS:', 110, 75);
        doc.setFont('helvetica', 'normal');
        if (formData.pickupAddress) doc.text(`From: ${formData.pickupAddress}`, 110, 82);
        if (formData.dropoffAddress) doc.text(`To: ${formData.dropoffAddress}`, 110, 87);
        if (formData.scheduledDate) doc.text(`Date: ${formData.scheduledDate} ${formData.scheduledTime}`, 110, 92);

        // Table
        doc.autoTable({
            startY: 110,
            head: [['Description', 'Quantity', 'Price', 'Total']],
            body: [
                ['Airport Transfer / Private Tour Service', '1', `${formData.currency} ${formData.amount}`, `${formData.currency} ${formData.amount}`],
            ],
            headStyles: { fillColor: [5, 150, 105] },
            theme: 'striped'
        });

        // Summary
        const finalY = doc.lastAutoTable.finalY + 10;
        doc.setFont('helvetica', 'bold');
        doc.text('TOTAL AMOUNT:', 140, finalY + 10);
        doc.setFontSize(16);
        doc.setTextColor(5, 150, 105);
        doc.text(`${formData.currency} ${formData.amount}`, 140, finalY + 20);

        // Payment Link
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text('PAYMENT LINK:', 20, finalY + 40);
        doc.setTextColor(5, 150, 105);
        doc.text(result.paymentLink, 20, finalY + 45);

        // Footer
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text('Thank you for choosing Airport Taxis Sri Lanka.', 105, 280, null, null, 'center');
        doc.text('Web: airporttaxis.lk | Tel: +94 71 688 5880', 105, 285, null, null, 'center');

        doc.save(`Invoice_${formData.customerName.replace(/\s+/g, '_')}.pdf`);
    };

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-white/10 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-slate-600">
                        <FileText size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Create Manual Invoice</h2>
                        <p className="text-xs text-slate-500">Generate a custom payment link for a customer</p>
                    </div>
                </div>

                <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Customer Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    required
                                    type="text"
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                                    placeholder="John Doe"
                                    value={formData.customerName}
                                    onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        type="email"
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none"
                                        placeholder="john@example.com"
                                        value={formData.customerEmail}
                                        onChange={e => setFormData({ ...formData, customerEmail: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Phone/WhatsApp</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        type="text"
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none"
                                        placeholder="+94 7X XXX XXXX"
                                        value={formData.customerPhone}
                                        onChange={e => setFormData({ ...formData, customerPhone: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Pickup Address (Optional)</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="text"
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none"
                                    placeholder="Enter pickup location"
                                    value={formData.pickupAddress}
                                    onChange={e => setFormData({ ...formData, pickupAddress: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Dropoff Address (Optional)</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="text"
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none"
                                    placeholder="Enter dropoff location"
                                    value={formData.dropoffAddress}
                                    onChange={e => setFormData({ ...formData, dropoffAddress: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Amount</label>
                                <div className="relative">
                                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        required
                                        type="number"
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none font-bold"
                                        placeholder="0.00"
                                        value={formData.amount}
                                        onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Currency</label>
                                <select
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none font-bold"
                                    value={formData.currency}
                                    onChange={e => setFormData({ ...formData, currency: e.target.value })}
                                >
                                    <option value="LKR">LKR (Rs)</option>
                                    <option value="USD">USD ($)</option>
                                    <option value="EUR">EUR (€)</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Payment Type</label>
                            <div className="flex gap-2">
                                {[
                                    { id: 'full', label: 'Full (100%)' },
                                    { id: 'partial', label: 'Half (50%)' },
                                    { id: 'custom', label: 'Custom' }
                                ].map((type) => (
                                    <button
                                        key={type.id}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, paymentType: type.id })}
                                        className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border ${formData.paymentType === type.id ? 'bg-slate-600 border-slate-600 text-white' : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-slate-800 text-slate-400'}`}
                                    >
                                        {type.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {formData.paymentType === 'custom' && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-1"
                            >
                                <label className="text-[10px] font-bold text-amber-500 uppercase tracking-widest pl-1">Custom Payment Amount ({formData.currency})</label>
                                <div className="relative">
                                    <Zap className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" size={16} />
                                    <input
                                        required
                                        type="number"
                                        className="w-full pl-10 pr-4 py-3 bg-amber-500/5 border border-amber-500/20 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none font-bold text-amber-600"
                                        placeholder="Enter manual payment amount"
                                        value={formData.customAmount || ''}
                                        onChange={e => setFormData({ ...formData, customAmount: e.target.value })}
                                    />
                                </div>
                                <p className="text-[9px] text-amber-600/70 pl-1 italic">* This is the amount the customer will pay now.</p>
                            </motion.div>
                        )}


                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        type="date"
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none"
                                        value={formData.scheduledDate}
                                        onChange={e => setFormData({ ...formData, scheduledDate: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Time</label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        type="time"
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none"
                                        value={formData.scheduledTime}
                                        onChange={e => setFormData({ ...formData, scheduledTime: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Admin Notes</label>
                            <textarea
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none resize-none h-20"
                                placeholder="Additional details for the admin..."
                                value={formData.notes}
                                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                            ></textarea>
                        </div>
                    </div>

                    <div className="md:col-span-2 pt-4">
                        <button
                            disabled={loading}
                            className="w-full py-4 bg-slate-600 hover:bg-slate-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-amber-500/20"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
                            {loading ? 'Creating...' : 'Generate Payment Link'}
                        </button>
                    </div>
                </form>

                <AnimatePresence>
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-8 p-6 bg-slate-900 border border-slate-800 rounded-3xl text-white space-y-4 overflow-hidden"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-amber-400">Success! Payment Link Ready</h3>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="text-[10px] font-bold px-2 py-1 bg-amber-500/10 text-amber-500 rounded-lg">
                                        Total: {formData.currency} {formData.amount}
                                    </span>
                                    <span className="text-[14px] font-black px-3 py-1 bg-amber-500 text-white rounded-lg shadow-lg shadow-amber-500/20">
                                        Pay Now: {formData.currency} {
                                            formData.paymentType === 'full' ? formData.amount :
                                                formData.paymentType === 'partial' ? (formData.amount / 2).toFixed(2) :
                                                    formData.customAmount || '0.00'
                                        }
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 bg-white/5 p-4 rounded-xl border border-white/10 group">
                                <LinkIcon size={16} className="text-slate-500" />
                                <span className="flex-1 text-xs font-medium text-slate-300 truncate">{result.paymentLink}</span>
                                <button
                                    onClick={copyToClipboard}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-amber-400"
                                >
                                    {copied ? <Check size={18} /> : <Copy size={18} />}
                                </button>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => {
                                        const url = `https://wa.me/?text=${encodeURIComponent(`Hi ${formData.customerName}, here is your invoice for ${formData.currency} ${formData.amount}: ${result.paymentLink}`)}`;
                                        window.open(url, '_blank');
                                    }}
                                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold border border-white/10 flex items-center justify-center gap-2 transition-all"
                                >
                                    <Send size={14} /> Send via WhatsApp
                                </button>
                                <button
                                    onClick={handleDownloadPDF}
                                    className="px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold border border-white/10 flex items-center justify-center gap-2 transition-all"
                                >
                                    <FileText size={14} /> Download PDF
                                </button>
                                <button className="flex-1 py-3 bg-slate-600 hover:bg-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-slate-600/20">
                                    <Mail size={14} /> Email Invoice
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
