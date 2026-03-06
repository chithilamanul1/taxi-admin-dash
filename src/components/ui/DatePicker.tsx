import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';

interface DatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({ label, error, className = '', ...props }) => {
    return (
        <div className="w-full space-y-1.5">
            {label && <label className="text-sm font-medium text-gray-300 ml-1">{label}</label>}
            <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-emerald-600">
                    <CalendarIcon size={18} />
                </div>
                <input
                    type="date"
                    className={`
            w-full bg-white/5 border border-white/10 rounded-xl py-3 px-10
            text-white scheme-dark
            transition-all duration-200 outline-none
            focus:border-emerald-600/50 focus:ring-4 focus:ring-emerald-600/5
            ${error ? 'border-red-500/50' : ''}
            ${className}
          `}
                    {...props}
                />
            </div>
            {error && <p className="text-xs text-red-400 ml-1">{error}</p>}
        </div>
    );
};
