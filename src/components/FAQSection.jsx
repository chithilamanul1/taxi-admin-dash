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
        <section className="py-8 bg-slate-50 dark:bg-[#0a0a0a] transition-colors">
            {/* Inject Structured Data for Google */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            <div className="max-w-4xl mx-auto px-6">
                <div className="flex flex-col items-center text-center gap-2 mb-6">
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center shadow-sm mb-2">
                        <HelpCircle size={24} className="text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                            Common <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Questions</span>
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 text-xs md:text-sm max-w-2xl mx-auto">
                            Everything you need to know about our airport transfer and tour services in Sri Lanka.
                        </p>
                    </div>
                </div>

                <div className="space-y-3">
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div 
                                key={index} 
                                className={`group border rounded-2xl transition-all duration-300 ${
                                    isOpen 
                                        ? 'border-emerald-500/30 bg-white dark:bg-slate-800/50 shadow-lg shadow-emerald-500/5' 
                                        : 'border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/50 hover:border-emerald-500/30 hover:shadow-md'
                                }`}
                            >
                                <button
                                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                                    className="w-full flex items-center justify-between p-4 md:p-6 text-left focus:outline-none rounded-2xl"
                                >
                                    <h3 className={`text-[11px] md:text-xs font-medium tracking-wide pr-8 transition-colors ${
                                        isOpen 
                                            ? 'text-emerald-700 dark:text-emerald-400' 
                                            : 'text-slate-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400'
                                    }`}>
                                        {faq.question}
                                    </h3>
                                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                                        isOpen 
                                            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rotate-180' 
                                            : 'bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 group-hover:text-emerald-600'
                                    }`}>
                                        <ChevronDown size={16} strokeWidth={2} />
                                    </div>
                                </button>
                                
                                <div 
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                                >
                                    <div className="p-4 md:p-6 pt-0 border-t border-slate-100 dark:border-white/5 mt-2">
                                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs md:text-sm">
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
