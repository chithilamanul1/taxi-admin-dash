'use client'

import { useState, useEffect, useRef } from 'react'
import Pusher from 'pusher-js'
import { MessageCircle, User, Send, Loader2, Clock, CheckCircle, Search, Lock, ArrowLeft } from 'lucide-react'

export default function AdminChatManager() {
    const [chats, setChats] = useState([])
    const [selectedChatId, setSelectedChatId] = useState(null)
    const [messages, setMessages] = useState([])
    const [inputText, setInputText] = useState('')
    const [loading, setLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const messagesEndRef = useRef(null)

    // Initial Load: All Sessions
    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const res = await fetch('/api/chat/sessions');
                const data = await res.json();
                if (data.success) {
                    setChats(data.sessions);
                }
            } catch (err) {
                console.error('Sessions fetch error:', err);
            }
        };
        fetchSessions();

        // Subscribe to global admin channel for new sessions/updates
        if (!process.env.NEXT_PUBLIC_PUSHER_KEY) return;

        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER
        });

        const channel = pusher.subscribe('admin-chats');
        channel.bind('session-update', (data) => {
            setChats(prev => {
                const index = prev.findIndex(c => c.chatId === data.chatId);
                const updatedSession = {
                    chatId: data.chatId,
                    customerName: data.customerName,
                    lastMessage: data.text,
                    lastSender: data.sender,
                    updatedAt: new Date(),
                    status: 'active'
                };

                if (index !== -1) {
                    const newChats = [...prev];
                    newChats[index] = updatedSession;
                    return newChats.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                } else {
                    return [updatedSession, ...prev];
                }
            });
        });

        return () => {
            pusher.unsubscribe('admin-chats');
            pusher.disconnect();
        };
    }, [])

    // Listen for messages in selected chat
    useEffect(() => {
        if (!selectedChatId) return

        // 1. Fetch History
        const fetchHistory = async () => {
            try {
                const res = await fetch(`/api/chat/history?chatId=${selectedChatId}`);
                const data = await res.json();
                if (data.success) {
                    setMessages(data.messages);
                }
            } catch (err) {
                console.error('History fetch error:', err);
            }
        };
        fetchHistory();

        // 2. Subscribe to specific chat channel
        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER
        });

        const channel = pusher.subscribe(`chat-${selectedChatId}`);
        channel.bind('new-message', (data) => {
            setMessages(prev => {
                if (prev.find(m => m.id === data.id || m._id === data.id)) return prev;
                return [...prev, data];
            });
        });

        return () => {
            pusher.unsubscribe(`chat-${selectedChatId}`);
            pusher.disconnect();
        };
    }, [selectedChatId])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const sendMessage = async (e) => {
        e.preventDefault()
        if (!inputText.trim() || !selectedChatId) return

        const text = inputText
        setInputText('')
        setLoading(true)

        // Optimistic update
        const tempMsg = { _id: `temp_${Date.now()}`, text, sender: 'admin', timestamp: new Date() };
        setMessages(prev => [...prev, tempMsg]);

        try {
            const res = await fetch('/api/chat/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chatId: selectedChatId,
                    text,
                    sender: 'admin'
                })
            });

            if (!res.ok) throw new Error('Failed to send');
        } catch (error) {
            console.error('Error sending message:', error)
            alert('Failed to send reply.');
        } finally {
            setLoading(false)
        }
    }

    const filteredChats = chats.filter(chat =>
        chat.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.id.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="flex flex-col md:flex-row h-[85vh] md:h-[730px] bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 overflow-hidden">
            {/* Sidebar: Chat List */}
            <div className={`w-full md:w-80 border-r-0 md:border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-950/20 ${selectedChatId ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                    <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight mb-4 flex items-center gap-2">
                        <MessageCircle className="text-emerald-500" size={24} /> Live <span className="text-emerald-600">Support</span>
                    </h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search chats..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-10 bg-white dark:bg-slate-800 pl-10 pr-4 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 border border-slate-200 dark:border-slate-700"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {filteredChats.map((chat) => (
                        <button
                            key={chat.id}
                            onClick={() => setSelectedChatId(chat.id)}
                            className={`w-full p-4 flex gap-4 transition-all border-b border-slate-100 dark:border-slate-800/50 hover:bg-white dark:hover:bg-slate-800 ${selectedChatId === chat.id ? 'bg-white dark:bg-slate-800 shadow-sm' : ''}`}
                        >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${selectedChatId === chat.id ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>
                                <User size={20} />
                            </div>
                            <div className="flex-1 text-left min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 truncate uppercase">
                                        {chat.customerName || 'Guest User'}
                                    </h4>
                                    <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap">
                                        {new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate font-medium">
                                    {chat.lastSender === 'admin' ? 'You: ' : ''}{chat.lastMessage}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {!process.env.NEXT_PUBLIC_PUSHER_KEY && (
                <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-[110] flex items-center justify-center p-8">
                    <div className="max-w-md bg-white dark:bg-slate-800 p-8 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-700 text-center">
                        <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                            <Lock className="text-amber-600 dark:text-amber-400" size={32} />
                        </div>
                        <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight mb-4">Chat Disconnected</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest leading-loose mb-8">
                            Please configure <span className="text-emerald-600">Pusher API Keys</span> in your <code className="bg-slate-100 dark:bg-slate-950 px-2 py-1 rounded-lg">.env</code> file.
                        </p>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] border-t border-slate-100 dark:border-slate-800 pt-6">
                            Configuration Required
                        </div>
                    </div>
                </div>
            )}

            {/* Main: Chat View */}
            <div className={`flex-1 flex flex-col bg-white dark:bg-slate-900 ${!selectedChatId ? 'hidden md:flex' : 'flex'}`}>
                {selectedChatId ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 md:p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/30 dark:bg-slate-950/20">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setSelectedChatId(null)}
                                    className="md:hidden w-8 h-8 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400"
                                >
                                    <ArrowLeft size={18} />
                                </button>
                                <div>
                                    <h3 className="font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight text-sm md:text-base">
                                        {chats.find(c => c.id === selectedChatId)?.customerName || 'Guest User'}
                                    </h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">ID: {selectedChatId}</p>
                                </div>
                            </div>
                            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg text-[10px] font-black uppercase tracking-wider">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                Connected
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4 custom-scrollbar bg-slate-50/50 dark:bg-slate-950/20">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[70%] p-4 rounded-2xl text-sm shadow-sm ${msg.sender === 'admin'
                                        ? 'bg-emerald-600 text-white rounded-tr-none'
                                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-100 dark:border-slate-700'
                                        }`}>
                                        <p className="font-medium">{msg.text}</p>
                                        <span className={`text-[9px] block mt-2 font-bold opacity-60 uppercase tracking-widest ${msg.sender === 'admin' ? 'text-white text-right' : 'text-slate-400'}`}>
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={sendMessage} className="p-4 md:p-6 border-t border-slate-200 dark:border-slate-800">
                            <div className="relative flex items-center gap-3 md:gap-4">
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder="Type message to relay back..."
                                    className="flex-1 h-12 md:h-14 bg-slate-100 dark:bg-slate-800 border-none px-4 md:px-6 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 text-xs md:text-sm font-medium pr-14 md:pr-16 shadow-inner transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={loading || !inputText.trim()}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center hover:bg-emerald-700 transition-colors disabled:opacity-50 shadow-lg shadow-emerald-500/20"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-40">
                        <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center mb-6">
                            <MessageCircle size={48} className="text-slate-300 dark:text-slate-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight mb-2">Select a Conversation</h3>
                        <p className="max-w-xs text-xs font-bold text-slate-400 uppercase tracking-widest leading-loose">
                            Choose a chat from the sidebar to begin real-time customer support.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
