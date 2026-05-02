import Link from 'next/link';
import { Sparkles, ArrowRight, Map, Clock, DollarSign } from 'lucide-react';

export default function AITripPlannerBanner() {
    return (
        <section className="py-24 bg-slate-50 border-t border-slate-100 overflow-hidden relative">
            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 rounded-[3rem] p-10 md:p-16 relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-12 border border-emerald-800">
                    
                    {/* Background glow */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-[3rem] pointer-events-none">
                        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl"></div>
                    </div>

                    <div className="relative z-10 max-w-xl text-center md:text-left">
                        <div className="inline-flex items-center gap-2 bg-emerald-800/50 backdrop-blur-sm border border-emerald-700/50 text-emerald-200 px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase mb-6">
                            <Sparkles size={14} className="text-emerald-400" /> New Feature
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight tracking-tighter">
                            PLAN YOUR TRIP <br />
                            <span className="text-emerald-400">WITH AI FOR FREE</span>
                        </h2>
                        <p className="text-emerald-100/80 text-base md:text-lg mb-10 leading-relaxed font-medium">
                            Don't know where to go? Let our intelligent AI create a personalized, day-by-day Sri Lanka itinerary complete with transport cost estimates based on your exact interests and travel dates.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <Link href="/trip-planner" className="w-full sm:w-auto bg-emerald-400 hover:bg-emerald-300 text-emerald-950 px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-emerald-400/20 flex items-center justify-center gap-3 hover:-translate-y-1">
                                <Sparkles size={18} /> Try AI Trip Planner
                            </Link>
                        </div>
                    </div>

                    <div className="relative z-10 w-full md:w-1/3 grid grid-cols-1 gap-4">
                        <div className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex items-start gap-4">
                            <div className="bg-emerald-500/20 p-3 rounded-lg text-emerald-300">
                                <Map size={24} />
                            </div>
                            <div>
                                <h4 className="text-white font-bold mb-1">Custom Routes</h4>
                                <p className="text-emerald-100/70 text-xs">Tailored entirely to your interests</p>
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex items-start gap-4 transform md:-translate-x-6">
                            <div className="bg-emerald-500/20 p-3 rounded-lg text-emerald-300">
                                <Clock size={24} />
                            </div>
                            <div>
                                <h4 className="text-white font-bold mb-1">Instant Itinerary</h4>
                                <p className="text-emerald-100/70 text-xs">Generated in seconds, day-by-day</p>
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex items-start gap-4">
                            <div className="bg-emerald-500/20 p-3 rounded-lg text-emerald-300">
                                <DollarSign size={24} />
                            </div>
                            <div>
                                <h4 className="text-white font-bold mb-1">Price Estimates</h4>
                                <p className="text-emerald-100/70 text-xs">Accurate transport cost forecasts</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
