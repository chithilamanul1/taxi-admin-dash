'use client';

import Link from 'next/link';
import { CheckCircle, Home } from 'lucide-react';

export default function RegistrationSuccess() {
    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="bg-slate-900 rounded-[2rem] border border-slate-800 p-8 md:p-12 text-center max-w-lg w-full animate-slide-up">
                <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="text-emerald-500 w-12 h-12" />
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-slate-100 uppercase tracking-tight mb-4">Application <span className="text-emerald-500">Received</span></h1>
                <p className="text-slate-400 leading-relaxed mb-8">
                    Your application has been successfully submitted to our admin team. We will review your documents and contact you via WhatsApp once approved.
                </p>
                <div className="flex flex-col gap-3">
                    <Link href="/" className="flex items-center justify-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-sm font-black uppercase tracking-wider transition-colors shadow-lg shadow-amber-500/20">
                        <Home size={18} /> Return to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
