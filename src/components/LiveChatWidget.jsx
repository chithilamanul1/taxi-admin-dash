'use client'

import { useState, useEffect, useRef } from 'react'
import Pusher from 'pusher-js'
import { MessageCircle, X, Send, User, Loader2, Lock } from 'lucide-react'
import { nanoid } from 'nanoid'

import { useSession, signIn } from 'next-auth/react'

export default function LiveChatWidget() {
    const { data: session, status } = useSession()
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([])
    const [inputText, setInputText] = useState('')
    const [chatId, setChatId] = useState(null)
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef(null)

    // ... (keep useEffects for chat history/pusher, but maybe gate them on session?)

    // Initialize/Load Chat Session
    useEffect(() => {
        let savedChatId = localStorage.getItem('chatSessionId')
        if (!savedChatId) {
            savedChatId = `chat_${nanoid(10)}`
            localStorage.setItem('chatSessionId', savedChatId)
        }
        setChatId(savedChatId)

        // Listen for open event
        const handleOpen = () => setIsOpen(true);
        window.addEventListener('open-live-chat', handleOpen);
        return () => window.removeEventListener('open-live-chat', handleOpen);
    }, [])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
            window.dispatchEvent(new CustomEvent('live-chat-opened'));
        } else {
            window.dispatchEvent(new CustomEvent('live-chat-closed'));
        }
    }, [messages, isOpen])

    // Load History & Listen for Pusher Events
    useEffect(() => {
        if (!chatId || status !== 'authenticated') return

        // 1. Fetch History
        const fetchHistory = async () => {
            try {
                const res = await fetch(`/api/chat/history?chatId=${chatId}`);
                const data = await res.json();
                if (data.success) {
                    setMessages(data.messages);
                }
            } catch (err) {
                console.error('History fetch error:', err);
            }
        };
        fetchHistory();

        // 2. Subscribe to Pusher
        if (!process.env.NEXT_PUBLIC_PUSHER_KEY) return;

        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER
        });

        const channel = pusher.subscribe(`chat-${chatId}`);
        channel.bind('new-message', (data) => {
            setMessages(prev => {
                // Check if message already exists by ID
                if (prev.find(m => m.id === data.id || m._id === data.id)) return prev;

                // Check for optimistic duplicate
                const tempMatch = prev.find(m =>
                    (m.id?.toString().startsWith('temp_') || m._id?.toString().startsWith('temp_')) &&
                    m.text === data.text &&
                    m.sender === data.sender
                );

                if (tempMatch) {
                    return prev.map(m => (m.id === tempMatch.id || m._id === tempMatch._id) ? data : m);
                }

                return [...prev, data];
            });
        });

        return () => {
            try {
                if (pusher) {
                    pusher.unsubscribe(`chat-${chatId}`);
                    // Only disconnect if connected
                    if (pusher.connection.state === 'connected') {
                        pusher.disconnect();
                    }
                }
            } catch (e) {
                // Silently handle websocket errors
                console.warn('Pusher cleanup warning:', e);
            }
        };
    }, [chatId, status])

    const sendMessage = async (e) => {
        e.preventDefault()
        if (!inputText.trim() || !chatId) return

        const text = inputText
        setInputText('')
        setLoading(true)

        // Optimistic UI
        const tempId = `temp_${Date.now()}`;
        const tempMsg = { id: tempId, text, sender: 'customer', timestamp: new Date() };
        setMessages(prev => [...prev, tempMsg]);

        try {
            const res = await fetch('/api/chat/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chatId,
                    text,
                    sender: 'customer',
                    customerName: session?.user?.name || 'Guest User'
                })
            });

            if (!res.ok) throw new Error('Failed to send');

            const data = await res.json();
            if (data.success && data.message) {
                // Swap temp message with real message
                setMessages(prev => prev.map(m => m.id === tempId ? { ...data.message, id: data.message._id, _id: data.message._id } : m));
            }

        } catch (error) {
            console.error('Error sending message:', error)
            alert('Failed to send message. Please check your connection.');
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-[90vw] md:w-[380px] h-[70vh] md:h-[500px] bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 z-[70] flex flex-col overflow-hidden animate-fade-in-up">
            {/* Header */}
            <div className="bg-emerald-900 p-5 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center animate-bounce">
                        <User className="text-emerald-400" size={20} />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-sm">Live Support</h3>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                            <span className="text-[10px] text-emerald-300/80 font-medium uppercase tracking-wider">Online</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-white/60 hover:text-white p-2 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>

            {/* Content Area - Gated by Session */}
            {status === 'authenticated' ? (
                <>
                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar bg-slate-50 dark:bg-slate-950/50">
                        {messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                                <MessageCircle size={40} className="text-emerald-900/20 mb-3" />
                                <p className="text-xs font-bold text-emerald-900/40 uppercase tracking-widest">How can we help you today?</p>
                            </div>
                        ) : (
                            messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender === 'customer' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${msg.sender === 'customer'
                                        ? 'bg-emerald-600 text-white rounded-tr-none'
                                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-slate-700'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={sendMessage} className="p-4 pb-8 md:pb-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shrink-0">
                        <div className="relative flex items-center gap-2">
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 h-12 bg-slate-100 dark:bg-slate-800 border-none px-5 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium pr-12 transition-all"
                            />
                            <button
                                type="submit"
                                disabled={loading || !inputText.trim()}
                                className="absolute right-1 w-10 h-10 bg-emerald-600 text-white rounded-lg flex items-center justify-center hover:bg-emerald-700 transition-colors disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                            </button>
                        </div>
                        <div className="mt-3 text-[9px] text-center text-slate-400 font-bold uppercase tracking-widest">
                            Powered by Live Support
                        </div>
                    </form>
                </>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50 dark:bg-slate-900">
                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
                        <Lock className="text-emerald-600 dark:text-emerald-400" size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Login Required</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-[240px]">
                        Please sign in to start a live chat with our support team.
                    </p>
                    <button
                        onClick={() => signIn()}
                        className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                    >
                        <User size={18} />
                        Sign In / Register
                    </button>
                </div>
            )}
        </div>
    )
}
