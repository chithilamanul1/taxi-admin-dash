const fs = require('fs');
let content = fs.readFileSync('src/data/tours-data.js', 'utf8');

const replacements = {
    'galle-bentota-day-tour': '/images/tours/bentota.jpg',
    'anuradhapura-sacred-city': '/images/tours/anuradhapura.png',
    'kitulgala-adventure-rafting': '/images/tours/kitulgala.png',
    'private-sigiriya-dambulla': '/images/tours/sigiriya.jpg',
    'colombo-galle-bentota-day-trip': '/images/tours/galle.jpg',
    'colombo-city-tour': '/images/tours/colombo.jpg',
    'colombo-private-shopping': '/images/tours/colombo2.jpg',
    'negombo-southern-coast': '/images/tours/galle2.jpg',
    'negombo-sigiriya-safari': '/images/tours/safari_minneriya.png',
    'ambuluwawa-kandy': '/images/tours/ambuluwawa.jpg',
    'nuwara-eliya-tea-gardens': '/images/tours/nuwara_eliya.png',
    'udawalawe-wildlife-safari': '/images/tours/safari_udawalawe.png',
    'yala-national-park-safari': '/images/tours/safari_yala.png',
    'sinharaja-rainforest-trek': '/images/tours/sinharaja.png',
    'polonnaruwa-ancient-city': '/images/tours/polonnaruwa.png',
    'whale-watching-mirissa': '/mirissa-new-fix.png',
    'pinnawala-elephant-orphanage-tour': '/kandy-new.png',
    'kandy-heritage-cultural-tour': '/images/tours/kandy.jpg',
    'ratnapura-gem-mining-tour': '/images/tours/ratnapura.png',
    'hikkaduwa-marine-park-day-tour': '/images/tours/bentota.jpg',
    'negombo-city-lagoon-tour': '/images/tours/colombo.png'
};

for (const [id, imagePath] of Object.entries(replacements)) {
    const regex = new RegExp(`id:\\s*'${id}'[\\s\\S]*?image:\\s*'https://images\\.unsplash\\.com/[^']*'`);
    content = content.replace(regex, (match) => {
        return match.replace(/image:\s*'https:\/\/images\.unsplash\.com\/[^']*'/, `image: '${imagePath}'`);
    });
}

fs.writeFileSync('src/data/tours-data.js', content);
console.log('Done replacing images in tours-data.js');
