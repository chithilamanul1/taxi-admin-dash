const fs = require('fs');

function revertToLuxury(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Remove Brutalist borders
    content = content.replace(/border-\[3px\] border-black/g, 'border border-slate-100 dark:border-white/10');
    content = content.replace(/border-2 border-black/g, 'border border-slate-100 dark:border-white/10');
    content = content.replace(/border-black/g, 'border-slate-200 dark:border-white/10');

    // 2. Remove hard shadows
    content = content.replace(/shadow-\[12px_12px_0px_0px_rgba\(0,0,0,1\)\]/g, 'shadow-2xl shadow-slate-200/50 dark:shadow-none');
    content = content.replace(/shadow-\[4px_4px_0px_0px_rgba\(0,0,0,1\)\]/g, 'shadow-lg');
    content = content.replace(/shadow-\[6px_6px_0px_0px_rgba\(0,0,0,1\)\]/g, 'shadow-xl');
    content = content.replace(/shadow-\[8px_8px_0_0_#FACC15\]/g, 'shadow-lg shadow-yellow-400/20');
    content = content.replace(/shadow-\[8px_8px_0px_0px_rgba\(250,204,21,1\)\]/g, 'shadow-lg shadow-yellow-400/20');

    // 3. Fix Step 2 Inputs specifically
    content = content.replace(/h-20 bg-white/g, 'h-16 bg-slate-50 dark:bg-white/5');
    content = content.replace(/rounded-3xl flex focus-within:shadow-\[8px_8px_0px_0px_rgba\(250,204,21,1\)\]/g, 'rounded-2xl flex focus-within:ring-2 focus-within:ring-yellow-400/20');
    content = content.replace(/rounded-3xl outline-none focus:shadow-\[8px_8px_0_0_#FACC15\]/g, 'rounded-2xl outline-none focus:ring-2 focus:ring-yellow-400/20');
    
    // 4. Fix summary card icons
    content = content.replace(/bg-slate-50 dark:bg-white\/5 rounded-2xl p-4 border-2 border-slate-200 dark:border-white\/10/g, 'bg-slate-50 dark:bg-white/5 rounded-2xl p-4');

    // 5. Fix tooltip in FloatingContact
    content = content.replace(/shadow-\[6px_6px_0px_0px_rgba\(0,0,0,1\)\] border-2 border-black/g, 'shadow-lg shadow-yellow-600/20');

    fs.writeFileSync(filePath, content, 'utf8');
}

revertToLuxury('src/components/BookingModal.jsx');
revertToLuxury('src/components/VehicleCarousel.jsx');
revertToLuxury('src/components/FloatingContact.jsx');

console.log('Reverted to Luxury style (soft shadows, thin borders)');
