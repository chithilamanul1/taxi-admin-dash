const fs = require('fs');

function fixFleetSection() {
    let content = fs.readFileSync('src/components/FleetSection.jsx', 'utf8');

    // Remove section top border
    content = content.replace(/border-t-2 border-slate-200 dark:border-white\/10/g, '');

    // Header label - remove box
    content = content.replace(/bg-\[#FACC15\] text-black w-fit px-3 py-1 text-\[10px\] font-black uppercase tracking-\[0.2em\] mb-4/g, 'text-[#FACC15] text-[12px] font-black uppercase tracking-[0.4em] mb-6 flex items-center gap-3');

    // Card Container
    content = content.replace(/className=\"flex-shrink-0 w-\[85vw\] md:w-\[400px\] snap-center flex flex-col border border-slate-100 dark:border-white\/10 bg-white dark:bg-zinc-900 shadow-xl shadow-slate-200\/50 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200\"/g, 
                             'className=\"flex-shrink-0 w-[85vw] md:w-[420px] snap-center flex flex-col bg-white dark:bg-zinc-900/50 rounded-[3rem] shadow-2xl shadow-slate-200/30 dark:shadow-none border border-slate-100 dark:border-white/5 overflow-hidden group/f-card transition-all duration-500 hover:scale-[1.02]\"');

    // Inner Header
    content = content.replace(/bg-white dark:bg-zinc-800 text-black dark:text-white p-3 text-center border-b-2 border-slate-200 dark:border-white\/10 font-black uppercase tracking-\[0.3em\] text-\[10px\]/g, 
                             'bg-slate-50 dark:bg-white/5 text-slate-400 p-5 text-center font-black uppercase tracking-[0.4em] text-[10px]');

    // Image Box
    content = content.replace(/bg-\[#F1F3F4\] dark:bg-zinc-800 border-b-2 border-slate-200 dark:border-white\/10/g, 'bg-transparent');

    fs.writeFileSync('src/components/FleetSection.jsx', content, 'utf8');
}

fixFleetSection();
