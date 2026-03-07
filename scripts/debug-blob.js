const fs = require('fs');
const content = fs.readFileSync('public/daytrips.csv', 'utf8');
const firstLines = content.split('\n').slice(0, 3).join('\n');
fs.writeFileSync('scripts/debug-blob.txt', firstLines);
