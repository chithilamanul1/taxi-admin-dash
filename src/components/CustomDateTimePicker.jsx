'use client';

import { useEffect, useState } from 'react';
import { parseStoredTime, detectLocalTimezone } from '../lib/timezone-util';

export default function CustomDateTimePicker({ date, time, onChange }) {
    const [dateTimeValue, setDateTimeValue] = useState('');
    const parsedTime = parseStoredTime(time);

    // Sync from props
    useEffect(() => {
        if (date) {
            const time24h = parsedTime.time24h || '12:00';
            setDateTimeValue(`${date}T${time24h}`);
        } else {
            // Provide a default if not set
            const today = new Date().toISOString().split('T')[0];
            const defaultTime24h = '12:00';
            setDateTimeValue(`${today}T${defaultTime24h}`);
        }
    }, [date, time]);

    const handleChange = (e) => {
        const val = e.target.value;
        setDateTimeValue(val);
        
        if (!val) return;
        
        const [newDate, newTime24] = val.split('T');
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
        
        onChange(newDate, formattedTime);
    };

    return (
        <div className="w-full">
            <input
                type="datetime-local"
                value={dateTimeValue}
                onChange={handleChange}
                step={1800} // 30 minute intervals
                className="w-full bg-white text-black font-bold p-4 rounded-xl border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FACC15] cursor-pointer color-scheme-light"
                style={{ colorScheme: 'light' }}
            />
        </div>
    );
}

