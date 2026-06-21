// An array of high-quality, visually stunning Unsplash images of Sri Lanka
const UNIQ_IMAGES = [
    'https://images.unsplash.com/photo-1580881761697-359f47bc57c0?q=80&w=1600&auto=format&fit=crop', // Coastal/Palm
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1600&auto=format&fit=crop', // City/Train
    'https://images.unsplash.com/photo-1582239454124-7186104bc7a0?q=80&w=1600&auto=format&fit=crop', // Elephant
    'https://images.unsplash.com/photo-1554593455-83f089304323?q=80&w=1600&auto=format&fit=crop', // Tea fields
    'https://images.unsplash.com/photo-1560173618-97e3612d4d9c?q=80&w=1600&auto=format&fit=crop', // Beach Sunset
    'https://images.unsplash.com/photo-1579308150495-2c8bd6324dcc?q=80&w=1600&auto=format&fit=crop', // Sigiriya
    'https://images.unsplash.com/photo-1625736301389-9e8c465aabf2?q=80&w=1600&auto=format&fit=crop', // Temple
    'https://images.unsplash.com/photo-1608681530396-0816bdf67b07?q=80&w=1600&auto=format&fit=crop', // Beach boats
    'https://images.unsplash.com/photo-1588263595674-6816ec5a6dc6?q=80&w=1600&auto=format&fit=crop', // Nine Arch Bridge
    'https://images.unsplash.com/photo-1587320092265-ccaa4eb0cd8f?q=80&w=1600&auto=format&fit=crop', // Stilt Fishermen
    'https://images.unsplash.com/photo-1585807185011-85942fdf4e8a?q=80&w=1600&auto=format&fit=crop', // Leopard
    'https://images.unsplash.com/photo-1605335193910-40c21e35fbb9?q=80&w=1600&auto=format&fit=crop', // Ruwanwelisaya
    'https://images.unsplash.com/photo-1616801901844-3c6c8ce75661?q=80&w=1600&auto=format&fit=crop', // Kandy Lake
    'https://images.unsplash.com/photo-1618641738722-e42ee2796fae?q=80&w=1600&auto=format&fit=crop', // Galle Fort
    'https://images.unsplash.com/photo-1594916327387-9b2f6762dc84?q=80&w=1600&auto=format&fit=crop', // Waterfall
    'https://images.unsplash.com/photo-1588636170669-e580e0717cb6?q=80&w=1600&auto=format&fit=crop', // Beach chill
    'https://images.unsplash.com/photo-1600465243171-4ce8b8f212f4?q=80&w=1600&auto=format&fit=crop', // Peacocks / Nature
    'https://images.unsplash.com/photo-1577905383569-8bc370ce5f8f?q=80&w=1600&auto=format&fit=crop', // Yala / Wild
    'https://images.unsplash.com/photo-1608681530396-0816bdf67b07?q=80&w=1600&auto=format&fit=crop', // Arugam bay / Surf
    'https://images.unsplash.com/photo-1599540058965-0a8a65d774f3?q=80&w=1600&auto=format&fit=crop'  // Scenic road
];

export function getFallbackImage(title) {
    if (!title) return '/sigiriya-new-hero.png';
    const lowerTitle = title.toLowerCase();

    // The user explicitly requested separated images for EACH package so they aren't all the same.
    // We will hash the title string to consistently pick one of our high-quality Unsplash images.
    let hash = 0;
    for (let i = 0; i < lowerTitle.length; i++) {
        hash = lowerTitle.charCodeAt(i) + ((hash << 5) - hash);
    }
    hash = Math.abs(hash);
    
    // Pick an index from the unique images array based on the title
    const imageIndex = hash % UNIQ_IMAGES.length;
    
    return UNIQ_IMAGES[imageIndex];
}
