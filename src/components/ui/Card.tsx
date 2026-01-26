import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
    return (
        <div className={`bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 hover:shadow-gold/10 ${className}`}>
            {children}
        </div>
    );
};

export const CardHeader: React.FC<CardProps> = ({ children, className = '' }) => (
    <div className={`p-6 ${className}`}>{children}</div>
);

export const CardTitle: React.FC<CardProps> = ({ children, className = '' }) => (
    <h3 className={`text-xl font-bold text-white ${className}`}>{children}</h3>
);

export const CardDescription: React.FC<CardProps> = ({ children, className = '' }) => (
    <p className={`text-gray-400 mt-2 text-sm leading-relaxed ${className}`}>{children}</p>
);

export const CardContent: React.FC<CardProps> = ({ children, className = '' }) => (
    <div className={`p-6 pt-0 ${className}`}>{children}</div>
);

export const CardFooter: React.FC<CardProps> = ({ children, className = '' }) => (
    <div className={`p-6 border-t border-white/10 ${className}`}>{children}</div>
);
