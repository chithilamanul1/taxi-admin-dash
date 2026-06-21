const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.tsx')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(path.join(__dirname, 'src/app'));
let changedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('srilankantaxi.lk')) {
        content = content.replace(/srilankantaxi\.lk/g, 'airporttaxis.lk');
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated ${file}`);
        changedCount++;
    }
});

console.log(`Updated ${changedCount} files.`);
