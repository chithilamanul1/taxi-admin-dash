'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const WORLD_TIMEZONES = [
    { value: 'SLST', label: 'Sri Lanka Time (SLST / UTC+5:30)' },
    { value: 'UTC', label: 'UTC / GMT (UTC+0:00)' },
    { value: 'IST', label: 'India Standard Time (IST / UTC+5:30)' },
    { value: 'BST', label: 'British Summer Time (BST / UTC+1:00)' },
    { value: 'GMT', label: 'Greenwich Mean Time (GMT / UTC+0:00)' },
    { value: 'EST', label: 'Eastern Standard Time (EST / UTC-5:00)' },
    { value: 'EDT', label: 'Eastern Daylight Time (EDT / UTC-4:00)' },
    { value: 'CST', label: 'Central Standard Time (CST / UTC-6:00)' },
    { value: 'CDT', label: 'Central Daylight Time (CDT / UTC-5:00)' },
    { value: 'MST', label: 'Mountain Standard Time (MST / UTC-7:00)' },
    { value: 'MDT', label: 'Mountain Daylight Time (MDT / UTC-6:00)' },
    { value: 'PST', label: 'Pacific Standard Time (PST / UTC-8:00)' },
    { value: 'PDT', label: 'Pacific Daylight Time (PDT / UTC-7:00)' },
    { value: 'AST', label: 'Atlantic Standard Time (AST / UTC-4:00)' },
    { value: 'ADT', label: 'Atlantic Daylight Time (ADT / UTC-3:00)' },
    { value: 'HST', label: 'Hawaii Standard Time (HST / UTC-10:00)' },
    { value: 'AKST', label: 'Alaska Standard Time (AKST / UTC-9:00)' },
    { value: 'GST', label: 'Gulf Standard Time (GST / UTC+4:00)' },
    { value: 'SGT', label: 'Singapore Time (SGT / UTC+8:00)' },
    { value: 'CET', label: 'Central European Time (CET / UTC+1:00)' },
    { value: 'CEST', label: 'Central European Summer Time (CEST / UTC+2:00)' },
    { value: 'EET', label: 'Eastern European Time (EET / UTC+2:00)' },
    { value: 'EEST', label: 'Eastern European Summer Time (EEST / UTC+3:00)' },
    { value: 'MSK', label: 'Moscow Standard Time (MSK / UTC+3:00)' },
    { value: 'JST', label: 'Japan Standard Time (JST / UTC+9:00)' },
    { value: 'KST', label: 'Korea Standard Time (KST / UTC+9:00)' },
    { value: 'AEST', label: 'Australian Eastern Standard Time (AEST / UTC+10:00)' },
    { value: 'AEDT', label: 'Australian Eastern Daylight Time (AEDT / UTC+11:00)' },
    { value: 'ACST', label: 'Australian Central Standard Time (ACST / UTC+9:30)' },
    { value: 'ACDT', label: 'Australian Central Daylight Time (ACDT / UTC+10:30)' },
    { value: 'AWST', label: 'Australian Western Standard Time (AWST / UTC+8:00)' },
    { value: 'NZST', label: 'New Zealand Standard Time (NZST / UTC+12:00)' },
    { value: 'NZDT', label: 'New Zealand Daylight Time (NZDT / UTC+13:00)' },
    { value: 'UTC-12:00', label: 'UTC-12:00 (Baker Island)' },
    { value: 'UTC-11:00', label: 'UTC-11:00 (Niue / Samoa)' },
    { value: 'UTC-10:00', label: 'UTC-10:00 (Tahiti)' },
    { value: 'UTC-09:30', label: 'UTC-09:30 (Marquesas Islands)' },
    { value: 'UTC-09:00', label: 'UTC-09:00 (Gambier Islands)' },
    { value: 'UTC-08:00', label: 'UTC-08:00 (Pitcairn Islands)' },
    { value: 'UTC-07:00', label: 'UTC-07:00 (MST)' },
    { value: 'UTC-06:00', label: 'UTC-06:00 (Galapagos)' },
    { value: 'UTC-05:00', label: 'UTC-05:00 (Peru / Ecuador)' },
    { value: 'UTC-04:30', label: 'UTC-04:30 (Venezuela)' },
    { value: 'UTC-04:00', label: 'UTC-04:00 (Bolivia)' },
    { value: 'UTC-03:30', label: 'UTC-03:30 (Newfoundland)' },
    { value: 'UTC-03:00', label: 'UTC-03:00 (Argentina / Chile)' },
    { value: 'UTC-02:00', label: 'UTC-02:00 (South Georgia)' },
    { value: 'UTC-01:00', label: 'UTC-01:00 (Azores / Cape Verde)' },
    { value: 'UTC+01:00', label: 'UTC+01:00 (West Africa)' },
    { value: 'UTC+02:00', label: 'UTC+02:00 (Egypt / Central Africa)' },
    { value: 'UTC+03:00', label: 'UTC+03:00 (Saudi Arabia / East Africa)' },
    { value: 'UTC+03:30', label: 'UTC+03:30 (Iran)' },
    { value: 'UTC+04:00', label: 'UTC+04:00 (Azerbaijan / UAE)' },
    { value: 'UTC+04:30', label: 'UTC+04:30 (Afghanistan)' },
    { value: 'UTC+05:00', label: 'UTC+05:00 (Pakistan / Maldives)' },
    { value: 'UTC+05:30', label: 'UTC+05:30 (India / Sri Lanka)' },
    { value: 'UTC+05:45', label: 'UTC+05:45 (Nepal)' },
    { value: 'UTC+06:00', label: 'UTC+06:00 (Bangladesh / Bhutan)' },
    { value: 'UTC+06:30', label: 'UTC+06:30 (Myanmar / Cocos)' },
    { value: 'UTC+07:00', label: 'UTC+07:00 (Thailand / Vietnam)' },
    { value: 'UTC+08:00', label: 'UTC+08:00 (Hong Kong / Beijing)' },
    { value: 'UTC+08:45', label: 'UTC+08:45 (Eucla)' },
    { value: 'UTC+09:00', label: 'UTC+09:00 (Japan / Korea)' },
    { value: 'UTC+09:30', label: 'UTC+09:30 (Darwin)' },
    { value: 'UTC+10:00', label: 'UTC+10:00 (Queensland)' },
    { value: 'UTC+10:30', label: 'UTC+10:30 (Lord Howe)' },
    { value: 'UTC+11:00', label: 'UTC+11:00 (Solomon Islands)' },
    { value: 'UTC+11:30', label: 'UTC+11:30 (Norfolk Island)' },
    { value: 'UTC+12:00', label: 'UTC+12:00 (Fiji)' },
    { value: 'UTC+12:45', label: 'UTC+12:45 (Chatham Islands)' },
    { value: 'UTC+13:00', label: 'UTC+13:00 (Samoa / Tonga)' },
    { value: 'UTC+14:00', label: 'UTC+14:00 (Kiritimati)' }
];

