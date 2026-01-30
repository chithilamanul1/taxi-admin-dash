'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Plus, Send, X, Loader2, ChevronRight, User, Shield } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function MySupportTickets() {
    const { data: session } = useSession();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('list'); // 'list', 'create', 'chat'
    const [activeTicket, setActiveTicket] = useState(null);

    // Create Form
    const [subject, setSubject] = useState('');
    const [initialMessage, setInitialMessage] = useState('');
    const [creating, setCreating] = useState(false);

    // Chat
    const [reply, setReply] = useState('');
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchTickets = async () => {
        try {
            const res = await fetch('/api/support/tickets');
            const data = await res.json();
            if (data.success) {
                setTickets(data.tickets);
            }
        } catch (error) {
            console.error("Error fetching tickets:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (session) fetchTickets();
    }, [session]);

    useEffect(() => {
        if (view === 'chat') scrollToBottom();
    }, [view, activeTicket?.messages]);

    const handleCreate = async (e) => {
        e.preventDefault();
        setCreating(true);
        try {
            const res = await fetch('/api/support/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subject, message: initialMessage })
            });
            const data = await res.json();
            if (data.success) {
                await fetchTickets();
                setView('list');
                setSubject('');
                setInitialMessage('');
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert('Failed to create ticket');
        } finally {
            setCreating(false);
        }
    };

    const handleSendReply = async (e) => {
        e.preventDefault();
        if (!reply.trim()) return;
        setSending(true);
        try {
            const res = await fetch(`/api/support/tickets/${activeTicket._id}/message`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: reply })
            });
            const data = await res.json();
            if (data.success) {
                setActiveTicket(data.ticket); // Update local state with new message
                setReply('');
                // Also update the list in background
                fetchTickets();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSending(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-emerald-900"><Loader2 className="animate-spin mx-auto mb-2" /> Loading support...</div>;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 min-h-[500px] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                    <h2 className="text-xl font-bold text-emerald-900 flex items-center gap-2">
                        <MessageSquare className="text-emerald-600" /> Support Center
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Direct line to our support team.</p>
                </div>
                {view === 'list' && (
                    <button
                        onClick={() => setView('create')}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-emerald-800 transition-colors"
                    >
                        <Plus size={16} /> New Ticket
                    </button>
                )}
                {view !== 'list' && (
                    <button
                        onClick={() => setView('list')}
                        className="text-slate-500 hover:text-emerald-900 font-bold text-sm"
                    >
                        Close
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto bg-slate-50">
                {view === 'list' && (
                    <div className="p-6 space-y-3">
                        {tickets.length === 0 ? (
                            <div className="text-center py-10 text-slate-400">
                                <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
                                <p>No support tickets yet.</p>
                                <button onClick={() => setView('create')} className="text-emerald-600 font-bold mt-2">Start a conversation</button>
                            </div>
                        ) : (
                            tickets.map(ticket => (
                                <div
                                    key={ticket._id}
                                    onClick={() => { setActiveTicket(ticket); setView('chat'); }}
                                    className="bg-white p-4 rounded-xl border border-slate-100 hover:border-emerald-200 hover:shadow-md transition-all cursor-pointer group"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-emerald-900 group-hover:text-emerald-600 transition-colors">{ticket.subject}</h3>
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${ticket.status === 'open' ? 'bg-blue-100 text-blue-700' :
                                                ticket.status === 'pending_user' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-green-100 text-green-700'
                                            }`}>
                                            {ticket.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500 line-clamp-1">{ticket.messages[ticket.messages.length - 1]?.message}</p>
                                    <div className="flex justify-between items-center mt-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                        <span>ID: #{ticket._id.slice(-6)}</span>
                                        <span>{new Date(ticket.updatedAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {view === 'create' && (
                    <div className="p-6 max-w-lg mx-auto">
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Subject</label>
                                <input
                                    value={subject}
                                    onChange={e => setSubject(e.target.value)}
                                    className="w-full p-4 rounded-xl border border-slate-200 outline-none focus:border-emerald-500 transition-all font-bold text-emerald-900"
                                    placeholder="Briefly describe your issue..."
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Message</label>
                                <textarea
                                    value={initialMessage}
                                    onChange={e => setInitialMessage(e.target.value)}
                                    className="w-full p-4 rounded-xl border border-slate-200 outline-none focus:border-emerald-500 transition-all h-40 resize-none text-slate-700"
                                    placeholder="How can we help you?"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={creating}
                                className="w-full py-4 bg-emerald-900 text-white rounded-xl font-bold uppercase tracking-widest hover:bg-emerald-800 transition-colors disabled:opacity-50"
                            >
                                {creating ? 'Creating...' : 'Submit Ticket'}
                            </button>
                        </form>
                    </div>
                )}

                {view === 'chat' && activeTicket && (
                    <div className="flex flex-col h-full h-[500px]">
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {activeTicket.messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-4 rounded-2xl ${msg.sender === 'user'
                                            ? 'bg-emerald-600 text-white rounded-tr-none'
                                            : 'bg-white border border-slate-200 text-emerald-900 rounded-tl-none shadow-sm'
                                        }`}>
                                        <div className="flex items-center gap-2 mb-1 opacity-70">
                                            {msg.sender === 'admin' && <Shield size={12} />}
                                            <span className="text-[10px] font-bold uppercase tracking-widest">
                                                {msg.sender === 'user' ? 'You' : 'Support Team'}
                                            </span>
                                        </div>
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                                        <p className={`text-[10px] mt-2 text-right ${msg.sender === 'user' ? 'text-emerald-200' : 'text-slate-400'}`}>
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="p-4 bg-white border-t border-slate-100">
                            <form onSubmit={handleSendReply} className="flex gap-2">
                                <input
                                    value={reply}
                                    onChange={e => setReply(e.target.value)}
                                    className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 transition-colors"
                                    placeholder="Type your reply..."
                                />
                                <button
                                    type="submit"
                                    disabled={sending || !reply.trim()}
                                    className="p-3 bg-emerald-900 text-white rounded-xl hover:bg-emerald-800 disabled:opacity-50 transition-colors"
                                >
                                    {sending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
