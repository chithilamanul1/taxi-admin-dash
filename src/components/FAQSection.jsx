import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
    {
        question: "How much is a taxi from Colombo Airport (CMB) to the city center?",
        answer: "Our fixed rate for a comfortable transfer from Bandaranaike International Airport to Colombo city center is transparent with no hidden fees. Pricing depends on your vehicle choice (e.g., Sedan, KDH Van), starting from standard industry rates. Check our booking engine for an instant, accurate quote."
    },
    {
        question: "Do you provide KDH van rentals for group tours in Sri Lanka?",
        answer: "Yes! We specialize in Toyota KDH van rentals perfect for families and small groups (up to 7-9 passengers). Our vans come with ample luggage space, air conditioning, and a professional English-speaking chauffeur to make your Sri Lanka tour comfortable."
    },
    {
        question: "Are your airport transfer rates fixed or metered?",
        answer: "All our rates are 100% fixed. What you see on our booking widget is exactly what you pay. We do not use meters, meaning you are protected from traffic delays, route changes, or hidden night-time surcharges."
    },
    {
        question: "Can I book a multi-day private tour with a chauffeur in Sri Lanka?",
        answer: "Absolutely. Ask us about our Custom Trips or browse our pre-planned Tour Packages. You can hire a premium vehicle with a dedicated chauffeur for 3, 5, 7, or even 14+ days to explore destinations like Kandy, Sigiriya, Ella, and Galle."
    },
    {
        question: "Are your drivers available 24/7 for late-night airport arrivals?",
        answer: "Yes, our services operate 24 hours a day, 7 days a week. Whether your flight lands at 2:00 PM or 2:00 AM, our driver will be waiting for you at the arrivals hall with a name board, ready to assist with your luggage."
    },
    {
        question: "How do I find my driver at Bandaranaike International Airport?",
        answer: "Once you clear customs and enter the Arrivals Hall, look for your driver holding a personalized name board. You will also receive your driver's contact details via WhatsApp/email prior to your arrival for seamless communication."
    },
    {
        question: "Do you offer taxis for 6 passengers with luggage in Sri Lanka?",
        answer: "Yes, we have a specialized fleet of 6-seater mini vans and larger KDH luxury vans. These are ideal for groups of 6 passengers, providing comfortable seating and ample boot space for 6+ large suitcases. All our group vehicles are dual air-conditioned."
    },
    {
        question: "How can I avoid common taxi scams at Colombo Airport?",
        answer: "The best way to avoid scams is to pre-book a fixed-price transfer. Avoid unofficial representatives inside the hall and never agree to a price that hasn't been confirmed in writing. Our service provides instant confirmation and fixed all-inclusive rates to protect you from overcharging."
    }
];

const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState(0);

    // Generate JSON-LD Schema for SEO
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };

    return (
        <section className="py-20 md:py-32 bg-slate-50 dark:bg-[#0a0a0a] border-t border-black/10 dark:border-white/10 transition-colors">
            {/* Inject Structured Data for Google */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            <div className="max-w-4xl mx-auto px-6">
                <div className="flex items-center gap-4 mb-12 md:mb-16">
                    <div className="w-16 h-16 bg-[#FACC15] border-4 border-black flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                        <HelpCircle size={32} className="text-black" strokeWidth={2.5} />
                    </div>
                    <div>
                        <h2 className="text-4xl md:text-6xl font-black text-black dark:text-white uppercase tracking-tighter leading-none">
                            COMMON <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FACC15] to-amber-500">QUESTIONS</span>
                        </h2>
                        <p className="text-black/40 dark:text-white/40 font-black uppercase tracking-widest text-xs mt-2">Everything you need to know</p>
                    </div>
                </div>

                <div className="space-y-4 md:space-y-6">
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div 
                                key={index} 
                                className={`group border-4 transition-all duration-300 ${isOpen ? 'border-[#FACC15] bg-white dark:bg-[#111] shadow-[12px_12px_0px_0px_rgba(250,204,21,1)] dark:shadow-[12px_12px_0px_0px_rgba(250,204,21,0.2)]' : 'border-black dark:border-white/20 bg-white dark:bg-black hover:border-black/60 dark:hover:border-white/40'}`}
                            >
                                <button
                                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                                    className="w-full flex items-center justify-between p-6 md:p-8 text-left focus:outline-none"
                                >
                                    <h3 className={`text-lg md:text-xl font-black uppercase tracking-wide pr-8 transition-colors ${isOpen ? 'text-black dark:text-[#FACC15]' : 'text-black dark:text-white group-hover:text-black/70 dark:group-hover:text-white/70'}`}>
                                        {faq.question}
                                    </h3>
                                    <div className={`shrink-0 w-10 h-10 border-2 flex items-center justify-center transition-all ${isOpen ? 'bg-[#FACC15] border-[#FACC15] text-black rotate-180' : 'bg-black/5 dark:bg-white/5 border-black dark:border-white/20 text-black dark:text-white'}`}>
                                        <ChevronDown size={20} strokeWidth={3} />
                                    </div>
                                </button>
                                
                                <div 
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                                >
                                    <div className="p-6 md:p-8 pt-0 border-t-2 border-slate-100 dark:border-white/5 mt-2">
                                        <p className="text-black/70 dark:text-white/70 font-medium leading-relaxed text-sm md:text-base">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
