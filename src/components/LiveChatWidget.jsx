'use client'

import { useState, useEffect, useRef } from 'react'
import { db } from '@/firebase'
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, setDoc, doc } from 'firebase/firestore'
import { MessageCircle, X, Send, User, Loader2, Minus } from 'lucide-react'
import { nanoid } from 'nanoid'

export default function LiveChatWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([])
    const [inputText, setInputText] = useState('')
    const [chatId, setChatId] = useState(null)
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef(null)

    // Initialize/Load Chat Session
    useEffect(() => {
        let savedChatId = localStorage.getItem('chatSessionId')
        if (!savedChatId) {
            savedChatId = `chat_${nanoid(10)}`
            localStorage.setItem('chatSessionId', savedChatId)
        }
        setChatId(savedChatId)

        // Listen for open event from unified FloatingContact
        const handleOpen = () => setIsOpen(true);
        window.addEventListener('open-live-chat', handleOpen);
        return () => window.removeEventListener('open-live-chat', handleOpen);
    }, [])

    // Scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        if (isOpen) scrollToBottom()
    }, [messages, isOpen])

    // Firestore Listener
    useEffect(() => {
        if (!chatId) return

        const q = query(
            collection(db, 'chats', chatId, 'messages'),
            orderBy('timestamp', 'asc')
        )

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            setMessages(msgs)
        })

        return () => unsubscribe()
    }, [chatId])

    const sendMessage = async (e) => {
        e.preventDefault()
        if (!inputText.trim() || !chatId) return

        const text = inputText
        setInputText('')
        setLoading(true)

        try {
            // Ensure chat session document exists with metadata
            await setDoc(doc(db, 'chats', chatId), {
                lastMessage: text,
                updatedAt: serverTimestamp(),
                status: 'active',
                customerName: 'Guest User', // Could be expanded to use Auth
                id: chatId
            }, { merge: true })

            // Add message to sub-collection
            await addDoc(collection(db, 'chats', chatId, 'messages'), {
                text,
                sender: 'customer',
                timestamp: serverTimestamp()
            })

            // Trigger internal relay API (Optional: for instant Discord notification)
            fetch('/api/chat/relay', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chatId, text })
            }).catch(e => console.error('Relay error:', e))

        } catch (error) {
            console.error('Error sending message:', error)
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
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
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
            <form onSubmit={sendMessage} className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shrink-0">
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
                    Replying via Discord Support
                </div>
            </form>
        </div>
    )
}