const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
        for (let min of [0, 30]) {
            const h12 = hour % 12 === 0 ? 12 : hour % 12;
            const period = hour >= 12 ? 'PM' : 'AM';
            slots.push(`${h12}:${min.toString().padStart(2, '0')} ${period}`);
        }
    }
    return slots;
};

// Helper to parse stored time string "12:00 PM SLST" into { time24h: "12:00", time12h: "12:00 PM", timezone: "SLST" }
function parseStoredTime(timeStr) {
    if (!timeStr) return { time24h: "12:00", time12h: "12:00 PM", timezone: "SLST" };
    
    const parts = timeStr.trim().split(/\s+/);
    const timePart = parts[0];
    if (!timePart || !timePart.includes(':')) {
        return { time24h: "12:00", time12h: "12:00 PM", timezone: "SLST" };
    }
    
    let [hStr, mStr] = timePart.split(':');
    let hour = parseInt(hStr, 10) || 0;
    let minute = parseInt(mStr, 10) || 0;
    
    let period = '';
    let timezone = 'SLST';
    
    if (parts[1]) {
        const pUpper = parts[1].toUpperCase();
        if (pUpper === 'AM' || pUpper === 'PM') {
            period = pUpper;
            if (parts[2]) {
                timezone = parts[2];
            }
        } else {
            timezone = parts[1];
        }
    }
    
    if (period) {
        if (period === 'PM' && hour < 12) hour += 12;
        if (period === 'AM' && hour === 12) hour = 0;
    }
    
    const time24h = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const finalPeriod = hour >= 12 ? 'PM' : 'AM';
    const time12h = `${hour12}:${minute.toString().padStart(2, '0')} ${finalPeriod}`;
    
    return { time24h, time12h, timezone };
}

