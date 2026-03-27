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
                alert('Receipt sent successfully!');
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
            <div className="flex flex-wrap gap-4 pt-8 border-t-4 border-black justify-center">
                <button
                    onClick={handleDownloadPDF}
                    className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-black hover:text-[#FACC15] text-black rounded-none border-2 border-black text-xs font-black uppercase tracking-widest transition-all active:scale-95"
                >
                    <Download size={16} strokeWidth={3} /> Download PDF
                </button>
                <button
                    onClick={handleEmailReceipt}
                    disabled={emailLoading}
                    className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-black hover:text-[#FACC15] text-black rounded-none border-2 border-black text-xs font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
                >
                    {emailLoading ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} strokeWidth={3} />}
                    Email Receipt
                </button>
                <button
                    onClick={() => setTicketOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-[#FACC15] hover:bg-black hover:text-[#FACC15] text-black rounded-none border-2 border-black text-xs font-black uppercase tracking-widest transition-all active:scale-95"
                >
                    <MessageSquare size={16} strokeWidth={3} /> Report Issue
                </button>
            </div>

            {/* Ticket Modal */}
            {ticketOpen && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
                    <div className="bg-white rounded-none border-4 border-black w-full max-w-md p-10 animate-slide-up transition-colors">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-black text-black flex items-center gap-3 tracking-tighter uppercase">
                                <AlertTriangle className="text-[#FACC15]" size={28} strokeWidth={3} /> Report Issue
                            </h3>
                            <button onClick={() => setTicketOpen(false)} className="w-10 h-10 bg-slate-100 flex items-center justify-center border-2 border-black hover:bg-black hover:text-white transition-all"><X size={20} strokeWidth={3} /></button>
                        </div>

                        <form onSubmit={handleSubmitTicket} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-black/40 uppercase tracking-widest mb-2">Subject</label>
                                <input
                                    required
                                    className="w-full bg-slate-50 border-2 border-black rounded-none px-4 py-3 text-xs font-black uppercase tracking-widest focus:outline-none focus:bg-[#FACC15]/10"
                                    placeholder="e.g. Driver Late, Lost Item"
                                    value={ticketForm.subject}
                                    onChange={e => setTicketForm({ ...ticketForm, subject: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-black/40 uppercase tracking-widest mb-2">Priority</label>
                                <select
                                    className="w-full bg-slate-50 border-2 border-black rounded-none px-4 py-3 text-xs font-black uppercase tracking-widest focus:outline-none focus:bg-[#FACC15]/10 cursor-pointer"
                                    value={ticketForm.priority}
                                    onChange={e => setTicketForm({ ...ticketForm, priority: e.target.value })}
                                >
                                    <option value="low">Low - General Question</option>
                                    <option value="medium">Medium - Service Update</option>
                                    <option value="high">High - Urgent Issue</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-black/40 uppercase tracking-widest mb-2">Message</label>
                                <textarea
                                    required
                                    rows={4}
                                    className="w-full bg-slate-50 border-2 border-black rounded-none px-4 py-4 text-xs font-black uppercase tracking-widest focus:outline-none focus:bg-[#FACC15]/10 resize-none"
                                    placeholder="Describe your issue..."
                                    value={ticketForm.message}
                                    onChange={e => setTicketForm({ ...ticketForm, message: e.target.value })}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={ticketLoading}
                                className="w-full bg-black text-[#FACC15] rounded-none border-4 border-black py-4 font-black uppercase tracking-[0.2em] text-xs hover:bg-[#FACC15] hover:text-black transition-all disabled:opacity-50 flex justify-center items-center gap-3 active:scale-95 mt-4"
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
