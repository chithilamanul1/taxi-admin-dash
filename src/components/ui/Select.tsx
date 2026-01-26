import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: { label: string; value: string | number }[];
    error?: string;
}

export const Select: React.FC<SelectProps> = ({ label, options, error, className = '', ...props }) => {
    return (
        <div className="w-full space-y-1.5">
            {label && <label className="text-sm font-medium text-gray-300 ml-1">{label}</label>}
            <div className="relative group">
                <select
                    className={`
            w-full appearance-none bg-white/5 border border-white/10 rounded-xl py-3 px-4 pr-10
            text-white transition-all duration-200 outline-none
            focus:border-emerald-600/50 focus:ring-4 focus:ring-emerald-600/5
            ${error ? 'border-red-500/50' : ''}
            ${className}
          `}
                    {...props}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-slate-900 border-none">
                            {opt.label}
                        </option>
                    ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 group-focus-within:text-emerald-600 transition-colors">
                    <ChevronDown size={18} />
                </div>
            </div>
            {error && <p className="text-xs text-red-400 ml-1">{error}</p>}
        </div>
    );
};