// Helper to format slot time "9:30 PM" and timezone "SLST" to stored format "09:30 PM SLST"
function formatStoredTime(slotTime, timezone) {
    if (!slotTime) slotTime = "12:00 PM";
    if (!timezone) timezone = "SLST";
    
    const parts = slotTime.split(' ');
    const timePart = parts[0];
    const period = parts[1];
    
    const [hStr, mStr] = timePart.split(':');
    let hour = parseInt(hStr, 10) || 12;
    const minute = parseInt(mStr, 10) || 0;
    
    const hPad = hour.toString().padStart(2, '0');
    const mPad = minute.toString().padStart(2, '0');
    
    return `${hPad}:${mPad} ${period} ${timezone}`;
}

const generateCalendarGrid = (viewDate) => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    
    const firstDayIndex = new Date(year, month, 1).getDay(); 
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    const days = [];
    
    // Previous month filler days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
        const d = daysInPrevMonth - i;
        days.push({
            day: d,
            isCurrentMonth: false,
            date: new Date(year, month - 1, d)
        });
    }
    
    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
        days.push({
            day: d,
            isCurrentMonth: true,
            date: new Date(year, month, d)
        });
    }
    
    // Next month filler days (fill to 35 slots if possible, else 42)
    const totalSlots = days.length <= 35 ? 35 : 42;
    const nextMonthDaysCount = totalSlots - days.length;
    for (let d = 1; d <= nextMonthDaysCount; d++) {
        days.push({
            day: d,
            isCurrentMonth: false,
            date: new Date(year, month + 1, d)
        });
    }
    
    return days;
};

