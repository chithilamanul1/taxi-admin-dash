'use client';

import { useState, useEffect } from 'react';

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

// Helper to parse stored time string "12:00 PM SLST" into { time24h: "12:00", timezone: "SLST" }
function parseStoredTime(timeStr) {
    if (!timeStr) return { time24h: "12:00", timezone: "SLST" };
    
    const parts = timeStr.trim().split(/\s+/);
    const timePart = parts[0];
    if (!timePart || !timePart.includes(':')) {
        return { time24h: "12:00", timezone: "SLST" };
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
    return { time24h, timezone };
}

// Helper to format native time "13:30" and timezone "SLST" to stored format "01:30 PM SLST"
function formatStoredTime(time24h, timezone) {
    if (!time24h) time24h = "12:00";
    if (!timezone) timezone = "SLST";
    
    const [hStr, mStr] = time24h.split(':');
    let hour = parseInt(hStr, 10) || 0;
    const minute = parseInt(mStr, 10) || 0;
    
    const period = hour >= 12 ? 'PM' : 'AM';
    let hour12 = hour % 12;
    if (hour12 === 0) hour12 = 12;
    
    const h12Str = hour12.toString().padStart(2, '0');
    const mStrPad = minute.toString().padStart(2, '0');
    
    return `${h12Str}:${mStrPad} ${period} ${timezone}`;
}

export default function CustomDateTimePicker({ date, time, onChange }) {
    const initialParsed = parseStoredTime(time);
    
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime24h, setSelectedTime24h] = useState(initialParsed.time24h);
    const [selectedTz, setSelectedTz] = useState(initialParsed.timezone);

    // Sync state with props
    useEffect(() => {
        if (date) {
            setSelectedDate(date.split('T')[0]);
        } else {
            const today = new Date().toISOString().split('T')[0];
            setSelectedDate(today);
            const formattedTime = formatStoredTime(selectedTime24h, selectedTz);
            onChange(today, formattedTime);
        }
    }, [date]);

    useEffect(() => {
        if (time) {
            const parsed = parseStoredTime(time);
            setSelectedTime24h(parsed.time24h);
            setSelectedTz(parsed.timezone);
        } else {
            const defaultTime = "12:00 PM SLST";
            const parsed = parseStoredTime(defaultTime);
            setSelectedTime24h(parsed.time24h);
            setSelectedTz(parsed.timezone);
            if (selectedDate) {
                onChange(selectedDate, defaultTime);
            }
        }
    }, [time]);

    const handleDateChange = (e) => {
        const d = e.target.value;
        setSelectedDate(d);
        const formattedTime = formatStoredTime(selectedTime24h, selectedTz);
        onChange(d, formattedTime);
    };

    const handleTimeChange = (e) => {
        const t = e.target.value;
        setSelectedTime24h(t);
        const formattedTime = formatStoredTime(t, selectedTz);
        onChange(selectedDate || new Date().toISOString().split('T')[0], formattedTime);
    };

    const handleTzChange = (e) => {
        const tz = e.target.value;
        setSelectedTz(tz);
        const formattedTime = formatStoredTime(selectedTime24h, tz);
        onChange(selectedDate || new Date().toISOString().split('T')[0], formattedTime);
    };

    return (
        <div className="bg-white rounded-[2.5rem] p-6 border-4 border-[#FACC15] text-slate-900 w-full max-w-[320px] mx-auto overflow-hidden">
            <div className="mb-4">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 pl-1">
                    Select Date <span className="text-[10px] text-amber-600 font-normal normal-case">(Click field below)</span>
                </p>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#FACC15] cursor-pointer"
                />
            </div>

            <div className="mb-4">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 pl-1">
                    Select Time <span className="text-[10px] text-amber-600 font-normal normal-case">(Click field below)</span>
                </p>
                <input
                    type="time"
                    value={selectedTime24h}
                    onChange={handleTimeChange}
                    className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#FACC15] cursor-pointer"
                />
            </div>

            <div className="mb-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 pl-1">
                    Time Zone
                </p>
                <div className="relative">
                    <select
                        value={selectedTz}
                        onChange={handleTzChange}
                        className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-8 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#FACC15] appearance-none cursor-pointer"
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
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}
