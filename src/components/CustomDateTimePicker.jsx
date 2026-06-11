'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

export default function CustomDateTimePicker({ date, time, onChange }) {
    const [view, setView] = useState('date'); // 'date' or 'time'
    const [viewDate, setViewDate] = useState(date ? new Date(date) : new Date());

    // --- Calendar Logic ---
    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const generateCalendarGrid = () => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        const days = [];

        // Empty slots for previous month
        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }

        // Days of current month
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }

        return days;
    };

    const handlePrevMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    };

    const handleDateClick = (d) => {
        const offset = d.getTimezoneOffset();
        const adjustedDate = new Date(d.getTime() - (offset * 60 * 1000));
        onChange(adjustedDate.toISOString().split('T')[0], time || `12:00 PM SLST`);
        setView('time');
    };

    const isSameDate = (d1, d2) => {
        if (!d1 || !d2) return false;
        const date1 = new Date(d1);
        const date2 = new Date(d2);
        return date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear();
    };

    // --- Time & Timezone Parsing (Supporting both 24h & 12h formats) ---
    let selectedHour = '12';
    let selectedMin = '00';
    let selectedPeriod = 'PM';
    let selectedTz = 'SLST';

    if (time) {
        const parts = time.trim().split(/\s+/);
        const timePart = parts[0];
        if (timePart && timePart.includes(':')) {
            let [h, m] = timePart.split(':');
            let hNum = parseInt(h, 10) || 12;
            let mNum = parseInt(m, 10) || 0;
            
            const periodPart = parts[1];
            if (periodPart && (periodPart.toUpperCase() === 'AM' || periodPart.toUpperCase() === 'PM')) {
                selectedPeriod = periodPart.toUpperCase();
                selectedHour = hNum.toString().padStart(2, '0');
            } else {
                // No AM/PM period, assume 24-hour format and convert to 12h
                if (hNum >= 12) {
                    selectedPeriod = 'PM';
                    hNum = hNum === 12 ? 12 : hNum - 12;
                } else {
                    selectedPeriod = 'AM';
                    hNum = hNum === 0 ? 12 : hNum;
                }
                selectedHour = hNum.toString().padStart(2, '0');
            }
            selectedMin = mNum.toString().padStart(2, '0');
        }
        
        // Grab timezone part
        if (parts[2]) {
            selectedTz = parts[2];
        } else if (parts[1] && parts[1] !== 'AM' && parts[1] !== 'PM') {
            selectedTz = parts[1];
        }
    }

    return (
        <div className="bg-black rounded-[2.5rem] p-6 border-4 border-[#FACC15] text-white w-full max-w-[320px] mx-auto overflow-hidden">
            {/* Header / Display */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-1">
                        {view === 'date' ? 'SELECT DATE' : 'SELECT TIME'}
                    </p>
                    <div className="flex items-baseline gap-2">
                        {view === 'date' ? (
                            <h2 className="text-2xl font-bold text-white leading-tight">
                                {date ? new Date(date + (date.includes('T') ? '' : 'T12:00:00')).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : 'Tap to select'}
                            </h2>
                        ) : (
                            <h2 className="text-3xl font-bold text-white leading-none">
                                {selectedHour}:{selectedMin} <span className="text-lg text-white/60 font-black">{selectedPeriod}</span> <span className="text-lg text-[#FACC15] font-black ml-1">{selectedTz}</span>
                            </h2>
                        )}
                    </div>
                </div>
                {/* View Switcher Icons */}
                <div className="flex gap-2">
                    <button 
                        type="button"
                        onClick={() => setView(view === 'date' ? 'time' : 'date')} 
                        className="p-2 rounded-xl border-2 border-white/10 text-white/40 hover:bg-[#FACC15] hover:text-black hover:border-black transition-colors"
                        aria-label="Toggle picker view"
                    >
                        {view === 'date' ? <Clock size={20} strokeWidth={3} /> : <Calendar size={20} strokeWidth={3} />}
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {view === 'date' ? (
                    <motion.div
                        key="calendar"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                    >
                        {/* Month Nav */}
                        <div className="flex items-center justify-between mb-4 px-2">
                            <span className="text-sm font-bold">{viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                            <div className="flex gap-2">
                                <button type="button" onClick={handlePrevMonth} className="p-1 hover:bg-[#FACC15] hover:text-black rounded-lg border-2 border-white/10"><ChevronLeft size={16} strokeWidth={3} /></button>
                                <button type="button" onClick={handleNextMonth} className="p-1 hover:bg-[#FACC15] hover:text-black rounded-lg border-2 border-white/10"><ChevronRight size={16} strokeWidth={3} /></button>
                            </div>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-7 gap-1 text-center mb-2">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                                <span key={i} className="text-[10px] font-bold text-white/40 py-1">{d}</span>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1 place-items-center max-h-[200px] overflow-y-auto no-scrollbar">
                            {generateCalendarGrid().map((d, i) => {
                                if (!d) return <div key={i} className="w-8 h-8" />;
                                const isSelected = isSameDate(d, date);
                                const isToday = isSameDate(d, new Date());
                                return (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => handleDateClick(d)}
                                        className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-black transition-all border-2
                                            ${isSelected ? 'bg-[#FACC15] text-black border-black scale-110 z-10' : 'hover:bg-white/10 text-white border-transparent'}
                                            ${isToday && !isSelected ? 'border-[#FACC15] text-[#FACC15]' : ''}
                                        `}
                                    >
                                        {d.getDate()}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="time-picker"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="py-1"
                    >
                        {/* Minimalist Dropdown selects for Hour, Minute, and AM/PM */}
                        <div className="flex gap-2 items-center justify-between my-4">
                            {/* Hour Select */}
                            <div className="flex-1 flex flex-col gap-1.5">
                                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest pl-1 leading-none">Hour</label>
                                <div className="relative">
                                    <select
                                        value={selectedHour}
                                        onChange={(e) => onChange(date, `${e.target.value}:${selectedMin} ${selectedPeriod} ${selectedTz}`)}
                                        className="w-full h-11 bg-zinc-900 border border-white/10 rounded-xl px-3 text-xs font-bold text-white focus:outline-none focus:border-[#FACC15] appearance-none cursor-pointer"
                                    >
                                        {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map(h => (
                                            <option key={h} value={h}>{h}</option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white/40">
                                        <svg className="fill-current h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Minute Select */}
                            <div className="flex-1 flex flex-col gap-1.5">
                                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest pl-1 leading-none">Minute</label>
                                <div className="relative">
                                    <select
                                        value={selectedMin}
                                        onChange={(e) => onChange(date, `${selectedHour}:${e.target.value} ${selectedPeriod} ${selectedTz}`)}
                                        className="w-full h-11 bg-zinc-900 border border-white/10 rounded-xl px-3 text-xs font-bold text-white focus:outline-none focus:border-[#FACC15] appearance-none cursor-pointer"
                                    >
                                        {['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'].map(m => (
                                            <option key={m} value={m}>{m}</option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white/40">
                                        <svg className="fill-current h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* AM/PM Select */}
                            <div className="w-20 flex flex-col gap-1.5">
                                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest pl-1 leading-none">AM/PM</label>
                                <div className="relative">
                                    <select
                                        value={selectedPeriod}
                                        onChange={(e) => onChange(date, `${selectedHour}:${selectedMin} ${e.target.value} ${selectedTz}`)}
                                        className="w-full h-11 bg-zinc-900 border border-white/10 rounded-xl px-3 text-xs font-bold text-white focus:outline-none focus:border-[#FACC15] appearance-none cursor-pointer"
                                    >
                                        <option value="AM">AM</option>
                                        <option value="PM">PM</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white/40">
                                        <svg className="fill-current h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Timezone Selector */}
                        <div className="pt-3 border-t border-white/10">
                            <label className="text-[9px] font-black text-white/40 uppercase tracking-widest block mb-1">Time Zone</label>
                            <div className="relative">
                                <select
                                    value={selectedTz}
                                    onChange={(e) => {
                                        onChange(date, `${selectedHour}:${selectedMin} ${selectedPeriod} ${e.target.value}`);
                                    }}
                                    className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-3 pr-8 py-2 text-[10px] font-black text-white focus:outline-none focus:border-[#FACC15] appearance-none"
                                >
                                    <option value="SLST">Sri Lanka Time (SLST / UTC+5:30)</option>
                                    <option value="UTC">UTC / GMT (UTC+0:00)</option>
                                    <option value="IST">India Standard Time (IST / UTC+5:30)</option>
                                    <option value="GST">Gulf Standard Time (GST / UTC+4:00)</option>
                                    <option value="SGT">Singapore Time (SGT / UTC+8:00)</option>
                                    <option value="CET">Central European Time (CET / UTC+1:00)</option>
                                    <option value="BST">British Summer Time (BST / UTC+1:00)</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-white/40">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