export default function CustomDateTimePicker({ date, time, onChange }) {
    const initialParsed = parseStoredTime(time);
    const slots = generateTimeSlots();

    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime12h, setSelectedTime12h] = useState(initialParsed.time12h);
    const [selectedTz, setSelectedTz] = useState(initialParsed.timezone);

    const [viewDate, setViewDate] = useState(new Date());
    
    const activeTimeRef = useRef(null);

    // Sync state with props
    useEffect(() => {
        if (date) {
            const parsedDate = new Date(date);
            setSelectedDate(date.split('T')[0]);
            setViewDate(parsedDate);
        } else {
            const today = new Date().toISOString().split('T')[0];
            setSelectedDate(today);
            setViewDate(new Date());
            const formattedTime = formatStoredTime(selectedTime12h, selectedTz);
            onChange(today, formattedTime);
        }
    }, [date]);

    useEffect(() => {
        if (time) {
            const parsed = parseStoredTime(time);
            setSelectedTime12h(parsed.time12h);
            setSelectedTz(parsed.timezone);
        } else {
            const defaultTime = "12:00 PM SLST";
            const parsed = parseStoredTime(defaultTime);
            setSelectedTime12h(parsed.time12h);
            setSelectedTz(parsed.timezone);
            if (selectedDate) {
                onChange(selectedDate, defaultTime);
            }
        }
    }, [time]);

    // Scroll active time slot into view when rendered
    useEffect(() => {
        if (activeTimeRef.current) {
            activeTimeRef.current.scrollIntoView({ block: 'nearest', behavior: 'instant' });
        }
    }, [selectedTime12h]);

    const handlePrevMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    };

    const handleDateClick = (dayObj) => {
        if (!dayObj.isCurrentMonth) return;
        const dStr = dayObj.date.toISOString().split('T')[0];
        setSelectedDate(dStr);
        const formattedTime = formatStoredTime(selectedTime12h, selectedTz);
        onChange(dStr, formattedTime);
    };

    const handleTimeClick = (slot) => {
        setSelectedTime12h(slot);
        const formattedTime = formatStoredTime(slot, selectedTz);
        onChange(selectedDate || new Date().toISOString().split('T')[0], formattedTime);
    };

    const handleTzChange = (e) => {
        const tz = e.target.value;
        setSelectedTz(tz);
        const formattedTime = formatStoredTime(selectedTime12h, tz);
        onChange(selectedDate || new Date().toISOString().split('T')[0], formattedTime);
    };

    const isSameDate = (d1, d2) => {
        if (!d1 || !d2) return false;
        const date1 = new Date(d1);
        const date2 = new Date(d2);
        return date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear();
    };

    const calendarGrid = generateCalendarGrid(viewDate);

    return (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl text-slate-800 w-[385px] mx-auto overflow-hidden animate-fade-in">
            {/* Top split panel */}
            <div className="flex divide-x divide-slate-200">
                {/* Left side: Calendar Grid */}
                <div className="w-[245px] p-4 flex flex-col justify-between">
                    <div>
                        {/* Month Selector header */}
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-[13px] font-black text-slate-800 tracking-wide">
                                {viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </span>
                            <div className="flex gap-1.5">
                                <button type="button" onClick={handlePrevMonth} className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors border border-slate-150">
                                    <ChevronLeft size={14} strokeWidth={2.5} />
                                </button>
                                <button type="button" onClick={handleNextMonth} className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors border border-slate-150">
                                    <ChevronRight size={14} strokeWidth={2.5} />
                                </button>
                            </div>
                        </div>

                        {/* Week headers */}
                        <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d, i) => (
                                <span key={i} className="text-[10px] font-bold text-slate-400 py-1">{d}</span>
                            ))}
                        </div>

                        {/* Day numbers grid */}
                        <div className="grid grid-cols-7 gap-1 place-items-center">
                            {calendarGrid.map((dayObj, i) => {
                                const isSelected = dayObj.isCurrentMonth && isSameDate(dayObj.date, selectedDate);
                                const isToday = dayObj.isCurrentMonth && isSameDate(dayObj.date, new Date());
                                
                                return (
                                    <button
                                        key={i}
                                        type="button"
                                        disabled={!dayObj.isCurrentMonth}
                                        onClick={() => handleDateClick(dayObj)}
                                        className={`w-7 h-7 flex items-center justify-center rounded-lg text-[11px] font-bold transition-all
                                            ${!dayObj.isCurrentMonth 
                                                ? 'text-slate-300 cursor-default font-normal' 
                                                : isSelected 
                                                    ? 'bg-[#1E5A95] text-white border-2 border-black rounded-lg scale-105 shadow-sm' 
                                                    : 'hover:bg-slate-100 text-slate-800'
                                            }
                                            ${isToday && !isSelected ? 'text-[#1E5A95] font-black underline decoration-2' : ''}
                                        `}
                                    >
                                        {dayObj.day}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right side: Time Slots Dropdown List */}
                <div className="w-[140px] flex flex-col bg-slate-50">
                    <div className="text-[11px] font-black text-slate-500 uppercase tracking-widest text-center py-2.5 border-b border-slate-200">
                        Time
                    </div>
                    <div className="flex-1 overflow-y-auto max-h-[225px] custom-scrollbar p-1.5">
                        {slots.map((slot) => {
                            const isSelected = slot === selectedTime12h;
                            return (
                                <button
                                    key={slot}
                                    type="button"
                                    ref={isSelected ? activeTimeRef : null}
                                    onClick={() => handleTimeClick(slot)}
                                    className={`w-full text-center py-1.5 text-[11px] font-bold transition-colors rounded-lg mb-1 last:mb-0 block
                                        ${isSelected 
                                            ? 'bg-[#1E5A95] text-white' 
                                            : 'text-slate-700 hover:bg-slate-200'
                                        }`}
                                >
                                    {slot}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Timezone and Actions Panel */}
            <div className="p-3 border-t border-slate-200 bg-white flex flex-col gap-2">
                <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1 pl-1">Time Zone</label>
                    <div className="relative">
                        <select
                            value={selectedTz}
                            onChange={handleTzChange}
                            className="w-full h-8 bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-8 text-[10px] font-bold text-slate-700 focus:outline-none focus:border-[#FACC15] appearance-none cursor-pointer"
                        >
                            {(() => {
                                const tzList = [...WORLD_TIMEZONES];
                                if (selectedTz && !tzList.some(tz => tz.value.toUpperCase() === selectedTz.toUpperCase())) {
                                    tzList.unshift({ value: selectedTz, label: `${selectedTz} (Selected)` });
                                }
                                return tzList.map(tz => (
                                    <option key={tz.value} value={tz.value}>{tz.label}</option>
                                ));
                            })()}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                            <svg className="fill-current h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
