const fs = require('fs');
const path = require('path');

function getTracedSize(nftFile) {
    try {
        const content = fs.readFileSync(nftFile, 'utf8');
        const data = JSON.parse(content);
        let size = 0;
        const baseDir = path.dirname(nftFile);

        data.files.forEach(file => {
            const filePath = path.join(baseDir, file);
            try {
                const stats = fs.statSync(filePath);
                size += stats.size;
            } catch (e) { }
        });
        return size;
    } catch (e) {
        return 0;
    }
}

function findNftFiles(dir, fileList = []) {
    try {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const filePath = path.join(dir, file);
            if (fs.statSync(filePath).isDirectory()) {
                findNftFiles(filePath, fileList);
            } else if (filePath.endsWith('.nft.json')) {
                fileList.push({ file: filePath, size: getTracedSize(filePath) });
            }
        });
    } catch (e) { }
    return fileList;
}

const nfts = findNftFiles(path.join(process.cwd(), '.next', 'server', 'app'));
nfts.sort((a, b) => b.size - a.size);

console.log("Top 10 Largest Serverless Function Traces:");
nfts.slice(0, 10).forEach(nft => {
    console.log(`${nft.file.replace(process.cwd(), '')}: ${(nft.size / (1024 * 1024)).toFixed(2)} MB`);
});
