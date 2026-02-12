'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

export default function CustomDateTimePicker({ date, time, onChange }) {
    const [view, setView] = useState('date'); // 'date' or 'time'
    const [viewDate, setViewDate] = useState(date ? new Date(date) : new Date());
    const [ampm, setAmpm] = useState(time ? (parseInt(time.split(':')[0]) >= 12 ? 'PM' : 'AM') : 'AM');
    const [clockMode, setClockMode] = useState('hours'); // 'hours' or 'minutes'

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
        onChange(d.toISOString().split('T')[0], time);
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

    // --- Clock Logic ---
    const hours = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

    const handleTimeSelect = (val) => {
        if (clockMode === 'hours') {
            // Set hour, preserve minute if exists, default to 00
            const currentMin = time ? time.split(':')[1] : '00';
            // Convert to 24h for storage
            let hour24 = val;
            if (ampm === 'PM' && val !== 12) hour24 += 12;
            if (ampm === 'AM' && val === 12) hour24 = 0;

            onChange(date, `${hour24.toString().padStart(2, '0')}:${currentMin}`);
            setClockMode('minutes');
        } else {
            // Set minute, preserve hour
            const currentHour = time ? time.split(':')[0] : '12';
            onChange(date, `${currentHour}:${val.toString().padStart(2, '0')}`);
            // Don't close, user might want to adjust
        }
    };

    // Calculate rotation for clock hand
    const getHandRotation = () => {
        if (!time) return 0;
        const [h, m] = time.split(':').map(Number);
        if (clockMode === 'hours') {
            const h12 = h % 12 || 12;
            return (h12 / 12) * 360;
        } else {
            return (m / 60) * 360;
        }
    };

    const formatTimeDisplay = () => {
        if (!time) return { h: '--', m: '--' };
        let [h, m] = time.split(':');
        let hInt = parseInt(h);
        let displayH = hInt % 12 || 12;
        return { h: displayH.toString().padStart(2, '0'), m };
    };

    const timeDisplay = formatTimeDisplay();

    return (
        <div className="bg-[#212121] rounded-3xl p-6 border border-white/10 text-white w-full max-w-[320px] mx-auto shadow-2xl">
            {/* Header / Display */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-1">
                        {view === 'date' ? 'SELECT DATE' : 'SELECT TIME'}
                    </p>
                    <div className="flex items-baseline gap-2">
                        {view === 'date' ? (
                            <h2 className="text-3xl font-bold text-white">
                                {date ? new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : 'Tap to select'}
                            </h2>
                        ) : (
                            <div className="flex items-end gap-2">
                                <div className="flex text-5xl font-thin tracking-tight">
                                    <button
                                        onClick={() => setClockMode('hours')}
                                        className={`${clockMode === 'hours' ? 'text-white' : 'text-white/40'} transition-colors`}
                                    >
                                        {timeDisplay.h}
                                    </button>
                                    <span className="text-white/40 mb-1 mx-0.5">:</span>
                                    <button
                                        onClick={() => setClockMode('minutes')}
                                        className={`${clockMode === 'minutes' ? 'text-white' : 'text-white/40'} transition-colors`}
                                    >
                                        {timeDisplay.m}
                                    </button>
                                </div>
                                <div className="flex flex-col gap-1 mb-1.5 ml-1">
                                    <button onClick={() => setAmpm('AM')} className={`text-xs font-bold ${ampm === 'AM' ? 'text-white' : 'text-white/40'}`}>AM</button>
                                    <button onClick={() => setAmpm('PM')} className={`text-xs font-bold ${ampm === 'PM' ? 'text-white' : 'text-white/40'}`}>PM</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {/* View Switcher Icons */}
                <div className="flex gap-2">
                    <button onClick={() => setView('date')} className={`p-2 rounded-full ${view === 'date' ? 'bg-white/10 text-white' : 'text-white/40 hover:bg-white/5'}`}>
                        <Calendar size={20} />
                    </button>
                    <button onClick={() => setView('time')} className={`p-2 rounded-full ${view === 'time' ? 'bg-white/10 text-white' : 'text-white/40 hover:bg-white/5'}`}>
                        <Clock size={20} />
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
                                <button onClick={handlePrevMonth} className="p-1 hover:bg-white/10 rounded-full"><ChevronLeft size={16} /></button>
                                <button onClick={handleNextMonth} className="p-1 hover:bg-white/10 rounded-full"><ChevronRight size={16} /></button>
                            </div>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-7 gap-1 text-center mb-2">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                                <span key={i} className="text-[10px] font-bold text-white/40 py-1">{d}</span>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1 place-items-center">
                            {generateCalendarGrid().map((d, i) => {
                                if (!d) return <div key={i} className="" />;
                                const isSelected = isSameDate(d, date);
                                const isToday = isSameDate(d, new Date());
                                return (
                                    <button
                                        key={i}
                                        onClick={() => handleDateClick(d)}
                                        className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-all
                                            ${isSelected ? 'bg-[#90CAF9] text-black font-bold shadow-lg scale-110' : 'hover:bg-white/10 text-white'}
                                            ${isToday && !isSelected ? 'border border-[#90CAF9] text-[#90CAF9]' : ''}
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
                        key="clock"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex justify-center items-center py-4"
                    >
                        <div className="relative w-64 h-64 bg-[#2b2b2b] rounded-full flex items-center justify-center shadow-inner">
                            {/* Center Dot */}
                            <div className="absolute w-2 h-2 bg-[#90CAF9] rounded-full z-20"></div>

                            {/* Hand */}
                            <div
                                className="absolute w-0.5 h-[40%] bg-[#90CAF9] bottom-1/2 origin-bottom transition-transform duration-300 z-10"
                                style={{ transform: `rotate(${getHandRotation()}deg)` }}
                            >
                                <div className="absolute -top-1 -left-2 w-5 h-5 bg-[#90CAF9] rounded-full flex items-center justify-center">
                                    <div className="w-1 h-1 bg-black rounded-full"></div>
                                </div>
                            </div>

                            {/* Numbers */}
                            {(clockMode === 'hours' ? hours : minutes).map((val, i) => {
                                const angle = (i * 30) - 90; // -90 to start at 12
                                const radius = 40; // Approx % from center
                                const x = 50 + radius * Math.cos(angle * Math.PI / 180);
                                const y = 50 + radius * Math.sin(angle * Math.PI / 180);
                                const isSelected = clockMode === 'hours'
                                    ? parseInt(timeDisplay.h) === (val % 12 || 12)
                                    : parseInt(timeDisplay.m) === val;

                                return (
                                    <button
                                        key={val}
                                        onClick={() => handleTimeSelect(val)}
                                        className={`absolute w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium transition-all z-20
                                            ${isSelected ? 'text-black' : 'text-white hover:text-[#90CAF9]'}
                                        `}
                                        style={{
                                            left: `${x}%`,
                                            top: `${y}%`,
                                            transform: 'translate(-50%, -50%)'
                                        }}
                                    >
                                        {clockMode === 'minutes' ? val.toString().padStart(2, '0') : val}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
