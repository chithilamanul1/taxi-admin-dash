'use client';

import React, { useState, useEffect } from 'react';
import {
    Sparkles, MapPin, Calendar, Users, ArrowRight, Loader2,
    CheckCircle, MessageCircle, Navigation, Info, Clock,
    ChevronRight, Mountain, Landmark, Waves, Camera
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import TripMap from '@/components/TripMap';

export default function TripPlannerClient() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isGenerating, setIsGenerating] = useState(false);
    const [itinerary, setItinerary] = useState(null);
    const [formData, setFormData] = useState({
        prompt: '',
        duration: 5,
        travelers: 2,
        interests: []
    });

    const interestOptions = [
        { id: 'beach', label: 'Beaches', icon: <Waves size={16} /> },
        { id: 'culture', label: 'Culture & Temples', icon: <Landmark size={16} /> },
        { id: 'nature', label: 'Wildlife & Nature', icon: <Mountain size={16} /> },
        { id: 'adventure', label: 'Adventure', icon: <Navigation size={16} /> },
        { id: 'photography', label: 'Photography', icon: <Camera size={16} /> },
    ];

    const handleInterestToggle = (id) => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests.includes(id)
                ? prev.interests.filter(i => i !== id)
                : [...prev.interests, id]
        }));
    };

    const generateTrip = async () => {
        setIsGenerating(true);
        try {
            const res = await fetch('/api/ai-trip-planner', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: formData.prompt,
                    duration: formData.duration,
                    travelers: formData.travelers,
                    interests: formData.interests.join(', ')
                })
            });
            const result = await res.json();
            if (result.success) {
                setItinerary(result.data);
                setStep(2);
            } else {
                alert(result.message || "Failed to generate itinerary.");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred while generating your trip.");
        } finally {
            setIsGenerating(false);
        }
    };

    if (itinerary && step === 2) {
        return (
            <div className="min-h-screen bg-white pt-24 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <div>
                            <div className="flex items-center gap-2 text-amber-500 mb-2">
                                <Sparkles size={20} className="fill-amber-500" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">AI-Generated Masterpiece</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-none mb-4">
                                {itinerary.title}
                            </h1>
                            <p className="text-slate-500 max-w-2xl text-lg font-medium">{itinerary.description}</p>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => setStep(1)} className="px-6 py-4 rounded-2xl border border-slate-100 font-bold hover:bg-slate-50 transition-colors">
                                Edit Prompt
                            </button>
                            <button
                                onClick={() => {
                                    const text = encodeURIComponent(`Hi, I'm interested in the AI trip: ${itinerary.title}. Itinerary includes ${itinerary.destinations?.join(', ')}.`);
                                    window.open(`https://wa.me/+94716885880?text=${text}`, '_blank');
                                }}
                                className="px-8 py-4 bg-amber-500 text-white rounded-2xl font-black shadow-xl shadow-amber-200 hover:scale-[1.02] transition-all flex items-center gap-2"
                            >
                                <MessageCircle size={20} /> Book this Itinerary
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Map & List */}
                        <div className="lg:col-span-12">
                            <div className="bg-slate-900 rounded-[3rem] p-4 h-[500px] shadow-2xl relative overflow-hidden mb-12">
                                <TripMap
                                    pickup={itinerary.destinations?.[0] ? { name: itinerary.destinations[0] } : null}
                                    dropoff={itinerary.destinations?.length > 1 ? { name: itinerary.destinations[itinerary.destinations.length - 1] } : null}
                                    waypoints={itinerary.destinations?.slice(1, -1).map(d => ({ name: d })) || []}
                                />
                            </div>
                        </div>

                        {/* Itinerary Steps */}
                        <div className="lg:col-span-8 space-y-8">
                            <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                                    <Calendar className="text-amber-500" size={20} />
                                </div>
                                Recommended Schedule
                            </h2>
                            <div className="space-y-4 relative">
                                <div className="absolute left-8 top-10 bottom-10 w-0.5 bg-slate-100" />
                                {itinerary.days?.map((day, idx) => (
                                    <div key={idx} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-100/50 hover:border-amber-200 transition-all group relative">
                                        <div className="flex flex-col md:flex-row gap-8 items-start">
                                            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex flex-col items-center justify-center font-black text-white shrink-0 group-hover:bg-amber-500 group-hover:rotate-6 transition-all duration-500 shadow-xl">
                                                <span className="text-[10px] uppercase tracking-tighter opacity-60">Day</span>
                                                <span className="text-2xl -mt-1">{day.day}</span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-500 mb-1">
                                                    <MapPin size={12} /> {day.location}
                                                </div>
                                                <h3 className="text-2xl font-black text-slate-800 mb-4">{day.title}</h3>
                                                <p className="text-slate-500 text-lg leading-relaxed mb-6 font-medium">{day.description}</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {day.activities?.map((act, i) => (
                                                        <span key={i} className="px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">
                                                            {act}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-4 space-y-8">
                            <div className="bg-amber-50 rounded-[3rem] p-10 border border-amber-100 sticky top-28">
                                <h4 className="text-xl font-black text-slate-900 mb-4">Trip Highlights</h4>
                                <div className="space-y-4">
                                    {itinerary.destinations?.map((dest, i) => (
                                        <div key={i} className="flex items-center gap-4 text-slate-600 font-bold">
                                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs font-black text-amber-500 shadow-sm">{i + 1}</div>
                                            {dest}
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-12 pt-12 border-t border-amber-200">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                            <Info className="text-amber-500" />
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Need Adjustments?</span>
                                            <span className="text-sm font-black text-slate-900">Custom pricing required</span>
                                        </div>
                                    </div>
                                    <p className="text-slate-500 text-xs font-medium leading-relaxed mb-8">
                                        This itinerary is generated based on your session interests. Final pricing depends on chosen vehicle and hotel standards.
                                    </p>
                                    <button
                                        onClick={() => window.open('https://wa.me/+94716885880', '_blank')}
                                        className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black transition-transform hover:scale-[1.02] shadow-xl"
                                    >
                                        Get Exact Quote
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 text-amber-600 rounded-full mb-6">
                        <Sparkles size={16} className="fill-amber-500/20" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Next-Gen Travel Planning</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-[0.9]">
                        Design your <br /> <span className="text-amber-500">Dream Journey</span>
                    </h1>
                    <p className="text-slate-500 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                        Tell our AI about your dream vacation in Sri Lanka, and we'll craft a personalized itinerary just for you in seconds.
                    </p>
                </div>

                <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-2xl shadow-slate-200 border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

                    <div className="space-y-12">
                        {/* Prompt Input */}
                        <div className="space-y-4">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">What kind of trip are you looking for?</label>
                            <textarea
                                value={formData.prompt}
                                onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                                placeholder="E.g. I want a 10-day luxury honeymoon starting from Colombo, involving nature, tea estates, and a beach stay at the end."
                                className="w-full h-40 bg-slate-50 rounded-[2.5rem] p-10 text-xl font-medium text-slate-900 outline-none border-2 border-transparent focus:border-amber-500/20 focus:bg-white transition-all resize-none shadow-inner uppercase-placeholder"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {/* Duration */}
                            <div className="space-y-4">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">How many days?</label>
                                <div className="flex items-center bg-slate-50 rounded-3xl p-4 gap-4 border border-slate-100">
                                    <button
                                        onClick={() => setFormData(prev => ({ ...prev, duration: Math.max(1, prev.duration - 1) }))}
                                        className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl shadow-sm hover:text-amber-500 transition-colors font-black text-2xl"
                                    > - </button>
                                    <div className="flex-1 text-center">
                                        <span className="text-3xl font-black text-slate-900">{formData.duration}</span>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Days</span>
                                    </div>
                                    <button
                                        onClick={() => setFormData(prev => ({ ...prev, duration: prev.duration + 1 }))}
                                        className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl shadow-sm hover:text-amber-500 transition-colors font-black text-2xl"
                                    > + </button>
                                </div>
                            </div>

                            {/* Travelers */}
                            <div className="space-y-4">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Number of Travelers?</label>
                                <div className="flex items-center bg-slate-50 rounded-3xl p-4 gap-4 border border-slate-100">
                                    <Calendar className="text-amber-500 ml-2" size={24} />
                                    <select
                                        value={formData.travelers}
                                        onChange={(e) => setFormData({ ...formData, travelers: parseInt(e.target.value) })}
                                        className="flex-1 bg-transparent text-2xl font-black text-slate-900 outline-none appearance-none cursor-pointer"
                                    >
                                        {[1, 2, 3, 4, 5, 6, 8, 10, 15].map(n => (
                                            <option key={n} value={n}>{n} Persons</option>
                                        ))}
                                    </select>
                                    <ChevronRight className="text-slate-300 mr-2" />
                                </div>
                            </div>
                        </div>

                        {/* Interests */}
                        <div className="space-y-6">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Primary Interests</label>
                            <div className="flex flex-wrap gap-3">
                                {interestOptions.map(opt => (
                                    <button
                                        key={opt.id}
                                        onClick={() => handleInterestToggle(opt.id)}
                                        className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border ${formData.interests.includes(opt.id)
                                                ? 'bg-amber-500 border-amber-500 text-white shadow-xl shadow-amber-200 scale-105'
                                                : 'bg-white border-slate-100 text-slate-400 hover:border-amber-200'
                                            }`}
                                    >
                                        {opt.icon} {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="pt-8">
                            <button
                                onClick={generateTrip}
                                disabled={isGenerating || !formData.prompt}
                                className="w-full py-8 bg-slate-900 text-white rounded-[2.5rem] font-black text-2xl shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-4 relative overflow-hidden group"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="animate-spin" size={32} />
                                        Crafting your itinerary...
                                    </>
                                ) : (
                                    <>
                                        Generate My Trip <Sparkles className="fill-white" />
                                        <div className="absolute inset-0 bg-amber-500 translate-y-full group-hover:translate-y-0 transition-transform -z-10 bg-opacity-10"></div>
                                    </>
                                )}
                            </button>
                            <p className="text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mt-8">Powered by Airport Taxis Intelligence</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
