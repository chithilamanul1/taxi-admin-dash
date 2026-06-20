export function getFallbackImage(title) {
    if (!title) return '/sigiriya-new-hero.png';
    const lowerTitle = title.toLowerCase();

    if (lowerTitle.includes('kandy')) return '/kandy-new.png';
    if (lowerTitle.includes('galle')) return '/galle-new.png';
    if (lowerTitle.includes('yala')) return '/yala-new.png';
    if (lowerTitle.includes('wilpattu') || lowerTitle.includes('udawalawe')) return '/wilpattu-new.png';
    if (lowerTitle.includes('nuwara eliya')) return '/nuwara-eliya-new.png';
    if (lowerTitle.includes('mirissa') || lowerTitle.includes('whale')) return '/mirissa-new-fix.png';
    if (lowerTitle.includes('bentota')) return '/bentota-new.png';
    if (lowerTitle.includes('hikkaduwa')) return '/hikkaduwa-new.png';
    if (lowerTitle.includes('unawatuna')) return '/unawatuna-new.png';
    if (lowerTitle.includes('ahangama')) return '/ahangama-new.png';
    if (lowerTitle.includes('tangalle')) return '/tangalle-new.png';
    if (lowerTitle.includes('trincomalee')) return '/trincomalee-new.png';
    if (lowerTitle.includes('pasikudah')) return '/pasikudah-new.png';
    if (lowerTitle.includes('arugam bay')) return '/arugam-bay-new.png';
    
    // Theme fallbacks
    if (lowerTitle.includes('safari') || lowerTitle.includes('leopard') || lowerTitle.includes('elephant')) return '/yala-new.png';
    if (lowerTitle.includes('buddhist') || lowerTitle.includes('temple')) return '/kandy-new.png';
    if (lowerTitle.includes('beach') || lowerTitle.includes('coast')) return '/bentota-new.png';
    if (lowerTitle.includes('ramayana')) return '/nuwara-eliya-new.png';

    // Default fallback
    return '/sigiriya-new-hero.png';
}
