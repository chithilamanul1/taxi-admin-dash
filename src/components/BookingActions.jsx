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
            <div className="flex flex-wrap gap-4 pt-8 border-t border-white/5 justify-center">
                <button
                    onClick={handleDownloadPDF}
                    className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-none text-xs font-black uppercase tracking-widest border border-white/10 transition-all"
                >
                    <Download size={16} /> Download Invoice
                </button>
                <button
                    onClick={handleEmailReceipt}
                    disabled={emailLoading}
                    className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-none text-xs font-black uppercase tracking-widest border border-white/10 transition-all disabled:opacity-50"
                >
                    {emailLoading ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
                    Send to Email
                </button>
                <button
                    onClick={() => setTicketOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-none text-xs font-black uppercase tracking-widest border border-red-500/20 transition-all"
                >
                    <MessageSquare size={16} /> Report Issue
                </button>
            </div>

            {/* Ticket Modal */}
            {ticketOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
                    <div className="bg-[#1a1a1a] rounded-none shadow-2xl w-full max-w-md p-8 animate-fade-in-up border-2 border-red-500/30">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-2">
                                <AlertTriangle className="text-red-500" size={24} /> Report an Issue
                            </h3>
                            <button onClick={() => setTicketOpen(false)} className="text-white/40 hover:text-white"><X size={20} /></button>
                        </div>

                        <form onSubmit={handleSubmitTicket} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-[#FFDA00] uppercase tracking-widest mb-2">Subject</label>
                                <input
                                    required
                                    className="w-full bg-black border border-white/10 rounded-none px-4 py-3 text-white text-sm focus:outline-none focus:border-[#22C55E] placeholder:text-white/20"
                                    placeholder="e.g. Driver Late, Vehicle Change"
                                    value={ticketForm.subject}
                                    onChange={e => setTicketForm({ ...ticketForm, subject: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-[#FFDA00] uppercase tracking-widest mb-2">Priority Level</label>
                                <select
                                    className="w-full bg-black border border-white/10 rounded-none px-4 py-3 text-white text-sm focus:outline-none focus:border-[#22C55E]"
                                    value={ticketForm.priority}
                                    onChange={e => setTicketForm({ ...ticketForm, priority: e.target.value })}
                                >
                                    <option value="low">Low - General Question</option>
                                    <option value="medium">Medium - Service Update</option>
                                    <option value="high">High - Urgent Issue</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-[#FFDA00] uppercase tracking-widest mb-2">Detailed Message</label>
                                <textarea
                                    required
                                    rows={4}
                                    className="w-full bg-black border border-white/10 rounded-none px-4 py-3 text-white text-sm focus:outline-none focus:border-[#22C55E] placeholder:text-white/20"
                                    placeholder="Please describe exactly what happened..."
                                    value={ticketForm.message}
                                    onChange={e => setTicketForm({ ...ticketForm, message: e.target.value })}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={ticketLoading}
                                className="w-full bg-red-600 text-white rounded-none py-4 font-black text-sm uppercase tracking-widest hover:bg-red-700 transition-all disabled:opacity-50 flex justify-center items-center gap-2 shadow-lg shadow-red-600/10"
                            >
                                {ticketLoading && <Loader2 size={16} className="animate-spin" />} Submit Support Ticket
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
