import React from 'react';
import { Car, CheckCircle2, Phone, UserCircle as UserIcon } from 'lucide-react';

// Simple user icon component
const User = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
)

const RENTALS = [
    {
        id: 1,
        title: "Self Drive",
        subtitle: "Freedom to explore",
        icon: Car,
        price: "Fr Rs 8,000/day",
        features: ["Fully Insured", "Unlimited Km options", "Roadside Assist"]
    },
    {
        id: 2,
        title: "With Driver",
        subtitle: "Relax & Travel",
        icon: User,
        price: "Fr Rs 12,000/day",
        features: ["Professional Driver", "Fuel Included", "No Liability"]
    }
];

const RentalsWidget = () => {
    return (
        <div className="animate-fade-in text-center py-8">
            <h3 className="text-2xl font-bold text-emerald-900 mb-2">Rent a Vehicle</h3>
            <p className="text-emerald-900/60 mb-8 max-w-lg mx-auto">Choose from our wide range of premium vehicles for your personal travel needs.</p>

            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                {RENTALS.map((item) => (
                    <div key={item.id} className="bg-emerald-50/50 border border-emerald-900/10 p-6 rounded-2xl hover:border-emerald-600 hover:shadow-lg transition-all text-left">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4 text-emerald-600">
                            <item.icon size={24} />
                        </div>
                        <h4 className="text-lg font-bold text-emerald-900">{item.title}</h4>
                        <p className="text-sm text-gray-500 mb-4">{item.subtitle}</p>

                        <div className="space-y-2 mb-6">
                            {item.features.map((feat, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-emerald-900/80">
                                    <CheckCircle2 size={14} className="text-emerald-600" /> {feat}
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center justify-between mt-auto">
                            <span className="font-bold text-emerald-900">{item.price}</span>
                            <button className="px-4 py-2 bg-emerald-900 text-white text-xs font-bold rounded-lg hover:bg-emerald-800 transition-colors">
                                Inquire
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 p-4 bg-emerald-900/10 rounded-xl inline-flex items-center gap-4 text-emerald-900 font-bold text-sm">
                <Phone size={16} />
                <span>Call for Custom Packages: +94 722 885 885</span>
            </div>
        </div>
    )
}

export default RentalsWidget;
