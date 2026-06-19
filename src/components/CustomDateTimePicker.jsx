'use client';

import { useEffect, useState } from 'react';
import { parseStoredTime, detectLocalTimezone } from '../lib/timezone-util';

export default function CustomDateTimePicker({ date, time, onChange, className }) {
    const [dateTimeValue, setDateTimeValue] = useState('');
    const parsedTime = parseStoredTime(time);

    useEffect(() => {
        if (date) {
            const time24h = parsedTime.time24h || '12:00';
            setDateTimeValue(`${date}T${time24h}`);
        } else {
            const today = new Date().toISOString().split('T')[0];
            const defaultTime24h = '12:00';
            setDateTimeValue(`${today}T${defaultTime24h}`);
        }
    }, [date, time]);

    const handleDateChange = (e) => {
        const newDate = e.target.value;
        const time24h = parsedTime.time24h || '12:00';
        
        // Construct a full string to reuse existing logic if possible, or directly fire onChange
        const hStr = time24h.split(':')[0];
        const mStr = time24h.split(':')[1];
        let h = parseInt(hStr, 10);
        const m = parseInt(mStr, 10);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const h12 = h % 12 === 0 ? 12 : h % 12;
        const h12Pad = h12.toString().padStart(2, '0');
        const mPad = m.toString().padStart(2, '0');
        const tz = parsedTime.timezone || detectLocalTimezone() || 'SLST';
        const formattedTime = `${h12Pad}:${mPad} ${ampm} ${tz}`;
        
        onChange(newDate, formattedTime);
    };

    const handleTimeChange = (e) => {
        const newTime24 = e.target.value;
        if (!newTime24) return;
        
        const [hStr, mStr] = newTime24.split(':');
        let h = parseInt(hStr, 10);
        const m = parseInt(mStr, 10);
        
        const ampm = h >= 12 ? 'PM' : 'AM';
        const h12 = h % 12 === 0 ? 12 : h % 12;
        const h12Pad = h12.toString().padStart(2, '0');
        const mPad = m.toString().padStart(2, '0');
        
        const tz = parsedTime.timezone || detectLocalTimezone() || 'SLST';
        const formattedTime = `${h12Pad}:${mPad} ${ampm} ${tz}`;
        
        const currentDate = date || new Date().toISOString().split('T')[0];
        onChange(currentDate, formattedTime);
    };

    const dateVal = date || '';
    const timeVal = parsedTime.time24h || '';

    return (
        <div className={`flex items-center justify-between ${className || 'w-full p-2 text-sm rounded-xl border border-slate-200'}`}>
            <input
                type="date"
                value={dateVal}
                onChange={handleDateChange}
                aria-label="Pickup date"
                className="w-[55%] bg-transparent text-black font-bold outline-none cursor-pointer h-full"
                style={{ colorScheme: 'light' }}
            />
            <div className="w-[2px] h-2/3 bg-slate-200 dark:bg-slate-700 mx-2 shrink-0"></div>
            <input
                type="time"
                value={timeVal}
                onChange={handleTimeChange}
                step={1800}
                aria-label="Pickup time"
                className="w-[40%] bg-transparent text-black font-bold outline-none cursor-pointer h-full"
                style={{ colorScheme: 'light' }}
            />
        </div>
    );
}


