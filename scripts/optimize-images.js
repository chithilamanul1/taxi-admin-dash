const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const images = [
    { name: 'hero.jpg', width: 1920 },
    { name: 'sigiriya.jpg', width: 1920 },
    { name: 'ella.jpg', width: 1920 },
    { name: 'mirissa.jpg', width: 1920 }
];

const publicDir = path.join(__dirname, '../public');

async function optimizeImages() {
    console.log('Starting image optimization...');

    for (const img of images) {
        const filePath = path.join(publicDir, img.name);
        if (fs.existsSync(filePath)) {
            const buffer = fs.readFileSync(filePath);
            const statsBefore = fs.statSync(filePath);

            console.log(`Optimizing ${img.name} (${(statsBefore.size / 1024 / 1024).toFixed(2)} MB)...`);

            try {
                // Compress and resize
                // Use a temporary file to avoid reading/writing same file issues if sync/async clash (though toFile handles it usually, buffer is safe)
                await sharp(buffer)
                    .resize({ width: img.width, withoutEnlargement: true })
                    .jpeg({ quality: 75, mozjpeg: true })
                    .toFile(filePath);

                const statsAfter = fs.statSync(filePath);
                console.log(`✔ Optimized ${img.name}: ${(statsAfter.size / 1024 / 1024).toFixed(2)} MB`);
            } catch (err) {
                console.error(`Error optimizing ${img.name}:`, err);
            }
        } else {
            console.warn(`File not found: ${img.name}`);
        }
    }
}

optimizeImages();
