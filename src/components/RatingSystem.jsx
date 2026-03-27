'use client';

import { useState } from 'react';
import { Star, Send, CheckCircle, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RatingSystem({ bookingId, initialRating, initialReview, onSave }) {
    const [rating, setRating] = useState(initialRating || 0);
    const [hover, setHover] = useState(0);
    const [review, setReview] = useState(initialReview || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSaved, setIsSaved] = useState(!!initialRating);

    const handleSubmit = async () => {
        if (rating === 0) return;
        setIsSubmitting(true);
        try {
            const res = await fetch(`/api/bookings/${bookingId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rating, review }),
            });
            const data = await res.json();
            if (data.success) {
                setIsSaved(true);
                if (onSave) onSave(data.booking);
            }
        } catch (err) {
            console.error("Failed to save rating:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSaved) {
        return (
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border-[6px] border-black p-10 text-center shadow-[15px_15px_0px_0px_rgba(0,0,0,1)]"
            >
                <div className="w-20 h-20 bg-black rounded-none border-4 border-[#FACC15] flex items-center justify-center mx-auto mb-6 shadow-[6px_6px_0px_0px_#FACC15]">
                    <CheckCircle className="text-[#FACC15]" size={40} strokeWidth={3} />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tighter text-black mb-4 italic leading-none strike-through">FEEDBACK LOGGED</h3>
                <div className="flex justify-center gap-2 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                            key={star} 
                            size={24} 
                            fill={star <= rating ? "#FACC15" : "none"} 
                            className={star <= rating ? "text-black" : "text-slate-100"}
                            strokeWidth={3}
                        />
                    ))}
                </div>
                {review && (
                    <div className="relative">
                        <div className="absolute top-0 left-0 w-8 h-1 bg-black"></div>
                        <p className="text-slate-800 font-bold text-sm pt-6 mt-2 max-w-md mx-auto italic uppercase tracking-widest">
                            "{review}"
                        </p>
                    </div>
                )}
            </motion.div>
        );
    }

    return (
        <div className="bg-white border-4 border-black p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-black text-[#FACC15] text-[8px] font-black px-4 py-1 uppercase tracking-widest border-b-4 border-l-4 border-black">POST-TRIP REVIEW</div>
            
            <div className="text-center mb-8">
                <h3 className="text-3xl font-black uppercase tracking-tighter text-black mb-3 leading-none">HOW WAS YOUR RIDE?</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Rate your Chauffeur and Service</p>
            </div>

            <div className="flex justify-center gap-4 mb-10">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                        onClick={() => setRating(star)}
                        className="transition-transform hover:scale-125 active:scale-90"
                    >
                        <Star 
                            size={48} 
                            fill={(hover || rating) >= star ? "#FACC15" : "none"} 
                            className={(hover || rating) >= star ? "text-black" : "text-slate-200"}
                            strokeWidth={3}
                        />
                    </button>
                ))}
            </div>

            <div className="space-y-6">
                <div className="relative">
                    <div className="absolute left-6 top-6 text-[#FACC15] z-10">
                        <MessageSquare size={20} strokeWidth={3} />
                    </div>
                    <textarea
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        placeholder="TELL US ABOUT YOUR EXPERIENCE (OPTIONAL)..."
                        className="w-full bg-slate-50 border-4 border-black p-6 pl-16 rounded-none font-black uppercase text-xs tracking-widest focus:bg-white focus:shadow-[4px_4px_0px_0px_#FACC15] transition-all min-h-[120px] outline-none placeholder:text-slate-300"
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={rating === 0 || isSubmitting}
                    className={`w-full py-6 font-black uppercase tracking-[0.3em] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-4 ${
                        rating === 0 || isSubmitting 
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                        : 'bg-[#FACC15] text-black hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]'
                    }`}
                >
                    {isSubmitting ? (
                        <div className="w-6 h-6 border-4 border-black border-t-transparent animate-spin"></div>
                    ) : (
                        <>
                            <Send size={20} strokeWidth={3} />
                            SUBMIT REVIEW
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
