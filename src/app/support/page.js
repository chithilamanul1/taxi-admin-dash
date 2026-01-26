'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MessageSquare, Plus, Loader2, Send, Clock, CheckCircle, XCircle } from 'lucide-react'

export default function SupportPage() {
    const { data: session, status } = useSession()
    const router = useRouter()

    const [tickets, setTickets] = useState([])
    const [loading, setLoading] = useState(true)
    const [view, setView] = useState('list') // list, new, detail
    const [selectedTicket, setSelectedTicket] = useState(null)

    // New Ticket Form
    const [newTicket, setNewTicket] = useState({ subject: '', message: '', priority: 'medium' })
    const [submitting, setSubmitting] = useState(false)

    // Reply Form
    const [replyMessage, setReplyMessage] = useState('')
    const [sendingReply, setSendingReply] = useState(false)

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/login')
        if (session?.user) fetchTickets()
    }, [status, session])

    const fetchTickets = async () => {
        try {
            const res = await fetch('/api/support')
            const data = await res.json()
            if (data.success) setTickets(data.data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleCreateTicket = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            const res = await fetch('/api/support', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTicket)
            })
            const data = await res.json()
            if (data.success) {
                alert('Ticket created successfully!')
                setNewTicket({ subject: '', message: '', priority: 'medium' })
                setView('list')
                fetchTickets()
            } else {
                alert(data.error)
            }
        } catch (error) {
            alert('Failed to create ticket')
        } finally {
            setSubmitting(false)
        }
    }

    const handleReply = async () => {
        if (!replyMessage.trim()) return
        setSendingReply(true)
        try {
            const res = await fetch(`/api/support/${selectedTicket._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: replyMessage })
            })
            const data = await res.json()
            if (data.success) {
                setSelectedTicket(data.data)
                setReplyMessage('')
                // Refresh list to update status/timestamps
                fetchTickets()
            }
        } catch (error) {
            alert('Failed to send reply')
        } finally {
            setSendingReply(false)
        }
    }

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-emerald-900" size={40} /></div>

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12 px-4 transition-colors">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-emerald-900 dark:text-white">Support Center</h1>
                        <p className="text-gray-500 dark:text-slate-400">How can we help you today?</p>
                    </div>
                    {view === 'list' && (
                        <button
                            onClick={() => setView('new')}
                            className="bg-emerald-600 text-emerald-900 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-yellow-400 transition-colors"
                        >
                            <Plus size={20} /> New Ticket
                        </button>
                    )}
                    {view !== 'list' && (
                        <button
                            onClick={() => { setView('list'); setSelectedTicket(null); }}
                            className="text-gray-500 hover:text-emerald-900 font-medium"
                        >
                            ← Back to Tickets
                        </button>
                    )}
                </div>

                {view === 'list' && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm overflow-hidden border border-emerald-900/10 dark:border-white/5">
                        {tickets.length === 0 ? (
                            <div className="p-12 text-center text-gray-400">
                                <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
                                <p>No support tickets yet.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {tickets.map(ticket => (
                                    <div
                                        key={ticket._id}
                                        onClick={() => { setSelectedTicket(ticket); setView('detail'); }}
                                        className="p-6 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer transition-colors flex justify-between items-center"
                                    >
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className={`w-2 h-2 rounded-full ${ticket.status === 'open' ? 'bg-green-500' :
                                                    ticket.status === 'answered' ? 'bg-blue-500' : 'bg-gray-400'
                                                    }`} />
                                                <h3 className="font-bold text-emerald-900 dark:text-white">{ticket.subject}</h3>
                                                <span className={`text-xs px-2 py-0.5 rounded capitalize ${ticket.priority === 'high' ? 'bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400' :
                                                    'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-slate-400'
                                                    }`}>{ticket.priority}</span>
                                            </div>
                                            <p className="text-sm text-gray-500 truncate max-w-md">
                                                {ticket.messages[ticket.messages.length - 1]?.message}
                                            </p>
                                        </div>
                                        <div className="text-right text-xs text-gray-400">
                                            <div>{new Date(ticket.lastUpdated).toLocaleDateString()}</div>
                                            <div className="capitalize font-medium mt-1 text-slate-500">{ticket.status}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {view === 'new' && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-8 max-w-2xl mx-auto border border-emerald-900/10 dark:border-white/5">
                        <h2 className="text-xl font-bold text-emerald-900 dark:text-white mb-6">Create New Ticket</h2>
                        <form onSubmit={handleCreateTicket} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Subject</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-lg outline-none focus:ring-2 focus:ring-emerald-600/20 text-emerald-900 dark:text-white"
                                    value={newTicket.subject}
                                    onChange={e => setNewTicket({ ...newTicket, subject: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Priority</label>
                                <select
                                    className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-lg outline-none focus:ring-2 focus:ring-emerald-600/20 text-emerald-900 dark:text-white"
                                    value={newTicket.priority}
                                    onChange={e => setNewTicket({ ...newTicket, priority: e.target.value })}
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Message</label>
                                <textarea
                                    required
                                    className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-lg outline-none focus:ring-2 focus:ring-emerald-600/20 text-emerald-900 dark:text-white h-32"
                                    value={newTicket.message}
                                    onChange={e => setNewTicket({ ...newTicket, message: e.target.value })}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-emerald-900 dark:bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-900/90 dark:hover:bg-emerald-500 transition-colors disabled:opacity-50"
                            >
                                {submitting ? 'Creating...' : 'Submit Ticket'}
                            </button>
                        </form>
                    </div>
                )}

                {view === 'detail' && selectedTicket && (
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-white dark:bg-slate-900 rounded-t-2xl shadow-sm p-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-bold text-emerald-900 dark:text-white mb-1">{selectedTicket.subject}</h2>
                                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-slate-400">
                                    <span className="capitalize">Status: {selectedTicket.status}</span>
                                    <span>•</span>
                                    <span>ID: {selectedTicket._id.slice(-6)}</span>
                                </div>
                            </div>
                            {selectedTicket.status !== 'closed' && (
                                <span className="bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold uppercase">Open</span>
                            )}
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-950 p-6 space-y-6 min-h-[400px] max-h-[600px] overflow-y-auto">
                            {selectedTicket.messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] rounded-2xl p-4 ${msg.sender === 'user'
                                        ? 'bg-emerald-900 dark:bg-emerald-600 text-white rounded-tr-none'
                                        : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-200 shadow-sm rounded-tl-none border border-black/5 dark:border-white/5'
                                        }`}>
                                        <p className="whitespace-pre-wrap text-sm">{msg.message}</p>
                                        <p className={`text-[10px] mt-2 opacity-70 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                                            {new Date(msg.timestamp).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-b-2xl shadow-sm p-4 border-t border-slate-100 dark:border-white/5">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Type your reply..."
                                    className="flex-1 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600/20 text-emerald-900 dark:text-white"
                                    value={replyMessage}
                                    onChange={e => setReplyMessage(e.target.value)}
                                    onKeyPress={e => e.key === 'Enter' && handleReply()}
                                />
                                <button
                                    onClick={handleReply}
                                    disabled={sendingReply || !replyMessage.trim()}
                                    className="bg-emerald-600 text-emerald-900 p-3 rounded-xl hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {sendingReply ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
