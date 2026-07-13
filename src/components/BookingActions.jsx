'use client';

import { useState } from 'react';
import { Download, Mail, MessageSquare, Loader2, X, AlertTriangle } from 'lucide-react';
import { generateBookingPDF } from '@/lib/pdfGenerator';

export default function BookingActions({ booking }) {
    const [emailLoading, setEmailLoading] = useState(false);
    const [ticketOpen, setTicketOpen] = useState(false);
    const [ticketForm, setTicketForm] = useState({ subject: '', message: '', priority: 'medium' });
    const [ticketLoading, setTicketLoading] = useState(false);

    // 1. Download PDF
    const handleDownloadPDF = () => {
        generateBookingPDF(booking);
    };

    // 2. Email Receipt
    const handleEmailReceipt = async () => {
        setEmailLoading(true);
        try {
            const res = await fetch(`/api/bookings/${booking._id}/email`, { method: 'POST' });
            const data = await res.json();
            if (res.ok) {
                alert('Invoice sent successfully!');
            } else {
                alert('Failed: ' + data.error);
            }
        } catch (e) {
            alert('Error sending email: ' + e.message);
        } finally {
            setEmailLoading(false);
        }
    };

    // 3. Submit Ticket
    const handleSubmitTicket = async (e) => {
        e.preventDefault();
        setTicketLoading(true);
        try {
            const res = await fetch('/api/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    booking: booking._id,
                    subject: ticketForm.subject,
                    message: ticketForm.message,
                    priority: ticketForm.priority,
                    user: booking.customer, // Might be null if guest
                    status: 'open',
                    email: booking.customerEmail // Store email for guest contact
                })
            });
            if (res.ok) { // Check status ok
                alert('Support Ticket Created! We will contact you shortly.');
                setTicketOpen(false);
                setTicketForm({ subject: '', message: '', priority: 'medium' });
            } else {
                const d = await res.json();
                alert('Error: ' + d.error);
            }
        } catch (e) {
            alert('Failed to submit ticket');
        } finally {
            setTicketLoading(false);
        }
    };

    return (
        <>
            <div className="flex flex-col md:flex-row gap-4 pt-10 border-t border-slate-100 justify-center">
                <button
                    onClick={handleDownloadPDF}
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 rounded-2xl border border-slate-200 text-[11px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-sm"
                >
                    <Download size={16} strokeWidth={2.5} className="text-slate-400" /> Download PDF
                </button>
                <button
                    onClick={handleEmailReceipt}
                    disabled={emailLoading}
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 rounded-2xl border border-slate-200 text-[11px] font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 shadow-sm"
                >
                    {emailLoading ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} strokeWidth={2.5} className="text-slate-400" />}
                    Email Invoice
                </button>
                <button
                    onClick={() => setTicketOpen(true)}
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-[#FACC15] hover:bg-yellow-500 text-slate-900 rounded-2xl border border-yellow-400 text-[11px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-yellow-500/20"
                >
                    <MessageSquare size={16} strokeWidth={2.5} /> Report Issue
                </button>
            </div>

            {/* Ticket Modal */}
            {ticketOpen && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 w-full max-w-md p-10 animate-fade-in-up shadow-2xl relative overflow-hidden">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3 tracking-tight uppercase">
                                <AlertTriangle className="text-[#FACC15]" size={28} strokeWidth={2.5} /> Report Issue
                            </h3>
                            <button onClick={() => setTicketOpen(false)} className="w-10 h-10 bg-slate-50 flex items-center justify-center rounded-xl border border-slate-100 hover:bg-slate-100 transition-all text-slate-400 hover:text-slate-900"><X size={20} strokeWidth={2.5} /></button>
                        </div>

                        <form onSubmit={handleSubmitTicket} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 pl-1">Subject</label>
                                <input
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest focus:outline-none focus:border-[#FACC15] focus:bg-white transition-all"
                                    placeholder="e.g. Driver Late, Lost Item"
                                    value={ticketForm.subject}
                                    onChange={e => setTicketForm({ ...ticketForm, subject: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 pl-1">Priority</label>
                                <select
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest focus:outline-none focus:border-[#FACC15] focus:bg-white transition-all cursor-pointer appearance-none"
                                    value={ticketForm.priority}
                                    onChange={e => setTicketForm({ ...ticketForm, priority: e.target.value })}
                                >
                                    <option value="low">Low - General Question</option>
                                    <option value="medium">Medium - Service Update</option>
                                    <option value="high">High - Urgent Issue</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 pl-1">Message</label>
                                <textarea
                                    required
                                    rows={4}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest focus:outline-none focus:border-[#FACC15] focus:bg-white transition-all resize-none"
                                    placeholder="Describe your issue..."
                                    value={ticketForm.message}
                                    onChange={e => setTicketForm({ ...ticketForm, message: e.target.value })}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={ticketLoading}
                                className="w-full bg-slate-900 text-white rounded-2xl py-5 font-black uppercase tracking-[0.2em] text-[11px] hover:bg-slate-800 transition-all disabled:opacity-50 flex justify-center items-center gap-3 active:scale-95 mt-6 shadow-xl shadow-slate-900/10"
                            >
                                {ticketLoading && <Loader2 size={16} className="animate-spin" />} Submit Ticket
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
