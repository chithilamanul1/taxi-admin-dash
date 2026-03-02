const fs = require('fs');
const path = require('path');

function getFolderSize(folderPath) {
    let sum = 0;
    try {
        const stats = fs.statSync(folderPath);
        if (stats.isFile()) return stats.size;
        if (stats.isDirectory()) {
            const files = fs.readdirSync(folderPath);
            files.forEach(file => {
                sum += getFolderSize(path.join(folderPath, file));
            });
        }
    } catch (e) { }
    return sum;
}

const dir = path.join(__dirname, '.next', 'standalone', 'node_modules');
if (!fs.existsSync(dir)) {
    console.log("No standalone node_modules found");
    process.exit(0);
}

const folders = fs.readdirSync(dir);
const sizes = [];
folders.forEach(folder => {
    if (folder.startsWith('.')) return;
    const fPath = path.join(dir, folder);
    if (folder.startsWith('@')) {
        const sub = fs.readdirSync(fPath);
        sub.forEach(s => {
            const subPath = path.join(fPath, s);
            sizes.push({ name: `${folder}/${s}`, size: getFolderSize(subPath) });
        });
    } else {
        sizes.push({ name: folder, size: getFolderSize(fPath) });
    }
});

sizes.sort((a, b) => b.size - a.size);
sizes.slice(0, 15).forEach(m => {
    console.log(`${m.name}: ${(m.size / (1024 * 1024)).toFixed(2)} MB`);
});
