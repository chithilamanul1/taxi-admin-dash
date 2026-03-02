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
console.log("Public Folder:", (getFolderSize('public') / (1024 * 1024)).toFixed(2), "MB");
console.log("Next Server:", (getFolderSize('.next/server') / (1024 * 1024)).toFixed(2), "MB");
console.log("Next Static:", (getFolderSize('.next/static') / (1024 * 1024)).toFixed(2), "MB");
console.log("Next Cache:", (getFolderSize('.next/cache') / (1024 * 1024)).toFixed(2), "MB");
