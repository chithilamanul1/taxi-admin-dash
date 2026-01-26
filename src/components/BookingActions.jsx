'use client';

import { useState } from 'react';
import { Download, Mail, MessageSquare, Loader2, X, AlertTriangle } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function BookingActions({ booking }) {
    const [emailLoading, setEmailLoading] = useState(false);
    const [ticketOpen, setTicketOpen] = useState(false);
    const [ticketForm, setTicketForm] = useState({ subject: '', message: '', priority: 'medium' });
    const [ticketLoading, setTicketLoading] = useState(false);

    // 1. Download PDF
    const handleDownloadPDF = () => {
        const doc = new jsPDF();

        // Header
        doc.setFillColor(6, 78, 59); // Emerald 900
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.text('AIRPORT TAXIS', 20, 20);
        doc.setFontSize(10);
        doc.text('SRI LANKA (PVT) LTD', 20, 28);
        doc.text('RECEIPT', 170, 25);

        // Booking Info
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.text(`Booking ID: #${booking._id.toString().slice(-6).toUpperCase()}`, 20, 50);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 50);

        // Table
        autoTable(doc, {
            startY: 60,
            head: [['Description', 'Details']],
            body: [
                ['Customer Name', booking.customerName || 'Guest'],
                ['Pickup Location', booking.pickupLocation?.address],
                ['Dropoff Location', booking.dropoffLocation?.address],
                ['Vehicle Type', booking.vehicleType],
                ['Scheduled Date', booking.scheduledDate],
                ['Scheduled Time', booking.scheduledTime],
                ['Distance', `${booking.distance} km`],
                ['Payment Method', booking.paymentMethod?.toUpperCase()],
                ['Total Amount', `LKR ${booking.totalPrice?.toLocaleString()}`]
            ],
            theme: 'grid',
            headStyles: { fillColor: [6, 78, 59] },
        });

        // Footer
        const finalY = doc.lastAutoTable.finalY || 150;
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text('Thank you for choosing Airport Taxis Sri Lanka.', 20, finalY + 20);
        doc.text('Contact: +94 722 885 885 | airporttaxis.lk@gmail.com', 20, finalY + 26);

        doc.save(`receipt_${booking._id.slice(-6)}.pdf`);
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
            <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-100 justify-center">
                <button
                    onClick={handleDownloadPDF}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition-colors"
                >
                    <Download size={16} /> Download PDF
                </button>
                <button
                    onClick={handleEmailReceipt}
                    disabled={emailLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
                >
                    {emailLoading ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
                    Email Receipt
                </button>
                <button
                    onClick={() => setTicketOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-bold transition-colors"
                >
                    <MessageSquare size={16} /> Report Issue
                </button>
            </div>

            {/* Ticket Modal */}
            {ticketOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-fade-in-up">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <AlertTriangle className="text-red-500" size={24} /> Report an Issue
                            </h3>
                            <button onClick={() => setTicketOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>

                        <form onSubmit={handleSubmitTicket} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Subject</label>
                                <input
                                    required
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                                    placeholder="e.g. Driver Late, Lost Item"
                                    value={ticketForm.subject}
                                    onChange={e => setTicketForm({ ...ticketForm, subject: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Priority</label>
                                <select
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                                    value={ticketForm.priority}
                                    onChange={e => setTicketForm({ ...ticketForm, priority: e.target.value })}
                                >
                                    <option value="low">Low - General Question</option>
                                    <option value="medium">Medium - Service Update</option>
                                    <option value="high">High - Urgent Issue</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Message</label>
                                <textarea
                                    required
                                    rows={4}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                                    placeholder="Describe your issue..."
                                    value={ticketForm.message}
                                    onChange={e => setTicketForm({ ...ticketForm, message: e.target.value })}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={ticketLoading}
                                className="w-full bg-emerald-900 text-white rounded-xl py-3 font-bold hover:bg-emerald-800 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
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
